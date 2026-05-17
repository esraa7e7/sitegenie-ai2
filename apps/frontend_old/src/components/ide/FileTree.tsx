import React from 'react';
import { useVFSStore, VFSNode } from '../../store/vfsStore';
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash2, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FileTree() {
  const { nodes, rootId, selectNode, selectedId } = useVFSStore();
  const root = nodes[rootId];

  return (
    <div className="flex flex-col h-full bg-[#0D0D0F] text-xs select-none">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="font-bold text-white/40 uppercase tracking-widest">Explorer</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
            <Plus size={14} />
          </button>
          <button className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
            <FolderPlus size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {root && <FileTreeNode id={root.id} level={0} />}
      </div>
    </div>
  );
}

function FileTreeNode({ id, level }: { id: string, level: number }) {
  const { nodes, selectNode, selectedId, openFile } = useVFSStore();
  const node = nodes[id];
  const [isOpen, setIsOpen] = React.useState(true);

  if (!node) return null;

  const isSelected = selectedId === id;

  const handleClick = () => {
    selectNode(id);
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      openFile(id);
    }
  };

  return (
    <div className="group">
      <div 
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all
          ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-white/40 hover:bg-white/5 hover:text-white'}
        `}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} className={isOpen ? 'text-blue-500' : 'text-blue-500/60'} />
          </>
        ) : (
          <>
            <div className="w-3.5" />
            <File size={14} className="text-white/20" />
          </>
        )}
        <span className="truncate flex-1 font-medium">{node.name}</span>
      </div>

      <AnimatePresence>
        {node.type === 'folder' && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map(childId => (
              <FileTreeNode key={childId} id={childId} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
