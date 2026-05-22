import { ProjectService } from '../../../services/project.service.js';
import { VfsService } from '../../../services/vfs.service.js';
const projectService = new ProjectService();
export class ProjectController {
    static async getProjects(req, res, next) {
        try {
            const tenantId = req.user.tenantId;
            const projects = await projectService.getAllProjects(tenantId);
            res.json({ status: 'success', data: projects });
        }
        catch (error) {
            next(error);
        }
    }
    static async createProject(req, res, next) {
        try {
            const tenantId = req.user.tenantId;
            const { name, description } = req.body;
            const project = await projectService.createProject(tenantId, name, description);
            res.status(201).json({ status: 'success', data: project });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProject(req, res, next) {
        try {
            const tenantId = req.user.tenantId;
            const id = req.params.id;
            await projectService.deleteProject(tenantId, id);
            res.status(204).end();
        }
        catch (error) {
            next(error);
        }
    }
    static async getFiles(req, res, next) {
        try {
            const id = req.params.id;
            const files = await projectService.getProjectFiles(id);
            res.json({ status: 'success', data: files });
        }
        catch (error) {
            next(error);
        }
    }
    static async getFileContent(req, res, next) {
        try {
            const id = req.params.id;
            const { path } = req.query;
            const content = await projectService.readFile(id, path);
            res.json({ status: 'success', data: content });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateFile(req, res, next) {
        try {
            const id = req.params.id;
            const { path, content } = req.body;
            await projectService.updateProjectFile(id, path, content);
            res.json({ status: 'success' });
        }
        catch (error) {
            next(error);
        }
    }
    static async autoSaveVfs(req, res, next) {
        try {
            const id = req.params.id;
            const { files } = req.body;
            const result = await VfsService.autoSave(id, files);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async createSnapshot(req, res, next) {
        try {
            const id = req.params.id;
            const { reason } = req.body;
            const snapshot = await VfsService.createSnapshot(id, reason);
            res.status(201).json({ status: 'success', data: snapshot });
        }
        catch (error) {
            next(error);
        }
    }
    static async restoreSnapshot(req, res, next) {
        try {
            const id = req.params.id;
            const snapshotId = req.params.snapshotId;
            const result = await VfsService.restoreSnapshot(id, snapshotId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
