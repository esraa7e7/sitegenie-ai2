import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SiteGenie Backend Running"
  });
});

app.post("/generate", async (req, res) => {
  try {

    // =========================
    // JWT Validation
    // =========================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Missing auth token"
      });
    }

    const token = authHeader.split(" ")[1];

    const secret = new TextEncoder().encode(
      process.env.SUPABASE_JWT_SECRET
    );

    const { payload } = await jwtVerify(
      token,
      secret
    );

    console.log(
      `[Backend] User authenticated: ${payload.sub}`
    );

    // =========================
    // Request Body
    // =========================

    const { prompt, userAppId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    // =========================
    // Supabase
    // =========================

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("user_apps")
      .select("encrypted_gemini_key")
      .eq("id", userAppId)
      .single();

    if (error || !data) {
      return res.status(400).json({
        error: "API key not configured"
      });
    }

    // =========================
    // Temporary Decryption
    // =========================
    // Replace later with your secure encryption system

    const decryptedKey = data.encrypted_gemini_key;

    // =========================
    // Gemini AI
    // =========================

    const genAI = new GoogleGenerativeAI(
      decryptedKey
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });

    const result = await model.generateContent(
      prompt
    );

    const text = result.response.text();

    // =========================
    // Response
    // =========================

    return res.json({
      success: true,
      content: text,
      metadata: {
        server_processed: true
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});