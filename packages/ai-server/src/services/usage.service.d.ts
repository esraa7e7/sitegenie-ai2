export declare class UsageService {
    private static userWindows;
    static hasQuota(tenantId: string): Promise<boolean>;
    static getUsageAnalytics(tenantId: string): Promise<{
        totalRequests: number;
        sandboxHours: number;
        projectCount: any;
    }>;
}
//# sourceMappingURL=usage.service.d.ts.map