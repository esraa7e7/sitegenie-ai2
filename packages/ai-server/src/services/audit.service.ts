import { prisma } from '../core/database.js';

export interface AuditLogData {
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  userId?: string;
  tenantId: string;
}

export class AuditService {
  static async log(data: AuditLogData) {
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
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }
}
