import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xssClean from "xss-clean";
import { HfInference } from "@huggingface/inference";
import { z } from "zod";
import { jwtVerify, importSPKI } from "jose";
import { WebsiteConfigSchema } from "@sitegenie/shared-types";

// Load env first
dotenv.config();

// Environment validation
const envSchema = z.object({
  HF_TOKEN: z.string().nonempty(),
  NODE_ENV: z.string().default("development"),
  PORT: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  AUTH_REQUIRED: z.union([z.literal("true"), z.literal("false")]).default("false"),
  JWT_SECRET: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().optional(),
  RATE_LIMIT_MAX: z.string().optional(),
  HF_REQUEST_TIMEOUT_MS: z.string().optional()
});

let env;
try {
  env = envSchema.parse(process.env);
} catch (e) {
  console.error("Invalid environment configuration:", e);
  process.exit(1);
}

const hf = new HfInference(env.HF_TOKEN);

const app = express();

// Security middlewares
app.use(helmet());
app.use(xssClean());
app.use(express.json({ limit: "200kb" }));

// Strict CORS
const allowedOrigins = env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(",").map(s => s.trim()) : ["http://localhost:5173"];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or same-origin requests without origin
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(env.RATE_LIMIT_MAX || 60),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Simple auth middleware (optional, enabled via AUTH_REQUIRED=true)
async function authMiddleware(req, res, next) {
  if (env.AUTH_REQUIRED === "true") {
    try {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ success: false, error: "Unauthorized" });
      const token = auth.slice(7);

      if (env.JWT_PUBLIC_KEY) {
        // RS256 public key in PEM format
        const key = await importSPKI(env.JWT_PUBLIC_KEY, "RS256");
        await jwtVerify(token, key);
      } else if (env.JWT_SECRET) {
        // HS256 symmetric key
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        await jwtVerify(token, secret);
      } else {
        return res.status(500).json({ success: false, error: "Auth configured but no JWT key available" });
      }

      return next();
    } catch (err) {
      console.warn("JWT verification failed", err);
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
  }
  return next();
}

// Helper: sanitize and check for prompt-injection patterns
function sanitizePrompt(input) {
  if (typeof input !== "string") return "";
  let s = input
    .replace(/```[\s\S]*?```/g, "") // remove fenced code
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[\u0000-\u001F\u007F]+/g, "") // control chars
    .trim();

  // remove common system-like prefixes
  s = s.replace(/^\s*(system:|you are|assistant:|user:)/i, "");

  return s.slice(0, 2000);
}

function detectPromptInjection(input) {
  const lowered = (input || "").toLowerCase();
  const bad = [
    "ignore previous",
    "forget previous",
    "you are now",
    "disregard earlier",
    "follow these instructions",
    "system prompt",
    "do not follow"
  ];
  return bad.some(b => lowered.includes(b));
}

// Body validation
const requestSchema = z.object({
  userPrompt: z.string().min(1).max(2000)
});

// Timeout helper
function withTimeout(promise, ms) {
  const timeout = ms || Number(env.HF_REQUEST_TIMEOUT_MS || 30_000);
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("AI request timeout")), timeout))
  ]);
}

export const generateSite = async (req, res) => {
  try {
    // auth middleware already applied globally for routes that need it; keep optional check here

    const parse = requestSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ success: false, error: "Invalid request body" });

    let { userPrompt } = parse.data;
    userPrompt = sanitizePrompt(userPrompt);

    if (detectPromptInjection(userPrompt)) {
      return res.status(400).json({ success: false, error: "Prompt rejected: potential injection detected" });
    }

    const systemPrompt = `You are a strict, production-grade JSON generator. Your sole purpose is to output valid, minified JSON that represents a website configuration. The JSON you output will directly populate a JavaScript object used to render a website. Therefore, it MUST be perfectly formed, with no extraneous characters, comments, or explanations. Do NOT include any markdown formatting like \\`\\`\\`json. Just the raw, minified JSON. The JSON should conform to the WebsiteConfig type definition.`;

    const hfPromise = hf.chatCompletion({
      model: "Qwen/Qwen3.6-35B-A3B",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a custom website for: ${userPrompt}` }
      ],
      max_tokens: 2000,
      temperature: 0.2
    });

    const response = await withTimeout(hfPromise);

    const aiText = (response?.choices?.[0]?.message?.content || "").trim();

    if (!aiText || !/^[\[{]/.test(aiText)) {
      console.error("AI response not JSON-like:", aiText?.slice(0, 200));
      return res.status(502).json({ success: false, error: "Invalid AI response format" });
    }

    // Safe JSON parse
    let cleanJsonData;
    try {
      cleanJsonData = JSON.parse(aiText);
    } catch (err) {
      console.error("AI JSON parse error:", err);
      return res.status(502).json({ success: false, error: "AI returned malformed JSON" });
    }

    const websiteConfigValidation = WebsiteConfigSchema.safeParse(cleanJsonData);
    if (!websiteConfigValidation.success) {
      console.error("WebsiteConfig validation failed:", websiteConfigValidation.error.format());
      return res.status(502).json({ success: false, error: "AI returned JSON that does not match the expected website configuration schema" });
    }

    return res.status(200).json({ success: true, websiteConfig: websiteConfigValidation.data });

  } catch (error) {
    console.error("Generation error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Apply auth middleware to generation route if enabled
app.post("/generate", authMiddleware, generateSite);

app.get("/", (_req, res) => {
  res.json({ success: true, message: "SiteGenie AI Backend Running" });
});

const PORT = Number(env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`🚀 SiteGenie AI Backend Started Successfully!`);
  console.log(`Node Version: ${process.version}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Server listening on port ${PORT}`);
});

export default app;
