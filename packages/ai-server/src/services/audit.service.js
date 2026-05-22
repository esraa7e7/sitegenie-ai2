import { prisma } from '../core/database.js';
export class AuditService {
    static async log(data) {
        try {
            await prisma.auditLog.create({
                data: {
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId,
                    details: data.details,
                    userId: data.userId,
                    tenantId: data.tenantId,
                },
            });
        }
        catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }
}
