export interface SandboxMetadata {
    id: string;
    projectId: string;
    tenantId: string;
    status: 'provisioning' | 'ready' | 'error' | 'terminated';
    resources: {
        cpu: number;
        memory: number;
    };
    endpoints: {
        previewUrl: string;
        terminalUrl: string;
    };
    createdAt: number;
}
export declare class SandboxService {
    private static activeSandboxes;
    private static rootPath;
    static createSandbox(tenantId: string, projectId: string): Promise<SandboxMetadata>;
    static executeCommand(id: string, command: string, options?: {
        cwd?: string;
        timeoutMs?: number;
    }): Promise<{
        stdout: string;
        stderr: string;
        code: number;
    }>;
    static getStatus(id: string): Promise<SandboxMetadata | null>;
    static terminate(id: string): Promise<boolean>;
}
//# sourceMappingURL=sandbox.service.d.ts.map