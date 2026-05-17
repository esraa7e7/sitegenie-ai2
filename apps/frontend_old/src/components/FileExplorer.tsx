import React from 'react';
import { File, ChevronRight, Folder } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FileExplorer = () => {
  const { files, activeFile, setActiveFile } = useStore();
  
  return (
    <div className="flex flex-col h-full bg-[#0d0d0f] border-r border-white/5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Filesystem</h3>
        <Folder size={14} className="text-white/20" />
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.keys(files).map((path) => (
          <button
            key={path}
            id={`file-btn-${path}`}
            onClick={() => setActiveFile(path)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all group text-sm",
              activeFile === path 
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                : "text-white/50 hover:bg-white/5 hover:text-white"
            )}
          >
            <File size={14} className={activeFile === path ? "text-blue-400" : "text-white/20 group-hover:text-white/40"} />
            <span className="truncate">{path}</span>
            <ChevronRight size={12} className={cn("ml-auto opacity-0 transition-opacity", activeFile === path && "opacity-100")} />
          </button>
        ))}
      </div>
    </div>
  );
};
