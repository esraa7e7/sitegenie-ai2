export interface SandboxOptions {
    timeout: number;
    memoryLimit: number;
    language: 'javascript' | 'typescript' | 'python';
}
/**
 * Secure Sandbox Service (Architecture for Production)
 * In production, this would communicate with a gVisor/Docker pool.
 * This implementation provides the security orchestration layer.
 */
export declare class SecureSandbox {
    private tempDir;
    constructor();
    execute(code: string, options: SandboxOptions): Promise<{
        stdout: string;
        stderr: string;
    }>;
}
//# sourceMappingURL=sandbox.d.ts.map