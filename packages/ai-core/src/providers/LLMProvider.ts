import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import { Anthropic } from "@anthropic-ai/sdk";
import { LLMConfig, LLMRequest, LLMResponse } from "./types.js";

export class LLMProvider {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    switch (this.config.provider) {
      case 'gemini':
        return this.generateGemini(request);
      case 'groq':
      case 'openrouter':
      case 'openai':
        return this.generateOpenAI(request);
      case 'anthropic':
        return this.generateAnthropic(request);
      default:
        throw new Error(`Provider ${this.config.provider} not supported`);
    }
  }

  private async generateGemini(request: LLMRequest): Promise<LLMResponse> {
    const genAI = new GoogleGenerativeAI(this.config.apiKey);
    const model = genAI.getGenerativeModel({ 
      model: this.config.model,
      systemInstruction: request.systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: request.userPrompt }] }],
      generationConfig: {
        temperature: request.temperature || this.config.temperature,
        maxOutputTokens: request.maxTokens || this.config.maxTokens,
      }
    });

    const response = await result.response;
    return {
      text: response.text(),
      model: this.config.model,
    };
  }

  private async generateOpenAI(request: LLMRequest): Promise<LLMResponse> {
    let baseUrl = this.config.baseUrl;
    
    if (this.config.provider === 'groq') {
      baseUrl = baseUrl || 'https://api.groq.com/openai/v1';
    } else if (this.config.provider === 'openrouter') {
      baseUrl = baseUrl || 'https://openrouter.ai/api/v1';
    }

    const openai = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: baseUrl,
      dangerouslyAllowBrowser: true, // Only if used in edge/server, but types match
    });

    const messages: any[] = [];
    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }
    messages.push({ role: 'user', content: request.userPrompt });

    const completion = await openai.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: request.temperature || this.config.temperature,
      max_tokens: request.maxTokens || this.config.maxTokens,
    });

    return {
      text: completion.choices[0].message.content || '',
      model: this.config.model,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      }
    };
  }

  private async generateAnthropic(request: LLMRequest): Promise<LLMResponse> {
    const client = new Anthropic({
      apiKey: this.config.apiKey,
    });

    const response = await client.messages.create({
      model: this.config.model,
      system: request.systemPrompt,
      messages: [{ role: 'user', content: request.userPrompt }],
      max_tokens: request.maxTokens || this.config.maxTokens || 4096,
      temperature: request.temperature || this.config.temperature,
    });

    return {
      text: (response.content[0] as any).text || '',
      model: this.config.model,
    };
  }
}
