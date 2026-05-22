import type { ProjectCode, ProjectVersion, ContextWindow } from "@sitegenie/shared";
import { AgentOutput } from "@sitegenie/shared";

export class ContextMemory {
    private memory: ContextWindow;

    constructor() {
        this.memory = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }

    public updateProjectCode(code: ProjectCode): void {
        this.memory.projectCode = { ...this.memory.projectCode, ...code };
    }

    public addProjectHistory(version: ProjectVersion): void {
        this.memory.projectHistory.push(version);
    }

    public updateUserPreferences(preferences: Record<string, unknown>): void {
        this.memory.userPreferences = { ...this.memory.userPreferences, ...preferences };
    }

    public updatePreviousAgentOutput(agentType: string, output: AgentOutput): void {
        this.memory.previousAgentOutputs[agentType] = output;
    }

    public updateCurrentState(state: Record<string, unknown>): void {
        this.memory.currentState = { ...this.memory.currentState, ...state };
    }

    public getMemory(): ContextWindow {
        return this.memory;
    }

    public resetMemory(): void {
        this.memory = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }
}
