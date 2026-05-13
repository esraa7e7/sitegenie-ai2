import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { nanoid } from 'nanoid';

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

export class SandboxService {
  private static activeSandboxes: Map<string, { metadata: SandboxMetadata; rootDir: string }> = new Map();
  private static rootPath = path.join(process.cwd(), 'tmp', 'sandboxes');

  static async createSandbox(tenantId: string, projectId: string): Promise<SandboxMetadata> {
    await fs.mkdir(this.rootPath, { recursive: true });

    const sandboxId = `sb_${nanoid(12)}`;
    const rootDir = path.join(this.rootPath, sandboxId);

    await fs.mkdir(rootDir, { recursive: true });

    const metadata: SandboxMetadata = {
      id: sandboxId,
      tenantId,
      projectId,
      status: 'ready',
      resources: { cpu: 1, memory: 1024 },
      endpoints: {
        previewUrl: `http://localhost:0/${sandboxId}`,
        terminalUrl: `terminal://${sandboxId}`,
      },
      createdAt: Date.now(),
    };

    this.activeSandboxes.set(sandboxId, { metadata, rootDir });
    return metadata;
  }

  static async executeCommand(id: string, command: string, options: { cwd?: string; timeoutMs?: number } = {}) {
    const entry = this.activeSandboxes.get(id);
    if (!entry) throw new Error('Sandbox not found');

    const cwd = options.cwd ? path.join(entry.rootDir, options.cwd) : entry.rootDir;
    const child = spawn(command, {
      shell: true,
      cwd,
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: options.timeoutMs ?? 30000,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    return await new Promise<{ stdout: string; stderr: string; code: number }>((resolve, reject) => {
      child.on('error', reject);
      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
        resolve({ stdout, stderr, code: code ?? 0 });
      });
    });
  }

  static async getStatus(id: string): Promise<SandboxMetadata | null> {
    const entry = this.activeSandboxes.get(id);
    return entry ? entry.metadata : null;
  }

  static async terminate(id: string): Promise<boolean> {
    const entry = this.activeSandboxes.get(id);
    if (!entry) return false;
    await fs.rm(entry.rootDir, { recursive: true, force: true });
    this.activeSandboxes.delete(id);
    return true;
  }
}
