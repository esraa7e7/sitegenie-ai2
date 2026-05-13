import { Request, Response, NextFunction } from 'express';
import { MarketplaceService } from '../../../services/marketplace.service.js';

export class MarketplaceController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, search } = req.query;
      const items = await MarketplaceService.listItems({ 
        type: type as string, 
        search: search as string 
      });
      res.json({ status: 'success', data: items });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const item = await MarketplaceService.getItem(id);
      res.json({ status: 'success', data: item });
    } catch (error) {
      next(error);
    }
  }

  static async install(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId, itemId } = req.body;
      const install = await MarketplaceService.installPlugin(projectId, itemId);
      res.status(201).json({ status: 'success', data: install });
    } catch (error) {
      next(error);
    }
  }

  static async getInstalled(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = req.params.projectId as string;
      const installs = await MarketplaceService.getInstalledPlugins(projectId);
      res.json({ status: 'success', data: installs });
    } catch (error) {
      next(error);
    }
  }
}
