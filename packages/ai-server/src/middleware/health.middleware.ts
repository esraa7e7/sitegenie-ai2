import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metrics.service.js';

export async function healthCheck(req: Request, res: Response) {
  try {
    const metrics = await MetricsService.getRealtimeMetrics();
    
    // Check critical systems
    const isDbHealthy = await checkDatabase();
    
    if (!isDbHealthy) {
        return res.status(503).json({ 
            status: 'unhealthy', 
            service: 'database',
            timestamp: new Date().toISOString() 
        });
    }

    res.status(200).json({
      status: 'healthy',
      version: process.env.APP_VERSION || '1.0.0-production',
      metrics: {
        cpu: metrics.cpuUsage,
        active_sandboxes: metrics.activeSandboxes,
        uptime: metrics.uptime
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
}

async function checkDatabase() {
  try {
      const { prisma } = await import('../core/database.js');
      await prisma.$queryRaw`SELECT 1`;
      return true;
  } catch {
      return false;
  }
}
