import { create } from 'zustand';
import { AgentLog, WorkspaceFile } from '@sitegenie/ai-core';

interface AppState {
  files: Record<string, string>;
  activeFile: string | null;
  logs: AgentLog[];
  isExecuting: boolean;
  activeView: 'builder' | 'dashboard' | 'settings';
  
  // SaaS Info
  saas: {
    plan: 'FREE' | 'PRO' | 'ENTERPRISE';
    tokensUsed: number;
    maxTokens: number;
    usagePercent: number;
  };
  
  // Actions
  setFiles: (files: Record<string, string>) => void;
  updateFile: (path: string, content: string) => void;
  setActiveFile: (path: string) => void;
  addLog: (log: AgentLog) => void;
  setExecuting: (status: boolean) => void;
  resetLogs: () => void;
  setActiveView: (view: 'builder' | 'dashboard' | 'settings') => void;
}

export const useStore = create<AppState>((set) => ({
  files: {
    'App.tsx': `export default function App() {\n  return (\n    <div className="p-8">\n      <h1 className="text-3xl font-bold">Hello SiteGenie</h1>\n      <p className="text-gray-400 mt-2">Start building your AI website.</p>\n    </div>\n  );\n}`,
    'index.css': `@import "tailwindcss";\n\nbody {\n  background: #0a0a0c;\n  color: white;\n}`,
  },
  activeFile: 'App.tsx',
  logs: [],
  isExecuting: false,
  activeView: 'builder',
  saas: {
    plan: 'FREE',
    tokensUsed: 42500,
    maxTokens: 100000,
    usagePercent: 42.5,
  },

  setFiles: (files) => set({ files }),
  updateFile: (path, content) => set((state) => ({
    files: { ...state.files, [path]: content }
  })),
  setActiveFile: (activeFile) => set({ activeFile }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setExecuting: (isExecuting) => set({ isExecuting }),
  resetLogs: () => set({ logs: [] }),
  setActiveView: (activeView) => set({ activeView }),
}));
