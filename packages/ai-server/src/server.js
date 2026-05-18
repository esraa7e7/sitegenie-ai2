import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

export const generateSite = async (req, res) => {
  try {
    // TODO: Add authentication logic here if needed

    const { userPrompt } = req.body;

    const systemPrompt = `You are a strict, production-grade JSON generator. Your sole purpose is to output valid, minified JSON that represents a website configuration. The JSON you output will directly populate a JavaScript object used to render a website. Therefore, it MUST be perfectly formed, with no extraneous characters, comments, or explanations. Do NOT include any markdown formatting like ```json. Just the raw, minified JSON. The JSON should conform to the WebsiteConfig type definition.`;

    const response = await hf.chatCompletion({
      model: "Qwen/Qwen3.6-35B-A3B", // الموديل القوي في الأكواد
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a custom website for: ${userPrompt}` }
      ],
      max_tokens: 2000,
      temperature: 0.2 // درجة حرارة منخفضة جداً عشان يلتزم بالـ JSON وميجودش من عنده
    });

    const aiText = response.choices[0].message.content.trim();
    
    // تحويل النص الراجع لـ JSON حقيقي قبل ما نبعته للـ Front-end
    const cleanJsonData = JSON.parse(aiText);

    return res.status(200).json({ success: true, websiteConfig: cleanJsonData });

  } catch (error) {
    console.error("Parsing or AI generation error:", error);
    return res.status(500).json({ success: false, error: "فشل توليد هيكل الموقع، تأكد من الـ Prompt" });
  }
};

app.post("/generate", generateSite);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SiteGenie AI Backend Started Successfully!`);
  console.log(`Node Version: ${process.version}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Server listening on port ${PORT}`);
});

export default app;
