import React, { useState, useEffect } from 'react';
import { History, RotateCcw, Save, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Snapshot {
  id: string;
  version: number;
  metadata: { reason: string; timestamp: string };
  createdAt: string;
}

export const VersionHistory = ({ projectId, onRestore }: { projectId: string; onRestore: () => void }) => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveReason, setSaveReason] = useState('');

  const fetchSnapshots = async () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    const res = await fetch(`${API_URL}/api/v1/projects/${projectId}/snapshots`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('sitegenie-auth')}` }
    });
    const data = await res.json();
    if (data.status === 'success') setSnapshots(data.data);
  };

  useEffect(() => { fetchSnapshots(); }, [projectId]);

  const handleSave = async () => {
    if (!saveReason.trim()) return;
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      await fetch(`${API_URL}/api/v1/projects/${projectId}/snapshots`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sitegenie-auth')}` 
        },
        body: JSON.stringify({ reason: saveReason })
      });
      setSaveReason('');
      fetchSnapshots();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Are you sure you want to restore this version? Current unsaved changes will be lost.')) return;
    const API_URL = import.meta.env.VITE_API_URL || '';
    await fetch(`${API_URL}/api/v1/projects/${projectId}/snapshots/${id}/restore`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('sitegenie-auth')}` }
    });
    onRestore();
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border-l border-white/5 w-80 p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <History size={18} className="text-indigo-400" />
        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Timeline</h3>
      </div>

      <div className="mb-8">
        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2 tracking-widest">Create Checkpoint</label>
        <div className="flex flex-col gap-2">
          <input 
            type="text"
            value={saveReason}
            onChange={(e) => setSaveReason(e.target.value)}
            placeholder="What changed?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
          />
          <button 
            onClick={handleSave}
            disabled={isLoading || !saveReason}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Save size={14} /> Save Snapshot
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">History</label>
        {snapshots.length === 0 ? (
          <p className="text-xs text-neutral-600 text-center py-8">No snapshots yet</p>
        ) : snapshots.map((s) => (
          <div key={s.id} className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-white/20 transition-all cursor-default">
            <div className="flex items-start justify-between mb-1">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">v.{s.version}</span>
              <span className="text-[9px] text-neutral-500 font-medium flex items-center gap-1">
                <Clock size={10} /> {format(new Date(s.createdAt), 'MMM d, HH:mm')}
              </span>
            </div>
            <p className="text-xs text-white font-medium mb-3 line-clamp-2">{s.metadata.reason}</p>
            <button 
              onClick={() => handleRestore(s.id)}
              className="flex items-center gap-2 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-widest transition-all"
            >
              <RotateCcw size={12} /> Rollback
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
