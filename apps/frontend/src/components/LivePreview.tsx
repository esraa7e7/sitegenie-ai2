import React from 'react';
import { SandpackProvider, SandpackPreview, SandpackLayout } from "@codesandbox/sandpack-react";
import { useStore } from '../store/useStore';
import { RefreshCcw, ExternalLink } from 'lucide-react';

export const LivePreview = () => {
  const { files } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#18181b]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live_Preview</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors">
            <RefreshCcw size={14} />
          </button>
          <button className="p-1 hover:bg-white/5 rounded text-white/20 hover:text-white transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SandpackProvider
          template="react"
          files={files}
          theme="dark"
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout style={{ height: '100%', border: 'none', borderRadius: 0 }}>
            <SandpackPreview 
              style={{ height: '100%' }} 
              showNavigator={false} 
              showRefreshButton={false}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};
