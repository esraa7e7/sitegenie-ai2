import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../core/database.js';
export class FileService {
    static async init() {
        try {
            await fs.mkdir(this.WORKSPACE_ROOT, { recursive: true });
        }
        catch (error) {
            console.error('Failed to initialize workspace root:', error);
        }
    }
    static getProjectPath(projectId) {
        return path.join(this.WORKSPACE_ROOT, projectId);
    }
    static async writeProjectFile(projectId, filePath, content) {
        const projectPath = this.getProjectPath(projectId);
        const fullPath = path.join(projectPath, filePath);
        // Ensure parent directory exists
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        // Also update project metadata in DB (keep sync)
        // In a real VFS, we might only store metadata in DB and actual content on disk
        // But for fast searches/listings, we can keep a manifest in DB
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (project) {
            const files = project.files || {};
            files[filePath] = { updatedAt: new Date().toISOString(), size: content.length };
            await prisma.project.update({
                where: { id: projectId },
                data: { files }
            });
        }
    }
    static async readProjectFile(projectId, filePath) {
        const fullPath = path.join(this.getProjectPath(projectId), filePath);
        return fs.readFile(fullPath, 'utf8');
    }
    static async listFiles(projectId) {
        const projectPath = this.getProjectPath(projectId);
        try {
            const entries = await fs.readdir(projectPath, { recursive: true, withFileTypes: true });
            return entries
                .filter(e => e.isFile())
                .map(e => path.relative(projectPath, path.join(e.path || e.parentPath || '', e.name)));
        }
        catch (error) {
            return [];
        }
    }
    static async deleteFile(projectId, filePath) {
        const fullPath = path.join(this.getProjectPath(projectId), filePath);
        await fs.unlink(fullPath);
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (project) {
            const files = project.files || {};
            delete files[filePath];
            await prisma.project.update({
                where: { id: projectId },
                data: { files }
            });
        }
    }
    static async syncProjectToDisk(projectId, files) {
        const projectPath = this.getProjectPath(projectId);
        await fs.mkdir(projectPath, { recursive: true });
        for (const [filePath, content] of Object.entries(files)) {
            const fullPath = path.join(projectPath, filePath);
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, content, 'utf8');
        }
    }
}
Object.defineProperty(FileService, "WORKSPACE_ROOT", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: path.join(process.cwd(), 'workspaces')
});
