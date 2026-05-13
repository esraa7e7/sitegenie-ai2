import React from 'react';
import Editor from '@monaco-editor/react';
import { useVFSStore } from '../../store/vfsStore';
import { X, Save, FileCode } from 'lucide-react';

export function CodeEditor() {
  const { nodes, activeFileId, openFileIds, setActiveFile, closeFile, updateFileContent } = useVFSStore();
  
  const activeFile = activeFileId ? nodes[activeFileId] : null;

  const handleEditorChange = (value: string | undefined) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  if (!activeFileId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0C] text-white/10">
        <FileCode size={64} strokeWidth={1} />
        <p className="mt-4 font-bold uppercase tracking-[0.3em] text-xs">No active file</p>
      </div>
    );
  }

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx': return 'typescript';
      case 'js':
      case 'jsx': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0C] overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-[#0D0D0F] border-b border-white/5 px-2 overflow-x-auto no-scrollbar">
        {openFileIds.map(id => {
          const file = nodes[id];
          if (!file) return null;
          const isActive = activeFileId === id;
          return (
            <div 
              key={id}
              onClick={() => setActiveFile(id)}
              className={`
                group flex items-center gap-2 px-4 py-2 border-r border-white/5 cursor-pointer transition-all relative min-w-[120px]
                ${isActive ? 'bg-[#0A0A0C] text-white' : 'text-white/20 hover:text-white/40 hover:bg-white/[0.02]'}
              `}
            >
              <FileCode size={14} className={isActive ? 'text-blue-500' : 'text-white/10'} />
              <span className="text-xs font-bold truncate max-w-[100px]">{file.name}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(id);
                }}
                className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all"
              >
                <X size={12} />
              </button>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          theme="vs-dark"
          language={activeFile ? getLanguage(activeFile.name) : 'typescript'}
          value={activeFile?.content || ''}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0C]">
               <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
          }
        />
      </div>
    </div>
  );
}
