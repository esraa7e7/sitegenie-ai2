import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

export const useVfsAutoSave = (projectId: string, files: any[]) => {
  const { accessToken } = useAuthStore();
  const lastFilesRef = useRef(files);

  useEffect(() => {
    // Detect changes
    if (JSON.stringify(files) === JSON.stringify(lastFilesRef.current)) {
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || '';
    const timer = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/api/v1/projects/${projectId}/vfs/autosave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ files })
        });
        lastFilesRef.current = files;
        console.log('[VFS] Auto-save successful');
      } catch (err) {
        console.error('[VFS] Auto-save failed', err);
      }
    }, 4000); // 4 second debounce

    return () => clearTimeout(timer);
  }, [files, projectId, accessToken]);
};
