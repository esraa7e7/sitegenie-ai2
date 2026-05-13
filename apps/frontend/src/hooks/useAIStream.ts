import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export interface StreamProgress {
  stage: string;
  message: string;
  timestamp: string;
}

export const useAIStream = (projectId: string) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<StreamProgress | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const generate = useCallback(async (prompt: string, onComplete: (data: any) => void) => {
    setIsGenerating(true);
    setProgress({ stage: 'INITIALIZING', message: 'Sending prompt to backend AI service...', timestamp: new Date().toISOString() });
    setLogs([]);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_URL || ''}/api/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, projectId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Generation failed.');
      }

      const payload = await response.json();
      onComplete(payload.data);
    } catch (err: any) {
      setError(err?.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }

    return () => undefined;
  }, [projectId, accessToken]);

  return { isGenerating, progress, logs, error, generate };
};
