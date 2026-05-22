export class ExecutionQueue {
    constructor() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "completed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    addTask(task) {
        this.queue.push(task);
    }
    getNextTask() {
        if (this.queue.length === 0)
            return null;
        this.active = this.queue.shift();
        this.active.status = 'in_progress';
        return this.active;
    }
    completeTask(result) {
        if (this.active) {
            this.active.status = 'completed';
            this.active.result = result;
            this.completed.push(this.active);
            this.active = null;
        }
    }
    failTask(error) {
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
