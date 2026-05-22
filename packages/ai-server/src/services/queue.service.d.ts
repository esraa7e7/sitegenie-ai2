import { Job } from 'bullmq';
export declare class QueueService {
    private static _aiQueue;
    private static _aiQueueEvents;
    private static get aiQueue();
    private static get aiQueueEvents();
    static hasQueue(): boolean;
    static addAITask(data: {
        prompt: string;
        projectId: string;
        tenantId: string;
        userId: string;
    }): Promise<Job<any, any, string>>;
    static init(): Promise<void>;
    static getQueueStatus(): Promise<{
        waiting: number;
        active: number;
        completed: number;
        failed: number;
    }>;
    static getJob(jobId: string): Promise<Job<any, any, string> | null | undefined>;
}
//# sourceMappingURL=queue.service.d.ts.map