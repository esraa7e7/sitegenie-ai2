import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { redis } from '../core/redis.js';

export class QueueService {
  private static _aiQueue: Queue | null = null;
  private static _aiQueueEvents: QueueEvents | null = null;

  private static get aiQueue() {
    if (!this._aiQueue && redis) {
      this._aiQueue = new Queue('ai-tasks', { 
        connection: redis,
        defaultJobOptions: {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: { count: 100 },
          removeOnFail: { count: 500 },
        }
      });
    }
    return this._aiQueue;
  }

  private static get aiQueueEvents() {
    if (!this._aiQueueEvents && redis) {
      this._aiQueueEvents = new QueueEvents('ai-tasks', { connection: redis });
    }
    return this._aiQueueEvents;
  }

  static hasQueue() {
    return !!this.aiQueue;
  }

  static async addAITask(data: { prompt: string, projectId: string, tenantId: string, userId: string }) {
    if (!this.aiQueue) {
      console.warn('⚠️ No Redis connection. Executing AI task synchronously...');
      const { AIService } = await import('./ai.service.js');
      const result = await AIService.generateCode(data.projectId, data.prompt);
      return {
        id: `sync-${Date.now()}`,
        getState: async () => 'completed',
        returnvalue: result,
        progress: 100,
      } as unknown as Job;
    }

    console.log(`[Queue] Adding AI task for project: ${data.projectId}`);
    return this.aiQueue.add('generate-code', data, {
      priority: 10,
    });
  }

  static async init() {
    if (!redis) {
      console.log('👷 Skipping Queue Workers initialization (No Redis)');
      return;
    }

    console.log('👷 Initializing Queue Workers...');

    const worker = new Worker('ai-tasks', async (job: Job) => {
      const { projectId, prompt } = job.data;
      console.log(`[Worker] Started ${job.name} (Job ID: ${job.id}) for project ${projectId}`);
      
      try {
        const { AIService } = await import('./ai.service.js');
        const result = await AIService.generateCode(projectId, prompt);
        return result;
      } catch (error) {
        console.error(`[Worker] Task failed for ${projectId}:`, error);
        throw error;
      }
    }, { 
      connection: redis,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000
      }
    });

    worker.on('failed', async (job, err) => {
      console.error(`🔴 Job ${job?.id} failed:`, err.message);
    });

    worker.on('completed', (job) => {
      console.log(`🟢 Job ${job.id} completed successfully`);
    });
  }

  static async getQueueStatus() {
    if (!this.aiQueue) return { waiting: 0, active: 0, completed: 0, failed: 0 };

    const [waiting, active, completed, failed] = await Promise.all([
      this.aiQueue.getWaitingCount(),
      this.aiQueue.getActiveCount(),
      this.aiQueue.getCompletedCount(),
      this.aiQueue.getFailedCount()
    ]);

    return { waiting, active, completed, failed };
  }

  static async getJob(jobId: string) {
    if (jobId.startsWith('sync-')) {
      // Handle the mock job status call
      return {
        id: jobId,
        getState: async () => 'completed',
        progress: 100,
        returnvalue: {} // We'd need to store the sync result somewhere if we wanted status polling to work for sync tasks
      } as unknown as Job;
    }
    return this.aiQueue?.getJob(jobId) || null;
  }
}
