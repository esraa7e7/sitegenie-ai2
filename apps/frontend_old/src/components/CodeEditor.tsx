import React from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { Maximize2, Minimize2 } from 'lucide-react';

export const CodeEditor = () => {
  const { files, activeFile, updateFile } = useStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  if (!activeFile) return null;

  const content = files[activeFile] || '';
  const language = activeFile.endsWith('.css') ? 'css' : 'typescript';

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] border-r border-white/5 relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Editing:</span>
          <span className="text-xs font-mono text-blue-400">{activeFile}</span>
        </div>
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          theme="vs-dark"
          onChange={(value) => updateFile(activeFile, value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'monospace',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>
    </div>
  );
};
