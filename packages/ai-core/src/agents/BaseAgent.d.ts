/**
 * BaseAgent - Abstract base class for all AI agents
 * Provides common functionality for agent communication, error handling, and context management
 */
import { AgentType } from "@sitegenie/shared";
import type { AgentTask, AgentInput, AgentOutput, AgentError } from "@sitegenie/shared";
export declare abstract class BaseAgent {
    readonly agentId: string;
    readonly agentType: AgentType;
    protected isProcessing: boolean;
    protected currentTask: AgentTask | null;
    constructor(agentType: AgentType);
    /**
     * Create a new task for this agent
     */
    createTask(projectId: string, input: AgentInput): AgentTask;
    /**
     * Execute agent task - MUST be implemented by subclasses
     */
    abstract execute(projectId: string, input: AgentInput): Promise<AgentOutput>;
    /**
     * Process a task with error handling and retry logic
     */
    processTask(task: AgentTask, maxRetries?: number): Promise<AgentTask>;
    /**
     * Parse error into AgentError format
     */
    protected parseError(error: unknown): AgentError;
    /**
     * Get agent status
     */
    getStatus(): {
        agentId: string;
        agentType: AgentType;
        isProcessing: boolean;
        currentTask: AgentTask | null;
    };
    /**
     * Cancel current task
     */
    cancelCurrentTask(): void;
}
//# sourceMappingURL=BaseAgent.d.ts.map