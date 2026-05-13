import { Task } from './types.js';

export class ExecutionQueue {
  private queue: Task[] = [];
  private completed: Task[] = [];
  private active: Task | null = null;

  addTask(task: Task) {
    this.queue.push(task);
  }

  getNextTask(): Task | null {
    if (this.queue.length === 0) return null;
    this.active = this.queue.shift()!;
    this.active.status = 'in_progress';
    return this.active;
  }

  completeTask(result: any) {
    if (this.active) {
      this.active.status = 'completed';
      this.active.result = result;
      this.completed.push(this.active);
      this.active = null;
    }
  }

  failTask(error: string) {
    if (this.active) {
      this.active.status = 'failed';
      this.active.result = error;
      this.completed.push(this.active);
      this.active = null;
    }
  }

  getTasks() {
    return [...this.completed, ...(this.active ? [this.active] : []), ...this.queue];
  }
}
