export declare class AdminService {
    static getSystemConfig(): Promise<{
        updatedAt: Date;
        id: string;
        aiEnabled: boolean;
        sandboxEnabled: boolean;
        deployEnabled: boolean;
        registrationOpen: boolean;
        maintenanceMode: boolean;
    }>;
    static updateConfig(updates: Partial<any>): Promise<{
        updatedAt: Date;
        id: string;
        aiEnabled: boolean;
        sandboxEnabled: boolean;
        deployEnabled: boolean;
        registrationOpen: boolean;
        maintenanceMode: boolean;
    }>;
    static isAIEnabled(): Promise<boolean>;
}
//# sourceMappingURL=admin.service.d.ts.map