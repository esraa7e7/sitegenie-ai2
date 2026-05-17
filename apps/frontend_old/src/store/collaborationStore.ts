import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAIStore } from './aiStore';

interface Collaborator {
  socketId: string;
  userId: string;
  userName: string;
  cursor?: { x: number, y: number, file: string };
}

interface CollaborationState {
  socket: Socket | null;
  collaborators: Collaborator[];
  comments: any[];
  initSocket: (projectId: string, user: { id: string, name: string }) => void;
  updateCursor: (projectId: string, cursor: { x: number, y: number, file: string }) => void;
  cleanup: () => void;
}

export const useCollaborationStore = create<CollaborationState>((set, get) => ({
  socket: null,
  collaborators: [],
  comments: [],

  initSocket: (projectId, user) => {
    // Determine socket URL - assuming it's the same host as the API
    const socket = io('/', { transports: ['websocket'] });

    socket.emit('join-project', {
      projectId,
      userId: user.id,
      userName: user.name
    });

    socket.on('presence-update', (collaborators: Collaborator[]) => {
      set({ collaborators: collaborators.filter(c => c.userId !== user.id) });
    });

    socket.on('user-cursor-moved', (data: { socketId: string, cursor: any }) => {
      set(state => ({
        collaborators: state.collaborators.map(c => 
          c.socketId === data.socketId ? { ...c, cursor: data.cursor } : c
        )
      }));
    });

    socket.on('comment-added', (comment: any) => {
      set(state => ({ comments: [...state.comments, comment] }));
    });

    socket.on('ai-progress', (data: { status: string }) => {
      const stepId = data.status.split(':')[0];
      useAIStore.getState().updatePipelineStep(stepId, { status: 'running' });
      
      // Auto-complete previous steps for visual consistency
      const pipeline = useAIStore.getState().pipeline;
      const currentIndex = pipeline.findIndex(s => s.id === stepId);
      if (currentIndex > 0) {
        for (let i = 0; i < currentIndex; i++) {
          useAIStore.getState().updatePipelineStep(pipeline[i].id, { status: 'completed' });
        }
      }
    });

    set({ socket });
  },

  updateCursor: (projectId, cursor) => {
    const { socket } = get();
    if (socket) {
      socket.emit('cursor-move', { projectId, cursor });
    }
  },

  cleanup: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, collaborators: [] });
    }
  }
}));
