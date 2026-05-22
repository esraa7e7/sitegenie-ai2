import { DeploymentService } from '../../../services/deployment.service.js';
export class DeploymentController {
    static async trigger(req, res, next) {
        try {
            const { projectId } = req.body;
            const { tenantId } = req.user;
            const deployment = await DeploymentService.createDeployment(tenantId, projectId);
            res.status(201).json({ status: 'success', data: deployment });
        }
        catch (error) {
            next(error);
        }
    }
    static async getHistory(req, res, next) {
        try {
            const projectId = req.params.projectId;
            const { tenantId } = req.user;
            const history = await DeploymentService.getDeploymentHistory(tenantId, projectId);
            res.json({ status: 'success', data: history });
        }
        catch (error) {
            next(error);
        }
    }
    static async getLogs(req, res, next) {
        try {
            const id = req.params.id;
            const logs = await DeploymentService.getDeploymentLogs(id);
            res.json({ status: 'success', data: logs });
        }
        catch (error) {
            next(error);
        }
    }
}
