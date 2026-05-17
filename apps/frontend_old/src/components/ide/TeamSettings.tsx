import React from 'react';
import { Users, Mail, Shield, UserPlus, Trash2 } from 'lucide-react';

export function TeamSettings() {
  return (
    <div className="flex-1 bg-[#0A0A0C] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Workspace</h1>
            <p className="text-white/40 text-sm mt-1">Manage collaborators and permissions for this project.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            <UserPlus size={16} />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 px-2">Active Members</h3>
            <div className="space-y-2">
              <MemberItem name="Esra Abbas" email="esra@example.com" role="Owner" avatarColor="bg-blue-500" />
              <MemberItem name="AI Agent" email="agent@sitegenie.ai" role="Admin" avatarColor="bg-purple-500" />
              <MemberItem name="Guest Designer" email="guest@example.com" role="Viewer" avatarColor="bg-emerald-500" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 px-2">Pending Invitations</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-6 text-center">
               <Mail className="mx-auto text-white/10 mb-3" size={32} />
               <p className="text-sm font-medium text-white/40">No pending invitations</p>
               <button className="mt-4 text-xs text-blue-400 font-bold hover:underline">Invite your first teammate</button>
            </div>

            <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 px-2 pt-4">Workspace Settings</h3>
            <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-4 space-y-1">
               <SettingsToggle label="Allow Public Access" description="Anyone with the link can view previews" />
               <SettingsToggle label="Team AI Credits" description="Share monthly token pool among members" checked />
               <SettingsToggle label="Audit Logging" description="Track all file modifications in a timeline" checked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberItem({ name, email, role, avatarColor }: { name: string, email: string, role: string, avatarColor: string }) {
  return (
     <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[24px] flex items-center justify-between hover:border-white/10 transition-all">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-2xl ${avatarColor} flex items-center justify-center font-bold text-white`}>
              {name.slice(0, 1)}
           </div>
           <div>
              <div className="font-bold text-sm">{name}</div>
              <div className="text-[11px] text-white/20">{email}</div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-white/40 border border-white/5">
              {role}
           </span>
           <button className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
              <Trash2 size={14} />
           </button>
        </div>
     </div>
  );
}

function SettingsToggle({ label, description, checked = false }: { label: string, description: string, checked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-all">
       <div>
          <div className="text-sm font-bold">{label}</div>
          <div className="text-[10px] text-white/20">{description}</div>
       </div>
       <div className={`w-10 h-5 rounded-full p-1 transition-all cursor-pointer ${checked ? 'bg-blue-600' : 'bg-white/10'}`}>
          <div className={`w-3 h-3 bg-white rounded-full transition-all ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
       </div>
    </div>
  );
}
