import React from 'react';
import { Activity, Shield, Cpu, HardDrive, Globe, Zap, History, RefreshCcw, Terminal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const dummyData = [
  { name: '10:00', cpu: 20, tokens: 400 },
  { name: '10:05', cpu: 45, tokens: 1200 },
  { name: '10:10', cpu: 30, tokens: 800 },
  { name: '10:15', cpu: 55, tokens: 2400 },
  { name: '10:20', cpu: 40, tokens: 1600 },
  { name: '10:25', cpu: 65, tokens: 3200 },
];

export function InfrastructureDashboard() {
  return (
    <div className="flex-1 bg-[#0D0D0F] p-8 overflow-y-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Production Infrastructure</h2>
          <p className="text-sm text-white/40">Real-time status of your AI OS Nodes and Deployments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">All Systems Operational</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="CPU Load" value="24%" sub="4 Active Workers" icon={<Cpu size={20} />} trend="+2%" />
        <MetricCard title="Memory" value="1.2 GB" sub="Heap Allocation" icon={<HardDrive size={20} />} trend="Stable" />
        <MetricCard title="Throughput" value="12k" sub="Tokens / Minute" icon={<Zap size={20} />} trend="+15%" />
        <MetricCard title="Security" value="Isolated" sub="gVisor (Simulated)" icon={<Shield size={20} />} trend="Healthy" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-blue-500" />
            Compute Utilization
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white/60 mb-6 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} className="text-purple-500" />
            AI Logic Streaming
          </h3>
          <div className="h-64 flex flex-col gap-2 font-mono text-[10px] text-white/40 overflow-hidden">
             <div className="flex items-center gap-2"><span className="text-green-500">[10:24:55]</span> INF: AgentOrchestrator initializing session...</div>
             <div className="flex items-center gap-2"><span className="text-blue-500">[10:24:56]</span> DBG: PlannerAgent generated 12 file tasks.</div>
             <div className="flex items-center gap-2"><span className="text-purple-500">[10:24:57]</span> TRC: Worker-Node-4 processing apps/api/user.ts</div>
             <div className="flex items-center gap-2"><span className="text-yellow-500">[10:24:58]</span> WRN: Rate limit approaching for Provider[OpenRouter]</div>
             <div className="flex items-center gap-2"><span className="text-blue-500">[10:25:01]</span> DBG: Sandbox execution complete for project:sitegenie</div>
             <div className="animate-pulse">_</div>
          </div>
        </div>
      </div>

      {/* Deployment & Snapshots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} className="text-green-500" />
                  Live Deployments
               </h3>
               <button className="text-[10px] font-bold text-blue-500 hover:underline">Deploy New Version</button>
            </div>
            <div className="space-y-4">
               <DeploymentRow status="LIVE" url="preview-9a2f1b.sitegenie.ai" time="2 mins ago" />
               <DeploymentRow status="STAGED" url="preview-3c4d5e.sitegenie.ai" time="1 hour ago" />
               <DeploymentRow status="FAILED" url="preview-0x1y2z.sitegenie.ai" time="3 hours ago" />
            </div>
         </div>

         <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                  <History size={14} className="text-orange-500" />
                  Redundant Backups
               </h3>
               <button className="text-[10px] font-bold text-blue-500 hover:underline">Manual Snapshot</button>
            </div>
            <div className="space-y-4">
               <SnapshotRow id="snap_20240509_0822" size="4.2MB" status="Encrypted" />
               <SnapshotRow id="snap_20240509_0412" size="4.1MB" status="Cold Storage" />
               <SnapshotRow id="snap_20240508_2355" size="3.9MB" status="Deep Archive" />
            </div>
         </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon, trend }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-3 hover:bg-white/[0.04] transition-all group">
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-white/5 rounded-2xl text-white/40 group-hover:text-blue-500 transition-colors">
          {icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${trend.includes('+') ? 'text-green-500' : 'text-white/20'}`}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{title}</span>
          <span className="text-[9px] text-white/10 uppercase tracking-tighter">{sub}</span>
        </div>
      </div>
    </div>
  );
}

function DeploymentRow({ status, url, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
       <div className="flex items-center gap-4">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : status === 'FAILED' ? 'bg-red-500' : 'bg-white/20'}`} />
          <div>
             <div className="text-xs font-bold text-white/80">{url}</div>
             <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{time}</div>
          </div>
       </div>
       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-3 py-1 bg-white/5 text-[10px] font-bold text-white/60 rounded-full hover:bg-white/10 transition-colors">Logs</button>
          <button className="px-3 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">Visit</button>
       </div>
    </div>
  );
}

function SnapshotRow({ id, size, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
       <div className="flex items-center gap-4">
          <History size={16} className="text-white/20" />
          <div>
             <div className="text-xs font-bold text-white/80">{id}</div>
             <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{size} • {status}</div>
          </div>
       </div>
       <button className="flex items-center gap-2 px-3 py-1 bg-white/5 text-[10px] font-bold text-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500/10 hover:text-orange-500">
          <RefreshCcw size={10} />
          Rollback
       </button>
    </div>
  );
}
