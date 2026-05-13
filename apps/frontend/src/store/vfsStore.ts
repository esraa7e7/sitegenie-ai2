import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface VFSNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  parentId: string | null;
  children?: string[]; // IDs of children
  path: string;
}

interface VFSState {
  nodes: Record<string, VFSNode>;
  rootId: string;
  selectedId: string | null;
  openFileIds: string[];
  activeFileId: string | null;
  modifiedFileIds: Set<string>;

  // Actions
  createFile: (parentId: string, name: string, content?: string) => string;
  createFolder: (parentId: string, name: string) => string;
  updateFileContent: (id: string, content: string) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  openFile: (id: string) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string | null) => void;
  renameNode: (id: string, newName: string) => void;
  
  // Helpers
  getNodeByPath: (path: string) => VFSNode | undefined;
}

const INITIAL_ROOT_ID = 'root';

export const useVFSStore = create<VFSState>()(
  persist(
    (set, get) => ({
      nodes: {
        [INITIAL_ROOT_ID]: {
          id: INITIAL_ROOT_ID,
          name: 'project',
          type: 'folder',
          parentId: null,
          children: [],
          path: '/',
        },
      },
      rootId: INITIAL_ROOT_ID,
      selectedId: null,
      openFileIds: [],
      activeFileId: null,
      modifiedFileIds: new Set(),

      createFile: (parentId, name, content = '') => {
        const id = nanoid();
        const parent = get().nodes[parentId];
        if (!parent || parent.type !== 'folder') return '';

        const path = parentId === INITIAL_ROOT_ID ? `/${name}` : `${parent.path}/${name}`;
        
        const newNode: VFSNode = {
          id,
          name,
          type: 'file',
          content,
          parentId,
          path,
        };

        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: newNode,
            [parentId]: {
              ...parent,
              children: [...(parent.children || []), id],
            },
          },
        }));

        return id;
      },

      createFolder: (parentId, name) => {
        const id = nanoid();
        const parent = get().nodes[parentId];
        if (!parent || parent.type !== 'folder') return '';

        const path = parentId === INITIAL_ROOT_ID ? `/${name}` : `${parent.path}/${name}`;

        const newNode: VFSNode = {
          id,
          name,
          type: 'folder',
          parentId,
          children: [],
          path,
        };

        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: newNode,
            [parentId]: {
              ...parent,
              children: [...(parent.children || []), id],
            },
          },
        }));

        return id;
      },

      updateFileContent: (id, content) => {
        set((state) => ({
          nodes: {
            ...state.nodes,
            [id]: { ...state.nodes[id], content },
          },
          modifiedFileIds: new Set(state.modifiedFileIds).add(id),
        }));
      },

      deleteNode: (id) => {
        if (id === INITIAL_ROOT_ID) return;
        const node = get().nodes[id];
        if (!node) return;

        const parentId = node.parentId;
        
        set((state) => {
          const newNodes = { ...state.nodes };
          delete newNodes[id];
          
          if (parentId && newNodes[parentId]) {
            newNodes[parentId] = {
              ...newNodes[parentId],
              children: newNodes[parentId].children?.filter((cid) => cid !== id),
            };
          }

          return {
            nodes: newNodes,
            openFileIds: state.openFileIds.filter((oid) => oid !== id),
            activeFileId: state.activeFileId === id ? null : state.activeFileId,
            selectedId: state.selectedId === id ? null : state.selectedId,
          };
        });
      },

      selectNode: (id) => set({ selectedId: id }),

      openFile: (id) => {
        const state = get();
        if (!state.nodes[id] || state.nodes[id].type !== 'file') return;
        
        if (!state.openFileIds.includes(id)) {
          set({ openFileIds: [...state.openFileIds, id] });
        }
        set({ activeFileId: id });
      },

      closeFile: (id) => {
        set((state) => {
          const nextOpen = state.openFileIds.filter((oid) => oid !== id);
          let nextActive = state.activeFileId;
          if (nextActive === id) {
            nextActive = nextOpen.length > 0 ? nextOpen[nextOpen.length - 1] : null;
          }
          return {
            openFileIds: nextOpen,
            activeFileId: nextActive,
          };
        });
      },

      setActiveFile: (id) => set({ activeFileId: id }),

      renameNode: (id, newName) => {
         set((state) => {
           const node = state.nodes[id];
           if (!node) return state;
           const parent = node.parentId ? state.nodes[node.parentId] : null;
           const newPath = parent ? (parent.id === INITIAL_ROOT_ID ? `/${newName}` : `${parent.path}/${newName}`) : `/${newName}`;
           
           return {
             nodes: {
               ...state.nodes,
               [id]: { ...node, name: newName, path: newPath }
             }
           };
         });
      },

      getNodeByPath: (path) => {
        return Object.values(get().nodes).find((n) => n.path === path);
      }
    }),
    {
      name: 'sitegenie-vfs',
      partialize: (state) => ({ nodes: state.nodes, rootId: state.rootId }),
    }
  )
);
