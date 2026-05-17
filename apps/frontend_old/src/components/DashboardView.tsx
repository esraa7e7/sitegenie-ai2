import React, { useState } from 'react';
import { Plus, MoreVertical, Eye, Code, Globe } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  thumbnail?: string;
}

interface DashboardViewProps {
  onNewProject: () => void;
  onSelectProject: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNewProject, onSelectProject }) => {
  const [projects] = useState<Project[]>([
    { id: '1', name: 'Coffee Brand Landing', description: 'A modern landing page for a coffee subscription brand.', lastUpdated: '2 hours ago' },
    { id: '2', name: 'SaaS Analytics Dashboard', description: 'Enterprise-grade dashboard for data visualization.', lastUpdated: '1 day ago' },
    { id: '3', name: 'Personal Portfolio v2', description: 'Minimalist portfolio with 3D elements.', lastUpdated: '3 days ago' },
  ]);

  return (
    <div className="pt-24 min-h-screen bg-black px-6" id="dashboard-container">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight text-white">Your Projects</h1>
            <p className="text-neutral-500 font-medium">Manage and iterate on your AI-generated websites.</p>
          </div>
          <button 
            id="new-project-btn"
            onClick={onNewProject}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-2 group shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            New Project
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onSelectProject(p.id)}
              className="group relative bg-white/5 border border-white/5 rounded-[32px] overflow-hidden hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="aspect-video bg-neutral-900 flex items-center justify-center p-8 border-b border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-neutral-700 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all duration-500">
                  <Globe size={32} />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-white">{p.name}</h3>
                  <button className="text-neutral-600 hover:text-white transition-colors" id={`project-menu-${p.id}`}><MoreVertical size={16} /></button>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed font-medium">{p.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">Updated {p.lastUpdated}</span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-indigo-500/20 transition-all" title="View Preview"><Eye size={14} /></button>
                    <button className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-indigo-500/20 transition-all" title="View Code"><Code size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={onNewProject}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-neutral-500 hover:text-indigo-400 min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Plus size={24} />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest">Create New Architecture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
