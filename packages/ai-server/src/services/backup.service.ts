import fs from 'fs/promises';
import path from 'path';
import { FileService } from './file.service.js';
import { prisma } from '../core/database.js';

export class BackupService {
  private static BACKUP_ROOT = path.join(process.cwd(), 'backups');

  static async init() {
    await fs.mkdir(this.BACKUP_ROOT, { recursive: true });
  }

  static async createSnapshot(projectId: string) {
    const projectPath = FileService.getProjectPath(projectId);
    const snapshotId = `snap_${Date.now()}`;
    const backupPath = path.join(this.BACKUP_ROOT, projectId, snapshotId);

    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    
    // In production, we would use a tool like 'tar' or a snapshotting filesystem
    // Here we simulate with a recursive copy logic (simplified)
    console.log(`[Backup] Creating snapshot ${snapshotId} for ${projectId}...`);
    
    // We'll just read all files and store them in a single JSON for this demo-grade implementation
    // But architecture-wise it represents a snapshot
    const files = await FileService.listFiles(projectId);
    const snapshotData: Record<string, string> = {};
    for (const f of files) {
      snapshotData[f] = await FileService.readProjectFile(projectId, f);
    }

    await fs.writeFile(`${backupPath}.json`, JSON.stringify(snapshotData), 'utf8');

    await prisma.auditLog.create({
      data: {
        action: 'BACKUP_CREATED',
        entity: 'Project',
        entityId: projectId,
        tenantId: 'system', // or project tenant
        details: { snapshotId }
      }
    });

    return snapshotId;
  }

  static async restoreSnapshot(projectId: string, snapshotId: string) {
    const backupPath = path.join(this.BACKUP_ROOT, projectId, `${snapshotId}.json`);
    const data = await fs.readFile(backupPath, 'utf8');
    const files = JSON.parse(data);

    await FileService.syncProjectToDisk(projectId, files);
    console.log(`[Backup] Restored snapshot ${snapshotId} for ${projectId}`);
  }

  static async getSnapshots(projectId: string) {
    const dir = path.join(this.BACKUP_ROOT, projectId);
    try {
      const files = await fs.readdir(dir);
      return files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
        .sort()
        .reverse();
    } catch {
      return [];
    }
  }
}
