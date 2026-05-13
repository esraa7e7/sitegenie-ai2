import React, { useState } from 'react';
import { 
  MousePointer2, Type, Image, Square, Layers, Sparkles, 
  Sliders, Play, Laptop, Tablet, Smartphone, Search,
  Settings, ChevronRight, Hash, Palette, Zap
} from 'lucide-react';

export function VisualEditor() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const viewportWidth = {
    desktop: 'max-w-5xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-xs'
  };

  return (
    <div className="flex-1 bg-[#121214] flex overflow-hidden">
      {/* Visual Workspace */}
      <div className="flex-1 relative flex flex-col items-center p-8 overflow-auto group">
        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl px-2 py-1.5 rounded-2xl border border-white/5 mb-8">
           <ViewportBtn icon={<Laptop size={14} />} active={viewport === 'desktop'} onClick={() => setViewport('desktop')} />
           <ViewportBtn icon={<Tablet size={14} />} active={viewport === 'tablet'} onClick={() => setViewport('tablet')} />
           <ViewportBtn icon={<Smartphone size={14} />} active={viewport === 'mobile'} onClick={() => setViewport('mobile')} />
           <div className="h-3 w-px bg-white/10 mx-2" />
           <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-2">
             {viewport === 'desktop' ? '1440px' : viewport === 'tablet' ? '768px' : '390px'}
           </span>
        </div>

        {/* The Frame */}
        <div className={`w-full ${viewportWidth[viewport]} aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden relative border-[12px] border-[#1A1A1E] transition-all duration-500 ease-in-out`}>
           <div className="absolute inset-0 bg-[#F9FAFB] flex items-center justify-center">
              <div className="text-center space-y-4 max-w-sm px-6">
                 <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto text-blue-600">
                    <Sparkles size={32} />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900">AI Component Ready</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Canvas is live. Use the left panel to drop components or the AI orchestrator to generate a full page.
                 </p>
              </div>
           </div>

           {/* Interactive Layer (Simulated) */}
           <div className="absolute inset-0 z-10 p-12 overflow-y-auto">
              {/* Example Selectable Component */}
              <div 
                onClick={() => setSelectedId('hero-1')}
                className={`group/item relative p-8 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === 'hero-1' ? 'border-blue-500 bg-blue-500/5' : 'border-transparent hover:border-blue-500/20'}`}
              >
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mb-6" />
                  <div className="flex gap-3">
                     <div className="h-12 w-32 bg-blue-600/20 rounded-xl" />
                     <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                  </div>
                  {selectedId === 'hero-1' && <ResizeHandles />}
                  <div className={`absolute -top-3 -right-3 bg-blue-600 text-[10px] font-bold text-white px-2 py-1 rounded-md shadow-xl transition-opacity ${selectedId === 'hero-1' ? 'opacity-100' : 'opacity-0'}`}>
                    hero_section_v1
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Control Sidebar */}
      <aside className="w-80 border-l border-white/5 bg-[#0D0D0F] flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Layers size={16} className="text-blue-500" />
             <span className="text-xs font-bold uppercase tracking-widest">Properties</span>
           </div>
           <Settings size={14} className="text-white/20" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {selectedId ? (
             <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                   <SectionHeader label="Visual Styling" />
                   <div className="grid grid-cols-2 gap-3">
                      <PropertyControl label="Opacity" value="100%" />
                      <PropertyControl label="Radius" value="24px" />
                   </div>
                   <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/20 uppercase">Background</span>
                        <div className="w-4 h-4 rounded-full bg-blue-600" />
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="w-full h-full bg-blue-600" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <SectionHeader label="Animations" />
                   <AnimationSetting icon={<Play size={14} />} label="Fade & Slide" />
                   <AnimationSetting icon={<Zap size={14} />} label="Hover Lift" />
                </div>

                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl hstack center gap-2 text-xs font-bold transition-all shadow-lg shadow-blue-600/20">
                   <Sparkles size={14} />
                   Refine with AI
                </button>
             </div>
           ) : (
             <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                   <MousePointer2 size={16} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest">Select an element to edit</div>
             </div>
           )}
        </div>

        {/* Global Styles Toolbar */}
        <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-around">
           <ToolbarIcon icon={<Type size={16} />} />
           <ToolbarIcon icon={<Palette size={16} />} />
           <ToolbarIcon icon={<Hash size={16} />} />
           <ToolbarIcon icon={<Search size={16} />} />
        </div>
      </aside>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">{label}</h4>;
}

function ViewportBtn({ icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white/40'}`}
    >
      {icon}
    </button>
  );
}

function ResizeHandles() {
  return (
    <div className="absolute inset-0 pointer-events-none ring-2 ring-blue-500 rounded-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-blue-500 rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-1 bg-blue-500 rounded-full" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-blue-500 rounded-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-1 bg-blue-500 rounded-full" />
    </div>
  );
}

function PropertyControl({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl group cursor-pointer hover:border-white/10 transition-all">
       <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">{label}</div>
       <div className="text-[11px] font-medium text-white/60">{value}</div>
    </div>
  );
}

function AnimationSetting({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all cursor-pointer group">
       <div className="flex items-center gap-3">
          <span className="text-blue-500/60 group-hover:text-blue-500 transition-colors">{icon}</span>
          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">{label}</span>
       </div>
       <ChevronRight size={12} className="text-white/10 group-hover:text-white/40" />
    </div>
  );
}

function ToolbarIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all">
      {icon}
    </button>
  );
}
