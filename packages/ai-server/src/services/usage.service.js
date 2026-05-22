import { prisma } from '../core/database.js';
export class UsageService {
    static async hasQuota(tenantId) {
        const usage = await prisma.usageLimit.findUnique({
            where: { tenantId },
            include: { tenant: { include: { projects: true } } }
        });
        if (!usage)
            return true;
        if (usage.tenant.projects.length >= usage.maxProjects) {
            return false;
        }
        const now = Date.now();
        const windowStart = now - 60000;
        let timestamps = this.userWindows.get(tenantId) || [];
        timestamps = timestamps.filter(t => t > windowStart);
        if (timestamps.length >= 20) {
            return false;
        }
        timestamps.push(now);
        this.userWindows.set(tenantId, timestamps);
        return true;
    }
    static async getUsageAnalytics(tenantId) {
        const usage = await prisma.usageLimit.findUnique({ where: { tenantId } });
        const auditLogs = await prisma.auditLog.count({ where: { tenantId, action: 'AI_GENERATION_QUEUED' } });
        return {
            totalRequests: auditLogs,
            sandboxHours: usage?.sandboxHours || 0,
            projectCount: usage?.tenant?.projects?.length || 0,
        };
    }
}
Object.defineProperty(UsageService, "userWindows", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
