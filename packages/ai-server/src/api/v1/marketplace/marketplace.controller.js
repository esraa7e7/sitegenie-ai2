import { MarketplaceService } from '../../../services/marketplace.service.js';
export class MarketplaceController {
    static async list(req, res, next) {
        try {
            const { type, search } = req.query;
            const items = await MarketplaceService.listItems({
                type: type,
                search: search
            });
            res.json({ status: 'success', data: items });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = req.params.id;
            const item = await MarketplaceService.getItem(id);
            res.json({ status: 'success', data: item });
        }
        catch (error) {
            next(error);
        }
    }
    static async install(req, res, next) {
        try {
            const { projectId, itemId } = req.body;
            const install = await MarketplaceService.installPlugin(projectId, itemId);
            res.status(201).json({ status: 'success', data: install });
        }
        catch (error) {
            next(error);
        }
    }
    static async getInstalled(req, res, next) {
        try {
            const projectId = req.params.projectId;
            const installs = await MarketplaceService.getInstalledPlugins(projectId);
            res.json({ status: 'success', data: installs });
        }
        catch (error) {
            next(error);
        }
    }
}
