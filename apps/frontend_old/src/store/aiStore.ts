import { create } from 'zustand';

export interface AITask {
  id: string;
  type: 'create_file' | 'edit_file' | 'shell_command' | 'plan';
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  payload: any;
  result?: any;
  error?: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  tasks?: string[]; // Associated task IDs
}

export interface PipelineStep {
  id: string;
  label: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

interface AIState {
  messages: AIChatMessage[];
  tasks: Record<string, AITask>;
  pipeline: PipelineStep[];
  confidenceScore: number;
  isProcessing: boolean;
  currentTaskIndex: number;
  activeTaskIds: string[];

  // Actions
  addMessage: (message: Omit<AIChatMessage, 'id' | 'timestamp'>) => string;
  addTask: (task: Omit<AITask, 'id' | 'status'>) => string;
  updateTask: (id: string, updates: Partial<AITask>) => void;
  updatePipelineStep: (id: string, updates: Partial<PipelineStep>) => void;
  resetPipeline: () => void;
  setConfidenceScore: (score: number) => void;
  setProcessing: (processing: boolean) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  tasks: {},
  pipeline: [
    { id: 'PLANNING', label: 'Planner', status: 'idle' },
    { id: 'DESIGNING', label: 'Designer', status: 'idle' },
    { id: 'BUILDING', label: 'Code Builder', status: 'idle' },
    { id: 'OPTIMIZNG', label: 'Optimizer', status: 'idle' },
    { id: 'DEPLOYING', label: 'Deployment', status: 'idle' },
  ],
  confidenceScore: 0,
  isProcessing: false,
  currentTaskIndex: -1,
  activeTaskIds: [],

  addMessage: (message) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      messages: [...state.messages, { ...message, id, timestamp: Date.now() }]
    }));
    return id;
  },

  addTask: (task) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      tasks: {
        ...state.tasks,
        [id]: { ...task, id, status: 'pending' }
      },
      activeTaskIds: [...state.activeTaskIds, id]
    }));
    return id;
  },

  updateTask: (id, updates) => set((state) => ({
    tasks: {
      ...state.tasks,
      [id]: { ...state.tasks[id], ...updates }
    }
  })),

  updatePipelineStep: (id, updates) => set((state) => ({
    pipeline: state.pipeline.map(step => step.id === id ? { ...step, ...updates } : step)
  })),

  resetPipeline: () => set((state) => ({
    pipeline: state.pipeline.map(step => ({ ...step, status: 'idle' })),
    confidenceScore: 0
  })),

  setConfidenceScore: (confidenceScore) => set({ confidenceScore }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  clearHistory: () => set({ messages: [], tasks: {}, activeTaskIds: [] })
}));
