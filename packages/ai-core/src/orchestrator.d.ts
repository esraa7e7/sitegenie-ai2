/**
 * AgentOrchestrator - Master orchestrator for multi-agent system
 * Coordinates the multi-agent pipeline with context, memory, validation, and deployment readiness.
 */
import type { AgentTask, Project } from '@sitegenie/shared';
export interface OrchestratorConfig {
    maxRetries?: number;
    timeout?: number;
    enableStreaming?: boolean;
}
export declare class AgentOrchestrator {
    private plannerAgent;
    private uiAgent;
    private backendAgent;
    private apiAgent;
    private refactorAgent;
    private debugAgent;
    private securityAgent;
    private testingAgent;
    private deploymentAgent;
    private memoryAgent;
    private optimizationAgent;
    private memoryIndex;
    private config;
    private contextWindow;
    private executionHistory;
    constructor(config?: Partial<OrchestratorConfig>);
    private flattenProjectCode;
    private mergeProjectCode;
    private buildProject;
    private buildContext;
    private executeAgent;
    generateApplication(projectId: string, prompt: string, onProgress?: (status: string) => void): Promise<{
        project: Project;
        tasks: AgentTask[];
        files: Record<string, string>;
        summary: string | undefined;
        confidenceScore: number;
    }>;
    solve(prompt: string, onProgress?: (status: string) => void): Promise<{
        project: Project;
        tasks: AgentTask[];
        files: Record<string, string>;
        summary: string | undefined;
        confidenceScore: number;
    }>;
    getExecutionHistory(): AgentTask[];
    getAgentStatuses(): Record<string, unknown>;
    reset(): void;
}
//# sourceMappingURL=orchestrator.d.ts.map