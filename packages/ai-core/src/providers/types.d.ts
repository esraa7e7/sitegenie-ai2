export type ModelProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'openrouter';
export interface LLMConfig {
    provider: ModelProvider;
    model: string;
    apiKey: string;
    baseUrl?: string;
    maxTokens?: number;
    temperature?: number;
}
export interface LLMRequest {
    systemPrompt?: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}
export interface LLMResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
}
//# sourceMappingURL=types.d.ts.map