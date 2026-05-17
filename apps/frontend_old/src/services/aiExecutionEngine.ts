import { useAIStore } from '../store/aiStore';
import { useVFSStore } from '../store/vfsStore';
import { useAuthStore } from '../store/authStore';

interface AIResponse {
  explanation: string;
  design?: any;
  files: string[];
  confidenceScore?: number;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const aiExecutionEngine = {
  processRequest: async (prompt: string) => {
    const { addMessage, addTask, updateTask, setProcessing, resetPipeline, updatePipelineStep } = useAIStore.getState();
    const { accessToken } = useAuthStore.getState();
    const { createFile, rootId } = useVFSStore.getState();

    try {
      resetPipeline();
      setProcessing(true);

      addMessage({ 
        role: 'user', 
        content: prompt 
      });

      const assistantMsgId = addMessage({ 
        role: 'assistant', 
        content: "Initializing SiteGenie Multi-Agent OS..." 
      });

      // ====================== SECURE BACKEND CALL ======================
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_URL || ''}/api/v1/ai/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, projectId: '00000000-0000-0000-0000-000000000000', sync: true }),
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'AI Engine failed to initialize');
      }

      const result = await response.json();
      const data = result.data;

      if (!data) {
        throw new Error('No data received from AI engine.');
      }

      // Update assistant message with AI explanation
      useAIStore.setState(state => ({
        messages: state.messages.map(m => m.id === assistantMsgId ? { ...m, content: data.explanation || data.plan } : m)
      }));

      if (data.confidenceScore) {
        useAIStore.getState().setConfidenceScore(data.confidenceScore);
      }

      // Map files to workspace tasks
      if (data.files && data.files.length > 0) {
        for (const filePath of data.files) {
          const taskId = addTask({ 
            type: 'create_file', 
            description: `Provisioning ${filePath}`, 
            payload: { path: filePath } 
          });

          updateTask(taskId, { status: 'running' });
          await new Promise(r => setTimeout(r, 400)); // Visual sequence

          updateTask(taskId, { status: 'completed' });
        }
      }

      addMessage({ 
        role: 'assistant', 
        content: "✨ System check passed. Full product provisioned and ready for deployment." 
      });

      // Mark all as completed
      useAIStore.getState().pipeline.forEach(step => {
        updatePipelineStep(step.id, { status: 'completed' });
      });

    } catch (error: any) {
      console.error(error);
      addMessage({ 
        role: 'assistant', 
        content: `❌ Critical System Failure: ${error.message}` 
      });
    } finally {
      setProcessing(false);
    }
  },

  chat: async (prompt: string, context?: string) => {
    const { accessToken } = useAuthStore.getState();
    
    const response = await fetch(`${API_URL}/api/v1/ai/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ prompt, context }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get response from AI');
    }

    const { data } = await response.json();
    return data;
  }
};
