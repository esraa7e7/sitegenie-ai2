import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rate-limit.middleware.js';
import { QueueService } from './services/queue.service.js';

// Route Imports
import authRoutes from './api/v1/auth/auth.routes.js';
import aiRoutes from './api/v1/ai/ai.routes.js';
import projectRoutes from './api/v1/projects/project.routes.js';
import teamRoutes from './api/v1/teams/team.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Basic Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Public Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'up', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/teams', teamRoutes);

// Mock data for ping
app.get('/api/v1/ping', apiLimiter, (req: Request, res: Response) => {
  res.json({ message: 'pong' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

QueueService.init().catch((error) => {
  console.error('Queue initialization failed:', error);
});

server.listen(PORT, () => {
  console.log(`🚀 SiteGenie Server running on port ${PORT}`);
});

export { app, server };
