import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Code as CodeIcon, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  Rocket, 
  Layers, 
  Layout, 
  Terminal, 
  Settings, 
  Sparkles, 
  AlertCircle,
  History,
  ChevronRight,
  Loader2,
  ExternalLink,
  CheckCircle2,
  X,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewRenderer } from './PreviewRenderer';
import { aiApi } from '../lib/api';
import { useAIStream } from '../hooks/useAIStream';
import { useVfsAutoSave } from '../hooks/useVfsAutoSave';
import { VersionHistory } from './VersionHistory';

export const EditorView = ({ projectId = 'preview' }: { projectId?: string }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [prompt, setPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<{ platform: string, url: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [generatedData, setGeneratedData] = useState<any>(null);
  const { isGenerating, progress, logs, error, generate } = useAIStream(projectId);

  // Auto-save logic
  useVfsAutoSave(projectId, generatedData?.files ? Object.entries(generatedData.files).map(([path, content]) => ({ path, content })) : []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await generate(prompt, (data) => {
      setGeneratedData(data);
      setActiveTab('preview');
    });
  };

  const handleDeploy = async (platform: 'vercel' | 'netlify') => {
    setIsDeploying(true);
    try {
      const res = await aiApi.deploy(projectId, platform);
      if (res.status === 'success') {
        setDeploymentStatus({ platform, url: res.data.url });
      }
    } catch (err) {
      console.error('Deployment failed', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const stages = ['PLANNING', 'DESIGNING', 'BUILDING', 'OPTIMIZNG', 'DEPLOYING'];
  const currentStageIndex = stages.indexOf(progress?.stage || '');

  return (
    <div className="pt-16 h-screen bg-neutral-950 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <aside className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black z-20">
        <button className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20 transition-transform active:scale-95"><Layers size={20} /></button>
        <button className="p-3 text-neutral-500 hover:text-white transition-colors"><Layout size={20} /></button>
        <button onClick={() => setShowHistory(!showHistory)} className={`p-3 transition-colors ${showHistory ? 'text-indigo-400 bg-white/5 rounded-xl' : 'text-neutral-500 hover:text-white'}`}>
          <HistoryIcon size={20} />
        </button>
        <div className="mt-auto flex flex-col gap-6">
          <button className="p-3 text-neutral-500 hover:text-white transition-colors"><Settings size={20} /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/20 ring-2 ring-white/5"></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-[#050505]">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-black/40 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                <Eye size={12} /> Preview
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
              >
                <CodeIcon size={12} /> Code
              </button>
            </div>
            <div className="flex gap-1 h-8 bg-white/5 rounded-lg p-1 border border-white/10">
              <button onClick={() => setDevice('desktop')} className={`px-2 rounded transition-colors ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-neutral-600 hover:text-white'}`}><Monitor size={14} /></button>
              <button onClick={() => setDevice('tablet')} className={`px-2 rounded transition-colors ${device === 'tablet' ? 'bg-white/10 text-white' : 'text-neutral-600 hover:text-white'}`}><Tablet size={14} /></button>
              <button onClick={() => setDevice('mobile')} className={`px-2 rounded transition-colors ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-neutral-600 hover:text-white'}`}><Smartphone size={14} /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-400 hover:text-white transition-all uppercase tracking-widest">
              <Download size={12} /> Export
            </button>
            <button 
              onClick={() => setShowDeploymentModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-500 transition-all uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Rocket size={12} /> Ship
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-auto bg-neutral-950/50">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`transition-all duration-700 ease-out shadow-[0_0_80px_-20px_rgba(79,70,229,0.2)] rounded-3xl overflow-hidden border border-white/10 bg-white ${
                  device === 'desktop' ? 'w-full h-full' : device === 'tablet' ? 'w-[768px] h-full' : 'w-[375px] h-[667px]'
                }`}
              >
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center text-black bg-neutral-50 px-12 text-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="relative w-32 h-32 mb-12"
                    >
                      <div className="absolute inset-0 border-8 border-indigo-100 rounded-full"></div>
                      <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full"></div>
                      <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={40} />
                    </motion.div>
                    
                    <div className="max-w-md w-full mb-8">
                      <h3 className="text-3xl font-black mb-2 flex items-center justify-center gap-3">
                        {progress?.stage || 'Initializing Agents'}
                      </h3>
                      <p className="text-neutral-500 text-sm font-medium animate-pulse">{progress?.message || 'Coordinating multi-agent pipeline...'}</p>
                    </div>

                    {/* Progress Bar Layer */}
                    <div className="w-full max-w-lg flex gap-1 h-1.5 mb-12">
                      {stages.map((_, i) => (
                        <div key={i} className={`flex-1 rounded-full transition-all duration-1000 ${i <= currentStageIndex ? 'bg-indigo-600' : 'bg-neutral-200'}`}></div>
                      ))}
                    </div>

                    {/* Live Logs Sub-area */}
                    <div className="w-full max-w-2xl bg-neutral-900 rounded-2xl p-6 text-left font-mono text-[10px] text-neutral-400 h-48 overflow-hidden relative shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-900 pointer-events-none"></div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2 uppercase border-b border-white/5 pb-2">
                          <Terminal size={12} /> Execution Logs
                        </div>
                        {logs.slice(-10).map((log, i) => (
                          <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                            <span className="text-neutral-200">{log}</span>
                          </div>
                        ))}
                        {logs.length === 0 && <span className="italic opacity-30">Waiting for agent heartbeat...</span>}
                      </div>
                    </div>
                  </div>
                ) : generatedData ? (
                  <PreviewRenderer data={generatedData} />
                ) : error ? (
                  <div className="h-full flex flex-col items-center justify-center text-black p-12 text-center bg-red-50/5">
                    <div className="p-6 bg-red-500/10 rounded-full mb-8">
                      <AlertCircle size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Architectural Failure</h2>
                    <p className="text-neutral-500 max-w-md mx-auto">{error}</p>
                    <button onClick={handleGenerate} className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Retry Operation</button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white p-12 text-center">
                    <div className="relative mb-8">
                      <Sparkles size={64} className="text-indigo-600 animate-pulse" />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute inset-0 bg-indigo-600 rounded-full blur-[40px]"
                      ></motion.div>
                    </div>
                    <h2 className="text-3xl font-black mb-4">Your Vision Awaits</h2>
                    <p className="text-neutral-500 font-medium max-w-sm mb-12">Describe your project and watch our agent swarm architect the source code in real-time.</p>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-[10px] items-center gap-2 flex"><Monitor size={12}/> Fully Responsive</div>
                      <div className="px-4 py-2 border border-white/5 bg-white/5 rounded-xl text-[10px] items-center gap-2 flex"><CodeIcon size={12}/> Clean Typescript</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full bg-black/40 rounded-3xl border border-white/10 p-8 font-mono text-xs overflow-auto text-neutral-400"
              >
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <span className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest"><Terminal size={14}/> Manifest Tree</span>
                  <span className="opacity-30">UTF-8 • Typescript • SiteGenie v1</span>
                </div>
                <code>{generatedData ? JSON.stringify(generatedData, null, 2) : '// No source generated yet. Enter a prompt to begin.'}</code>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Right Sidebar - AI Architect + Version History */}
      <aside className="w-80 border-l border-white/5 bg-black flex flex-col relative overflow-hidden">
        {showHistory ? (
          <VersionHistory projectId={projectId} onRestore={() => window.location.reload()} />
        ) : (
          <div className="flex flex-col h-full p-6">
            <h3 className="font-bold flex items-center gap-2 text-white mb-6 uppercase tracking-[0.2em] text-[10px]">
              <Sparkles size={16} className="text-indigo-400" /> AI Agent Swarm
            </h3>
            
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Project Directive</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: A futuristic SaaS dashboard for quantum computing metrics with dark mode and glassmorphism..."
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all min-h-[220px] mb-4 font-medium leading-relaxed"
              />
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-500 font-bold uppercase tracking-widest">Model</span>
                  <span className="text-white bg-white/5 px-2 py-1 rounded-lg border border-white/10 font-bold">GEMINI 1.5 PRO</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-neutral-500 font-bold uppercase tracking-widest">Agents</span>
                  <span className="text-white bg-white/5 px-2 py-1 rounded-lg border border-white/10 font-bold">5 ACTIVE</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="group relative w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 overflow-hidden active:scale-[0.98]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> 
                    <span>Orchestrating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Project</span>
                  </>
                )}
              </div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            </button>
            <p className="text-center text-[9px] text-neutral-600 mt-4 font-medium uppercase tracking-tight">VFS Automatic Synchronization Enabled</p>
          </div>
        )}
      </aside>

      {/* Deployment Modal */}
      <AnimatePresence>
        {showDeploymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeploymentModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl"
            >
              {/* Animated background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 text-white">
                    <Rocket size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">One-Click Ship</h2>
                    <p className="text-neutral-500 text-sm font-medium">Production-ready deployment pipeline</p>
                  </div>
                </div>
                <button onClick={() => setShowDeploymentModal(false)} className="p-3 text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              {deploymentStatus ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase">System Live</h3>
                  <p className="text-neutral-500 mb-10">Successfully deployed to {deploymentStatus.platform} global edge network.</p>
                  
                  <div className="flex flex-col gap-4">
                    <a 
                      href={deploymentStatus.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all uppercase tracking-widest text-xs"
                    >
                      <ExternalLink size={16} /> Open Preview
                    </a>
                    <button 
                      onClick={() => setDeploymentStatus(null)}
                      className="text-xs font-bold text-neutral-500 hover:text-white transition-colors"
                    >
                      Deploy Another Version
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleDeploy('vercel')}
                      disabled={isDeploying}
                      className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/20 hover:bg-white/[0.05] transition-all text-left flex flex-col gap-4 relative overflow-hidden"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg" className="w-8 h-8 invert brightness-0 grayscale opacity-40 group-hover:opacity-100 transition-opacity" alt="Vercel" />
                      <div>
                        <p className="text-white font-bold mb-1">Vercel Edge</p>
                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">Serverless Functions</p>
                      </div>
                      {isDeploying && <Loader2 className="absolute top-6 right-6 animate-spin text-indigo-500" size={16} />}
                    </button>

                    <button 
                      onClick={() => handleDeploy('netlify')}
                      disabled={isDeploying}
                      className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:border-white/20 hover:bg-white/[0.05] transition-all text-left flex flex-col gap-4 relative overflow-hidden"
                    >
                      <img src="https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg" className="w-8 h-8 grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all" alt="Netlify" />
                      <div>
                        <p className="text-white font-bold mb-1">Netlify Core</p>
                        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest">Global CDN Delivery</p>
                      </div>
                      {isDeploying && <Loader2 className="absolute top-6 right-6 animate-spin text-indigo-500" size={16} />}
                    </button>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-xs text-neutral-400">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                        <span>Instant static file optimization</span>
                      </li>
                      <li className="flex items-center gap-3 text-xs text-neutral-400">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                        <span>Automated VFS manifest sync</span>
                      </li>
                      <li className="flex items-center gap-3 text-xs text-neutral-400">
                        <CheckCircle2 size={14} className="text-indigo-400" />
                        <span>SSL certificate generation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

