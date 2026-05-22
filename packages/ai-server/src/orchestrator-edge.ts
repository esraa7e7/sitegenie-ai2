import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";
import { ServerSecurity } from "@sitegenie/ai-core/dist/server-security";

// Supabase Edge Function Handler Simulation
export const sitegenieOrchestrator = async (req: Request) => {
  try {
    // 1. Auth & JWT Validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth token");
    
    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(
      token, 
      new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
    );

    // 2. Rate Limiting (Simple check)
    // In production, use Redis or Supabase's built-in hooks
    console.log(`[Backend] Processing request for user: ${payload.sub}`);

    const { prompt, userAppId } = await req.json();

    // 3. Secure Key Retrieval
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Never expose to frontend
    );

    const { data: appData, error: dbError } = await supabase
      .from('user_apps')
      .select('encrypted_gemini_key')
      .eq('id', userAppId)
      .single();

    if (dbError || !appData) throw new Error("API Key not configured");

    // 4. Decrypt in Memory
    const security = new ServerSecurity(process.env.ENCRYPTION_SECRET!);
    const decryptedKey = security.decrypt(appData.encrypted_gemini_key);

    // 5. Secure AI Request
    const genAI = new GoogleGenerativeAI(decryptedKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const result = await model.generateContent(prompt);
    
    return new Response(JSON.stringify({ 
      content: result.response.text(),
      metadata: { server_processed: true } 
    }), { status: 200 });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
