import express, { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// --- ENV Validation ---
const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "SUPABASE_JWT_SECRET",
];

for (const envVar of requiredEnv) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing environment variable - ${envVar}`);
    process.exit(1);
  }
}

// --- Prisma Singleton ---
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ["query", "info", "warn", "error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "&connection_limit=1", // Vercel Serverless connection limit
    },
  },
});

if (process.env.NODE_ENV === "development") global.prisma = prisma;

// --- Express App ---
const app = express();

// --- Security Middlewares ---
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*", // Configure as needed for production
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Sanitize inputs

// --- Health Check ---
app.get("/api/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "ok",
      database: true,
      uptime: process.uptime(),
    });
  } catch (error: any) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      database: false,
      uptime: process.uptime(),
      message: error.message,
    });
  }
});

// --- API Routes ---
app.post("/api/generate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Input sanitation example (more comprehensive validation needed for production)
    const { prompt, userAppId } = req.body;
    if (typeof prompt !== "string" || typeof userAppId !== "string") {
      return res.status(400).json({ error: "Invalid input types" });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Missing auth token"
      });
    }

    const token = authHeader.split(" ")[1];

    const secret = new TextEncoder().encode(
      process.env.SUPABASE_JWT_SECRET as string
    );

    const { payload } = await jwtVerify(token, secret);

    console.log(`[Backend] User authenticated: ${payload.sub}`);

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    const { data, error } = await supabase
      .from("user_apps")
      .select("encrypted_gemini_key")
      .eq("id", userAppId)
      .single();

    if (error || !data) {
      return res.status(400).json({
        error: "API key not configured or user app not found"
      });
    }

    const decryptedKey = data.encrypted_gemini_key;

    const genAI = new GoogleGenerativeAI(decryptedKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });

    // Gemini API with retry and timeout (basic implementation)
    const MAX_RETRIES = 3;
    const TIMEOUT = 10000; // 10 seconds
    let attempts = 0;
    let geminiResponse: any;

    while (attempts < MAX_RETRIES) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT);
        geminiResponse = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API Timeout")), TIMEOUT)
          ),
        ]);
        clearTimeout(id);
        break;
      } catch (geminiError: any) {
        attempts++;
        console.warn(`Gemini API attempt ${attempts} failed: ${geminiError.message}`);
        if (attempts === MAX_RETRIES) {
          throw new Error(`Gemini API failed after ${MAX_RETRIES} attempts: ${geminiError.message}`);
        }
        // Simple exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }

    const text = geminiResponse.response.text();

    return res.json({
      success: true,
      content: text,
      metadata: {
        server_processed: true
      }
    });

  } catch (error: any) {
    next(error); // Pass error to centralized error handler
  }
});

// --- Centralized Error Handling Middleware ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Centralized Error]", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack in dev
  });
});

export default app;
