import React from 'react';
import { useCollaborationStore } from '../../store/collaborationStore';

export function PresenceAvatars() {
  const collaborators = useCollaborationStore(state => state.collaborators);

  return (
    <div className="flex -space-x-2 overflow-hidden items-center px-4">
      {collaborators.map((c) => (
        <div 
          key={c.socketId}
          className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0D0D0F] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white relative group transition-all hover:scale-110"
          title={c.userName}
        >
          {c.userName.slice(0, 1)}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[9px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
             {c.userName}
          </div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#0D0D0F]" />
        </div>
      ))}
      {collaborators.length === 0 && (
        <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-2">
           Solo Session
        </div>
      )}
    </div>
  );
}
