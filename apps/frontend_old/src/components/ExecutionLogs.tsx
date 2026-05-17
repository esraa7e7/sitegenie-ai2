import React from 'react';
import { useStore } from '../store/useStore';
import { Bot, Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExecutionLogs = () => {
  const { logs, isExecuting } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#0d0d0f]">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Execution_Logs</h3>
        <Terminal size={14} className="text-white/20" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3"
            >
              <div className="mt-0.5">
                {log.type === 'success' && <CheckCircle2 size={12} className="text-green-500" />}
                {log.type === 'error' && <AlertCircle size={12} className="text-red-500" />}
                {log.type === 'info' && <Bot size={12} className="text-blue-500" />}
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-white/30 truncate block">[{log.role}]</span>
                <p className="text-white/70 leading-relaxed">{log.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isExecuting && (
          <div className="flex items-center gap-2 text-blue-400 animate-pulse">
            <Loader2 size={12} className="animate-spin" />
            <span>Agent thinking...</span>
          </div>
        )}
        
        {logs.length === 0 && !isExecuting && (
          <div className="h-full flex flex-col items-center justify-center text-white/10 italic">
            <span>No activity recorded</span>
          </div>
        )}
      </div>
    </div>
  );
};
