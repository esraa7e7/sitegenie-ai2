import React, { useState, useRef, useEffect } from 'react';
import { useAIStore, AIChatMessage, AITask } from '../../store/aiStore';
import { Send, Zap, Loader2, ListChecks, CheckCircle2, CircleDashed, Terminal, History, Activity, X, Users, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { aiExecutionEngine } from '../../services/aiExecutionEngine';

export function ChatPanel() {
  const { messages, tasks, isProcessing, addMessage, setProcessing, pipeline, confidenceScore } = useAIStore();
  const [activeMode, setActiveMode] = useState<'ai' | 'team'>('ai');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, tasks, confidenceScore]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    
    await aiExecutionEngine.processRequest(userMessage);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0D0F] border-l border-white/5 shadow-2xl relative z-10">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#111114]">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${activeMode === 'ai' ? 'bg-blue-600' : 'bg-purple-600'} rounded-xl flex items-center justify-center shadow-lg transition-all relative overflow-hidden`}>
                {activeMode === 'ai' ? <Zap size={22} className="text-white fill-white" /> : <Users size={22} className="text-white" />}
                {confidenceScore > 0 && activeMode === 'ai' && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${confidenceScore}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500/30 blur-sm"
                  />
                )}
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">{activeMode === 'ai' ? 'AI Assistant' : 'Team Hub'}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 ${activeMode === 'ai' ? (confidenceScore >= 85 ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-blue-500'} rounded-full animate-pulse`} />
                  <span className={`text-[10px] ${activeMode === 'ai' ? (confidenceScore >= 85 ? 'text-emerald-500' : 'text-blue-500') : 'text-blue-500'} font-bold uppercase tracking-widest`}>
                    {activeMode === 'ai' ? (confidenceScore > 0 ? `Production Confidence: ${confidenceScore}%` : 'Quantum Engine Online') : 'Live Sync Active'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex bg-white/[0.03] p-1 rounded-lg border border-white/10">
               <button 
                 onClick={() => setActiveMode('ai')}
                 className={`p-1.5 rounded-md transition-all ${activeMode === 'ai' ? 'bg-white/10 text-white' : 'text-white/20'}`}
               >
                 <Zap size={14} />
               </button>
               <button 
                 onClick={() => setActiveMode('team')}
                 className={`p-1.5 rounded-md transition-all ${activeMode === 'team' ? 'bg-white/10 text-white' : 'text-white/20'}`}
               >
                 <MessageSquare size={14} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
      >
        {activeMode === 'ai' ? (
          <>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/10' 
                      : 'bg-white/5 border border-white/10 text-white/80'}
                  `}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Action Timeline */}
            {(isProcessing || confidenceScore > 0) && (
              <div className="mx-2 mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Multi-Agent Pipeline</span>
                    {confidenceScore > 0 && <span className="text-[8px] font-bold text-emerald-500 uppercase">System Integrity Guaranteed: {confidenceScore >= 85 ? 'HIGH' : 'OPTIMAL'}</span>}
                  </div>
                  <div className="flex gap-1">
                    {pipeline.map((step) => (
                      <div 
                        key={step.id} 
                        className={`w-1.5 h-1.5 rounded-full ${
                          step.status === 'completed' ? 'bg-emerald-500' :
                          step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                          'bg-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {pipeline.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2">
                       <div className={`
                         w-8 h-8 rounded-xl flex items-center justify-center transition-all
                         ${step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' :
                           step.status === 'running' ? 'bg-blue-600 shadow-lg shadow-blue-600/30 text-white' :
                           'bg-white/5 text-white/10'}
                       `}>
                          {step.status === 'completed' ? <CheckCircle2 size={14} /> :
                           step.status === 'running' ? <Loader2 size={14} className="animate-spin" /> :
                           <CircleDashed size={14} />}
                       </div>
                       <span className={`text-[8px] font-bold uppercase tracking-tighter text-center ${step.status === 'running' ? 'text-blue-400' : (step.status === 'completed' ? 'text-emerald-500/40' : 'text-white/20')}`}>
                         {step.label}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(tasks).length > 0 && (
              <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-2 px-1">
                    <Activity size={14} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Execution Timeline</span>
                 </div>
                 <div className="space-y-3">
                    {Object.values(tasks).map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                 </div>
              </div>
            )}

            {isProcessing && !pipeline.some(s => s.status === 'running') && (
              <div className="flex items-center gap-3 text-white/40 italic text-sm animate-pulse px-2">
                <Loader2 size={16} className="animate-spin" />
                <span>AI is brainstorming...</span>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6">
             <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-1">Live Activity</p>
                <p className="text-xs text-white/60">Collaborators are currently editing <span className="font-mono text-white/80">src/App.tsx</span></p>
             </div>
             
             <div className="space-y-4">
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Recent Comments</h3>
                <div className="space-y-3">
                   <CommentItem user="Esra Abbas" content="Should we move the API key to environment variables?" time="2m ago" />
                   <CommentItem user="Project Bot" content="Build suceeded for deployment dep_x82js9" time="15m ago" />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-white/5 bg-[#111114]">
        <div className="relative group">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={activeMode === 'ai' ? "Ask AI to build something..." : "Type a comment to team..."}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none min-h-[60px] max-h-[200px]"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className={`
              absolute right-3 bottom-3 p-2 rounded-xl transition-all
              ${input.trim() && !isProcessing 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20' 
                : 'bg-white/5 text-white/10 cursor-not-allowed'}
            `}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-white/20 text-center font-bold uppercase tracking-widest">
          Press Enter to Generate • Shift + Enter for New Line
        </p>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: AITask }) {
  const isCompleted = task.status === 'completed';
  const isRunning = task.status === 'running';
  const isFailed = task.status === 'failed';

  return (
    <div className={`
      p-3 rounded-xl border transition-all flex flex-col gap-2
      ${isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 
        isRunning ? 'bg-blue-500/5 border-blue-500/20' : 
        isFailed ? 'bg-red-500/5 border-red-500/20' : 
        'bg-white/[0.02] border-white/5'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCompleted ? <CheckCircle2 size={16} className="text-emerald-500" /> :
           isRunning ? <Loader2 size={16} className="text-blue-500 animate-spin" /> :
           isFailed ? <X size={16} className="text-red-500" /> :
           <CircleDashed size={16} className="text-white/20" />}
          <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : isRunning ? 'text-blue-400' : 'text-white/40'}`}>
            {task.description}
          </span>
        </div>
        <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{task.type}</span>
      </div>
    </div>
  );
}

function CommentItem({ user, content, time }: { user: string, content: string, time: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2 hover:border-white/10 transition-all cursor-pointer">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center text-[8px] font-bold text-white uppercase">{user.slice(0, 1)}</div>
             <span className="text-[11px] font-bold text-white/80">{user}</span>
          </div>
          <span className="text-[9px] font-bold text-white/10">{time}</span>
       </div>
       <p className="text-xs text-white/40 leading-relaxed">{content}</p>
    </div>
  );
}
