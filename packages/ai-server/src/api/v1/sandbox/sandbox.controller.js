import { SandboxService } from '../../../services/sandbox.service.js';
export class SandboxController {
    static async provision(req, res, next) {
        try {
            const { projectId } = req.body;
            const { tenantId } = req.user;
            if (!projectId) {
                return res.status(400).json({ status: 'error', message: 'Project ID is required' });
            }
            const sandbox = await SandboxService.createSandbox(tenantId, projectId);
            res.status(201).json({
                status: 'success',
                data: sandbox
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getStatus(req, res, next) {
        try {
            const id = req.params.id;
            const status = await SandboxService.getStatus(id);
            if (!status) {
                return res.status(404).json({ status: 'error', message: 'Sandbox not found' });
            }
            res.json({ status: 'success', data: status });
        }
        catch (error) {
            next(error);
        }
    }
    static async execute(req, res, next) {
        try {
            const id = req.params.id;
            const { code, language = 'python' } = req.body;
            if (!code) {
                return res.status(400).json({ status: 'error', message: 'Code is required for execution' });
            }
            // @ts-ignore
            const result = await SandboxService.executeCode(id, code, language);
            res.json({
                status: 'success',
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async stop(req, res, next) {
        try {
            const id = req.params.id;
            await SandboxService.terminate(id);
            res.status(204).end();
        }
        catch (error) {
            next(error);
        }
    }
}
