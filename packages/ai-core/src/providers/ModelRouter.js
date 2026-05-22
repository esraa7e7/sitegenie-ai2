export class ModelRouter {
    constructor(apiKeys) {
        Object.defineProperty(this, "apiKeys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiKeys = apiKeys;
    }
    route(options) {
        const { role, taskType, preference } = options;
        let provider = 'gemini';
        let model = 'gemini-1.5-pro-latest';
        // Industry Standard Routing Logic
        if (preference === 'quality' || taskType === 'reasoning') {
            if (this.apiKeys.ANTHROPIC_API_KEY) {
                provider = 'anthropic';
                model = 'claude-3-5-sonnet-latest';
            }
            else if (this.apiKeys.OPENAI_API_KEY) {
                provider = 'openai';
                model = 'gpt-4o';
            }
            else if (this.apiKeys.OPENROUTER_API_KEY) {
                provider = 'openrouter';
                model = 'deepseek/deepseek-r1';
            }
        }
        else if (taskType === 'code') {
            if (this.apiKeys.GROQ_API_KEY) {
                provider = 'groq';
                model = 'qwen-2.5-coder-32b';
            }
            else if (this.apiKeys.ANTHROPIC_API_KEY) {
                provider = 'anthropic';
                model = 'claude-3-5-sonnet-latest';
            }
        }
        else if (preference === 'speed' && this.apiKeys.GROQ_API_KEY) {
            provider = 'groq';
            model = 'llama-3.3-70b-versatile';
        }
        // Smart Fallbacks
        if (!this.getApiKey(provider)) {
            provider = 'gemini';
            model = 'gemini-1.5-pro-latest';
        }
        return {
            provider,
            model,
            apiKey: this.getApiKey(provider),
            temperature: taskType === 'code' ? 0.1 : 0.7, // Lower temperature for code stability
            maxTokens: 8192
        };
    }
    getApiKey(provider) {
        switch (provider) {
            case 'gemini': return this.apiKeys.GEMINI_API_KEY;
            case 'groq': return this.apiKeys.GROQ_API_KEY;
            case 'openrouter': return this.apiKeys.OPENROUTER_API_KEY;
            case 'anthropic': return this.apiKeys.ANTHROPIC_API_KEY;
            case 'openai': return this.apiKeys.OPENAI_API_KEY;
            default: return '';
        }
    }
    /**
     * Adaptive Fallback Routing
     */
    async routeWithFallback(options) {
        const config = this.route(options);
        // Check if the primary choice has a key
        if (this.getApiKey(config.provider)) {
            return config;
        }
        // Tiered Fallback
        console.warn(`[ModelRouter] No key for ${config.provider}. Routing to fallback tier.`);
        if (this.apiKeys.ANTHROPIC_API_KEY)
            return { ...config, provider: 'anthropic', model: 'claude-3-5-sonnet-latest', apiKey: this.apiKeys.ANTHROPIC_API_KEY };
        if (this.apiKeys.OPENAI_API_KEY)
            return { ...config, provider: 'openai', model: 'gpt-4o', apiKey: this.apiKeys.OPENAI_API_KEY };
        // Universal Fallback
        return { ...config, provider: 'gemini', model: 'gemini-1.5-pro-latest', apiKey: this.apiKeys.GEMINI_API_KEY };
    }
}
