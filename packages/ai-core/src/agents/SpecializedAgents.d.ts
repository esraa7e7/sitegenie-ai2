/**
 * Simplified Specialized AI Agents - cleaned to avoid parsing edge cases
 */
import { BaseAgent } from './BaseAgent.js';
import type { AgentInput, AgentOutput } from '@sitegenie/shared';
export declare class PlannerAgent extends BaseAgent {
    constructor();
    execute(_projectId: string, input: AgentInput): Promise<AgentOutput>;
}
export declare class UIAgent extends BaseAgent {
    constructor();
    execute(_projectId: string, _input: AgentInput): Promise<AgentOutput>;
}
export declare class BackendAgent extends BaseAgent {
    constructor();
    execute(_projectId: string, _input: AgentInput): Promise<AgentOutput>;
}
export declare class APIAgent extends BaseAgent {
    constructor();
    execute(_projectId: string, _input: AgentInput): Promise<AgentOutput>;
}
export declare class RefactorAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class DebugAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class SecurityAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class TestingAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class DeploymentAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class MemoryAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
export declare class OptimizationAgent extends BaseAgent {
    constructor();
    execute(): Promise<AgentOutput>;
}
//# sourceMappingURL=SpecializedAgents.d.ts.map