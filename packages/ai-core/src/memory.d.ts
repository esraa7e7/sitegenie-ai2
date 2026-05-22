import type { ProjectCode, ProjectVersion, ContextWindow } from "@sitegenie/shared";
import { AgentOutput } from "@sitegenie/shared";
export declare class ContextMemory {
    private memory;
    constructor();
    updateProjectCode(code: ProjectCode): void;
    addProjectHistory(version: ProjectVersion): void;
    updateUserPreferences(preferences: Record<string, unknown>): void;
    updatePreviousAgentOutput(agentType: string, output: AgentOutput): void;
    updateCurrentState(state: Record<string, unknown>): void;
    getMemory(): ContextWindow;
    resetMemory(): void;
}
//# sourceMappingURL=memory.d.ts.map