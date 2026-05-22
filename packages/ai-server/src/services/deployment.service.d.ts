export declare class DeploymentService {
    static createDeployment(tenantId: string, projectId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        id: string;
        status: string;
        tenantId: string;
        buildLogs: string | null;
        previewUrl: string | null;
        environment: import("@prisma/client/runtime/library").JsonValue | null;
        commitHash: string | null;
    }>;
    private static startBuildProcess;
    static rollback(tenantId: string, projectId: string, deploymentId: string): Promise<{
        status: string;
        message: string;
    }>;
    private static triggerSelfHealing;
    static getDeploymentHistory(tenantId: string, projectId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        id: string;
        status: string;
        tenantId: string;
        buildLogs: string | null;
        previewUrl: string | null;
        environment: import("@prisma/client/runtime/library").JsonValue | null;
        commitHash: string | null;
    }[]>;
    static getDeploymentLogs(deploymentId: string): Promise<{
        status: string;
        buildLogs: string | null;
    } | null>;
    /**
     * One-Click Deploy to Vercel
     */
    static deployToVercel(tenantId: string, projectId: string): Promise<{
        status: string;
        url: string | null;
        deploymentId: string;
    }>;
    /**
     * One-Click Deploy to Netlify
     */
    static deployToNetlify(tenantId: string, projectId: string): Promise<{
        status: string;
        url: string | null;
        deploymentId: string;
    }>;
}
//# sourceMappingURL=deployment.service.d.ts.map