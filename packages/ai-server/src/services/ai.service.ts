import { FileService } from './file.service.js';
import { VfsService } from './vfs.service.js';
import { AgentOrchestrator } from '@sitegenie/ai-core/src/orchestrator.js';

export class AIService {
  private static orchestrator = new AgentOrchestrator({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || ''
  });

  static async generateCode(projectId: string, prompt: string, onProgress?: (status: string) => void) {
    const { SocketService } = await import('../core/socket.js');
    const { MetricsService } = await import('./metrics.service.js');

    // 1. Prepare Context (Read existing files from VFS)
    const files = await VfsService.getProjectFiles(projectId);
    const context: Record<string, string> = {};
    files.forEach(f => {
      context[f.path] = f.content;
    });

    // 2. Solve using Multi-Agent Orchestrator with Progress
    const { ObservabilityService } = await import('./observability.service.js');
    
    ObservabilityService.trackEvent('system', 'AI_GENERATION_START', { projectId, promptLength: prompt.length });

    const result = await this.orchestrator.generateApplication(projectId, prompt, (status) => {
      SocketService.emitToProject(projectId, 'ai-progress', { status });
      onProgress?.(status);
    });

    // 3. Apply Multi-File Changes to VFS and Disk
    if (result.files) {
      const filesToSync = Object.entries(result.files).map(([path, content]) => ({
        path,
        content: content as string
      }));

      await VfsService.autoSave(projectId, filesToSync);
      await FileService.syncProjectToDisk(projectId, result.files as Record<string, string>);
      
      ObservabilityService.trackEvent('system', 'AI_GENERATION_SUCCESS', { 
        projectId, 
        filesCount: filesToSync.length,
      });
    }

    return {
      explanation: result.summary || `Generated project for prompt: ${prompt}`,
      design: result.project?.description,
      files: Object.keys(result.files || {}),
      confidenceScore: result.confidenceScore ?? 90
    };
  }

  static async chat(prompt: string, context?: string) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { text: `You are the SiteGenie AI Assistant. Help the user build and improve their website. Context: ${context || 'New project'}` },
      { text: prompt }
    ]);

    return {
      response: result.response.text(),
      timestamp: new Date().toISOString()
    };
  }

  static async selfHeal(projectId: string, errorLog: string) {
    console.log(`[AI Service] Healing project ${projectId}...`);
    return this.generateCode(projectId, `FIX THIS ERROR: \n${errorLog}`);
  }
}
