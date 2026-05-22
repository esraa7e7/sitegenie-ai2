export interface AuditLogData {
    action: string;
    entity: string;
    entityId?: string;
    details?: any;
    userId?: string;
    tenantId: string;
}
export declare class AuditService {
    static log(data: AuditLogData): Promise<void>;
}
//# sourceMappingURL=audit.service.d.ts.map