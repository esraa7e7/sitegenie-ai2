import { prisma } from '../core/database.js';

export class UsageService {
  private static userWindows: Map<string, number[]> = new Map();

  static async hasQuota(tenantId: string): Promise<boolean> {
    const usage = await prisma.usageLimit.findUnique({
      where: { tenantId },
      include: { tenant: { include: { projects: true } } }
    });

    if (!usage) return true;

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

  static async getUsageAnalytics(tenantId: string) {
    const usage = await prisma.usageLimit.findUnique({ where: { tenantId } });
    const auditLogs = await prisma.auditLog.count({ where: { tenantId, action: 'AI_GENERATION_QUEUED' } });

    return {
      totalRequests: auditLogs,
      sandboxHours: usage?.sandboxHours || 0,
      projectCount: (usage as any)?.tenant?.projects?.length || 0,
    };
  }
}
