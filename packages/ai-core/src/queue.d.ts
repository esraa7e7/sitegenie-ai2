import { Task } from './types.js';
export declare class ExecutionQueue {
    private queue;
    private completed;
    private active;
    addTask(task: Task): void;
    getNextTask(): Task | null;
    completeTask(result: any): void;
    failTask(error: string): void;
    getTasks(): Task[];
}
//# sourceMappingURL=queue.d.ts.map