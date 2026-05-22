import { LLMConfig, LLMRequest, LLMResponse } from "./types.js";
export declare class LLMProvider {
    private config;
    constructor(config: LLMConfig);
    generate(request: LLMRequest): Promise<LLMResponse>;
    private generateGemini;
    private generateOpenAI;
    private generateAnthropic;
}
//# sourceMappingURL=LLMProvider.d.ts.map