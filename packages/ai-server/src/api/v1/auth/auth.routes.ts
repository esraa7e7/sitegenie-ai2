import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { apiLimiter } from '../../../middleware/rate-limit.middleware.js';

const router = Router();

router.post('/signup', apiLimiter as any, AuthController.signup);
router.post('/login', apiLimiter as any, AuthController.login);
router.get('/verify', authenticate, AuthController.verify);

export default router;
