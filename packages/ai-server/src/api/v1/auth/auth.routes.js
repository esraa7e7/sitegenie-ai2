import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { apiLimiter } from '../../../middleware/rate-limit.middleware.js';
const router = Router();
router.post('/signup', apiLimiter, AuthController.signup);
router.post('/login', apiLimiter, AuthController.login);
router.get('/verify', authenticate, AuthController.verify);
export default router;
