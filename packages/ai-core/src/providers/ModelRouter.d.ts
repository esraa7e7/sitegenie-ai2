import { LLMConfig } from "./types.js";
import { AgentRole } from "../types.js";
export interface ModelRoutingOptions {
    role?: AgentRole;
    taskType?: 'code' | 'reasoning' | 'ui' | 'general';
    preference?: 'speed' | 'quality' | 'cost';
}
export declare class ModelRouter {
    private apiKeys;
    constructor(apiKeys: Record<string, string>);
    route(options: ModelRoutingOptions): LLMConfig;
    private getApiKey;
    /**
     * Adaptive Fallback Routing
     */
    routeWithFallback(options: ModelRoutingOptions): Promise<LLMConfig>;
}
//# sourceMappingURL=ModelRouter.d.ts.map