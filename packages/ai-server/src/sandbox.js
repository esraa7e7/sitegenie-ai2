import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
/**
 * Secure Sandbox Service (Architecture for Production)
 * In production, this would communicate with a gVisor/Docker pool.
 * This implementation provides the security orchestration layer.
 */
export class SecureSandbox {
    constructor() {
        Object.defineProperty(this, "tempDir", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tempDir = path.join(process.cwd(), '.sandbox_executions');
    }
    async execute(code, options) {
        const executionId = Math.random().toString(36).substring(7);
        const workDir = path.join(this.tempDir, executionId);
        await fs.mkdir(workDir, { recursive: true });
        try {
            // 1. Create source file
            const ext = options.language === 'python' ? 'py' : 'ts';
            const filePath = path.join(workDir, `main.${ext}`);
            await fs.writeFile(filePath, code);
            // 2. Execute with resource limits
            // In production: 'docker run --rm -v workdir:/app --memory="128m" --cpus="0.5" sandbox-image'
            return new Promise((resolve) => {
                const cmd = options.language === 'python' ? 'python3' : 'ts-node';
                const child = spawn(cmd, [filePath], {
                    timeout: options.timeout,
                    env: { NODE_ENV: 'production' }, // Restricted env
                });
                let stdout = '';
                let stderr = '';
                child.stdout.on('data', (data) => (stdout += data.toString()));
                child.stderr.on('data', (data) => (stderr += data.toString()));
                child.on('close', async (code) => {
                    // 3. Cleanup
                    await fs.rm(workDir, { recursive: true, force: true });
                    resolve({ stdout, stderr });
                });
            });
        }
        catch (err) {
            return { stdout: '', stderr: err.message };
        }
    }
}
