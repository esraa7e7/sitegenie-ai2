import { Router } from 'express';
import { DeploymentController } from './deployment.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', DeploymentController.trigger);
router.get('/project/:projectId', DeploymentController.getHistory);
router.get('/:id/logs', DeploymentController.getLogs);

export default router;
