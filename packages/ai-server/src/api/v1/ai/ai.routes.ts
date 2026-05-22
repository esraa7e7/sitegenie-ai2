import { Router } from 'express';
import { AIController } from './ai.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { apiLimiter, aiGenerationLimiter } from '../../../middleware/rate-limit.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', aiGenerationLimiter as any, AIController.generate);
router.get('/generate/stream/:projectId', AIController.streamGenerate as any);
router.post('/chat', apiLimiter as any, AIController.chat);
router.post('/deploy', apiLimiter as any, AIController.deploy);
router.get('/status/:id', apiLimiter as any, AIController.getStatus);

export default router;
