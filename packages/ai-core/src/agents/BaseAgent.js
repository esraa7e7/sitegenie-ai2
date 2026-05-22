/**
 * BaseAgent - Abstract base class for all AI agents
 * Provides common functionality for agent communication, error handling, and context management
 */
import { nanoid } from "nanoid";
import { TaskStatus } from "@sitegenie/shared";
import { generateTaskId, getTimeDifferenceInSeconds } from "@sitegenie/shared";
export class BaseAgent {
    constructor(agentType) {
        Object.defineProperty(this, "agentId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "agentType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isProcessing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "currentTask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.agentType = agentType;
        this.agentId = `agent_${agentType}_${nanoid(10)}`;
    }
    /**
     * Create a new task for this agent
     */
    createTask(projectId, input) {
        const taskId = generateTaskId();
        return {
            taskId,
            agentId: this.agentId,
            agentType: this.agentType,
            projectId,
            status: TaskStatus.PENDING,
            input,
            createdAt: new Date(),
            metadata: {
                tokensUsed: 0,
                executionTime: 0,
                retryCount: 0,
                priority: input.constraints?.priority || "normal",
            },
        };
    }
    /**
     * Process a task with error handling and retry logic
     */
    async processTask(task, maxRetries = 3) {
        this.currentTask = task;
        this.isProcessing = true;
        const startTime = new Date();
        try {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    task.status = TaskStatus.PROCESSING;
                    task.startedAt = new Date();
                    const output = await this.execute(task.projectId, task.input);
                    task.output = output;
                    task.status = TaskStatus.COMPLETED;
                    task.completedAt = new Date();
                    return task;
                }
                catch (error) {
                    if (attempt === maxRetries) {
                        throw error;
                    }
                    task.metadata.retryCount = attempt;
                    task.status = TaskStatus.RETRY;
                    // Exponential backoff: 1s, 2s, 4s...
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }
        catch (error) {
            task.status = TaskStatus.FAILED;
            task.error = this.parseError(error);
            task.completedAt = new Date();
        }
        finally {
            task.metadata.executionTime = getTimeDifferenceInSeconds(startTime);
            this.isProcessing = false;
        }
        return task;
    }
    /**
     * Parse error into AgentError format
     */
    parseError(error) {
        if (error instanceof Error) {
            return {
                code: "AGENT_ERROR",
                message: error.message,
                severity: "high",
                recoverable: true,
            };
        }
        return {
            code: "UNKNOWN_ERROR",
            message: String(error),
            severity: "high",
            recoverable: false,
        };
    }
    /**
     * Get agent status
     */
    getStatus() {
        return {
            agentId: this.agentId,
            agentType: this.agentType,
            isProcessing: this.isProcessing,
            currentTask: this.currentTask,
        };
    }
    /**
     * Cancel current task
     */
    cancelCurrentTask() {
        if (this.currentTask) {
            this.currentTask.status = TaskStatus.CANCELLED;
        }
    }
}
