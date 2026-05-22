/**
 * BaseAgent - Abstract base class for all AI agents
 * Provides common functionality for agent communication, error handling, and context management
 */

import { nanoid } from "nanoid";
import { AgentPriority, AgentType, TaskStatus } from "@sitegenie/shared";
import type {
  AgentTask,
  AgentInput,
  AgentOutput,
  AgentError,
  ContextWindow,
} from "@sitegenie/shared";
import { generateTaskId, getTimeDifferenceInSeconds } from "@sitegenie/shared";

export abstract class BaseAgent {
  readonly agentId: string;
  readonly agentType: AgentType;
  protected isProcessing: boolean = false;
  protected currentTask: AgentTask | null = null;

  constructor(agentType: AgentType) {
    this.agentType = agentType;
    this.agentId = `agent_${agentType}_${nanoid(10)}`;
  }

  /**
   * Create a new task for this agent
   */
  public createTask(projectId: string, input: AgentInput): AgentTask {
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
        priority: (input.constraints?.priority as AgentPriority) || "normal",
      },
    };
  }

  /**
   * Execute agent task - MUST be implemented by subclasses
   */
  abstract execute(projectId: string, input: AgentInput): Promise<AgentOutput>;

  /**
   * Process a task with error handling and retry logic
   */
  async processTask(task: AgentTask, maxRetries: number = 3): Promise<AgentTask> {
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
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }
          task.metadata.retryCount = attempt;
          task.status = TaskStatus.RETRY;
          // Exponential backoff: 1s, 2s, 4s...
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    } catch (error) {
      task.status = TaskStatus.FAILED;
      task.error = this.parseError(error);
      task.completedAt = new Date();
    } finally {
      task.metadata.executionTime = getTimeDifferenceInSeconds(startTime);
      this.isProcessing = false;
    }

    return task;
  }

  /**
   * Parse error into AgentError format
   */
  protected parseError(error: unknown): AgentError {
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
  getStatus(): {
    agentId: string;
    agentType: AgentType;
    isProcessing: boolean;
    currentTask: AgentTask | null;
  } {
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
  cancelCurrentTask(): void {
    if (this.currentTask) {
      this.currentTask.status = TaskStatus.CANCELLED;
    }
  }
}
