import { AIService } from '../../../services/ai.service.js';
import { UsageService } from '../../../services/usage.service.js';
import { AuditService } from '../../../services/audit.service.js';
import { QueueService } from '../../../services/queue.service.js';
import { BadRequestError } from '../../../core/errors.js';
import { z } from 'zod';
const generateSchema = z.object({
    prompt: z.string().min(1).max(5000),
    projectId: z.string(),
    model: z.string().optional().default('gemini'),
    sync: z.boolean().optional().default(false)
});
const chatSchema = z.object({
    prompt: z.string().min(1).max(2000),
    context: z.string().optional()
});
export class AIController {
    static async generate(req, res, next) {
        try {
            const validated = generateSchema.parse(req.body);
            const { prompt, projectId, model } = validated;
            const { tenantId, userId } = req.user;
            // Check quota
            const canGenerate = await UsageService.hasQuota(tenantId);
            if (!canGenerate) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Usage quota exceeded'
                });
            }
            await AuditService.log({
                action: validated.sync ? 'AI_GENERATION_SYNC' : 'AI_GENERATION_QUEUED',
                entity: 'AI',
                tenantId,
                userId,
                details: { promptLength: prompt.length, model, projectId, sync: validated.sync }
            });
            if (validated.sync || process.env.AI_TASK_QUEUE_ENABLED !== 'true' || !QueueService.hasQueue()) {
                const result = await AIService.generateCode(projectId, prompt);
                return res.json({
                    status: 'success',
                    data: result
                });
            }
            const job = await QueueService.addAITask({ prompt, projectId, tenantId, userId });
            res.json({
                status: 'success',
                data: {
                    taskId: job.id,
                    message: 'AI Task has been enqueued for background processing.'
                }
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return next(new BadRequestError(error.issues[0].message));
            }
            next(error);
        }
    }
    static async chat(req, res, next) {
        try {
            const validated = chatSchema.parse(req.body);
            const { prompt, context } = validated;
            const { tenantId, userId } = req.user;
            const result = await AIService.chat(prompt, context);
            await AuditService.log({
                action: 'AI_CHAT_COMPLETED',
                entity: 'AI',
                tenantId,
                userId,
                details: { promptLength: prompt.length }
            });
            res.json({
                status: 'success',
                data: result
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return next(new BadRequestError(error.issues[0].message));
            }
            next(error);
        }
    }
    static async getStatus(req, res, next) {
        try {
            const id = req.params.id;
            const job = await QueueService.getJob(id);
            if (!job) {
                throw new BadRequestError('Job not found');
            }
            const state = await job.getState();
            const result = job.returnvalue;
            res.json({
                status: 'success',
                data: {
                    id: job.id,
                    state,
                    progress: job.progress,
                    result: result || null
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async streamGenerate(req, res, next) {
        const { projectId } = req.params;
        const prompt = typeof req.query.prompt === 'string' ? req.query.prompt : '';
        if (!prompt) {
            return res.status(400).json({ status: 'error', message: 'Prompt is required' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const sendEvent = (event, data) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };
        try {
            sendEvent('log', { message: 'Initiating SiteGenie AI Orchestrator...' });
            const result = await AIService.generateCode(projectId, prompt, (status) => {
                const [stage, ...msgParts] = status.split(':');
                sendEvent('progress', {
                    stage: stage.trim(),
                    message: msgParts.join(':').trim(),
                    timestamp: new Date().toISOString()
                });
            });
            sendEvent('complete', result);
            res.end();
        }
        catch (error) {
            sendEvent('error', { message: error.message });
            res.end();
        }
    }
    static async deploy(req, res, next) {
        try {
            const { projectId, platform } = req.body;
            const { tenantId } = req.user;
            const { DeploymentService } = await import('../../../services/deployment.service.js');
            let result;
            if (platform === 'vercel') {
                result = await DeploymentService.deployToVercel(tenantId, projectId);
            }
            else if (platform === 'netlify') {
                result = await DeploymentService.deployToNetlify(tenantId, projectId);
            }
            else {
                throw new BadRequestError('Invalid platform');
            }
            res.json({ status: 'success', data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
