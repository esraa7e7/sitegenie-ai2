import { Router } from 'express';
import { SandboxController } from './sandbox.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/provision', SandboxController.provision);
router.post('/:id/execute', SandboxController.execute);
router.get('/:id/status', SandboxController.getStatus);
router.delete('/:id', SandboxController.stop);

export default router;
