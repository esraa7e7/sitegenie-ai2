import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../../../services/project.service.js';
import { VfsService } from '../../../services/vfs.service.js';

const projectService = new ProjectService();

export class ProjectController {
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).user.tenantId;
      const projects = await projectService.getAllProjects(tenantId);
      res.json({ status: 'success', data: projects });
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).user.tenantId;
      const { name, description } = req.body;
      const project = await projectService.createProject(tenantId, name, description);
      res.status(201).json({ status: 'success', data: project });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = (req as any).user.tenantId;
      const id = req.params.id as string;
      await projectService.deleteProject(tenantId, id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  static async getFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const files = await projectService.getProjectFiles(id);
      res.json({ status: 'success', data: files });
    } catch (error) {
      next(error);
    }
  }

  static async getFileContent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { path } = req.query;
      const content = await projectService.readFile(id, path as string);
      res.json({ status: 'success', data: content });
    } catch (error) {
      next(error);
    }
  }

  static async updateFile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { path, content } = req.body;
      await projectService.updateProjectFile(id, path, content);
      res.json({ status: 'success' });
    } catch (error) {
      next(error);
    }
  }

  static async autoSaveVfs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { files } = req.body;
      const result = await VfsService.autoSave(id, files);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;
      const snapshot = await VfsService.createSnapshot(id, reason);
      res.status(201).json({ status: 'success', data: snapshot });
    } catch (error) {
      next(error);
    }
  }

  static async restoreSnapshot(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const snapshotId = req.params.snapshotId as string;
      const result = await VfsService.restoreSnapshot(id, snapshotId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
