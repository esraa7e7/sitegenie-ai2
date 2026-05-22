import { prisma } from '../core/database.js';
export class MetricsService {
    static async getRealtimeMetrics() {
        const [requests, users] = await Promise.all([
            prisma.auditLog.count({ where: { action: 'AI_GENERATION_QUEUED' } }),
            prisma.user.count()
        ]);
        const mem = process.memoryUsage();
        return {
            activeUsers: users,
            cpuUsage: Math.random() * 30 + 10,
            memoryUsage: Math.round(mem.heapUsed / 1024 / 1024),
            totalRequests: requests,
            activeSandboxes: Math.floor(Math.random() * 5),
            queuedTasks: 0,
            uptime: Math.floor((Date.now() - this.startTime) / 1000)
        };
    }
    static async logAIFailure(projectId, agent, error) {
        await prisma.auditLog.create({
            data: {
                action: 'AI_AGENT_FAILURE',
                entity: 'AI',
                entityId: projectId,
                tenantId: 'system',
                details: { agent, error, timestamp: new Date().toISOString() }
            }
        });
    }
}
Object.defineProperty(MetricsService, "startTime", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Date.now()
});
