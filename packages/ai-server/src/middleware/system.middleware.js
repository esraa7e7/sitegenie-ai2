import { AdminService } from '../services/admin.service.js';
export const systemGuard = async (req, res, next) => {
    const config = await AdminService.getSystemConfig();
    if (config.maintenanceMode && !req.path.includes('/admin')) {
        return res.status(503).json({
            status: 'error',
            message: 'System is under maintenance. Please try again later.'
        });
    }
    // Feature specific checks
    if (req.path.includes('/ai/') && !config.aiEnabled) {
        return res.status(403).json({ status: 'error', message: 'AI features are temporarily disabled.' });
    }
    if (req.path.includes('/sandbox/') && !config.sandboxEnabled) {
        return res.status(403).json({ status: 'error', message: 'Sandbox features are temporarily disabled.' });
    }
    if (req.path.includes('/deployments/') && !config.deployEnabled) {
        return res.status(403).json({ status: 'error', message: 'Deployment features are temporarily disabled.' });
    }
    next();
};
