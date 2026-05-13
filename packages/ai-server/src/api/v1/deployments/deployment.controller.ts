import { Request, Response, NextFunction } from 'express';
import { DeploymentService } from '../../../services/deployment.service.js';

export class DeploymentController {
  static async trigger(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.body;
      const { tenantId } = (req as any).user;

      const deployment = await DeploymentService.createDeployment(tenantId, projectId);
      res.status(201).json({ status: 'success', data: deployment });
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const { tenantId } = (req as any).user;

      const history = await DeploymentService.getDeploymentHistory(tenantId, projectId);
      res.json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  }

  static async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const logs = await DeploymentService.getDeploymentLogs(id);
      res.json({ status: 'success', data: logs });
    } catch (error) {
      next(error);
    }
  }
}
