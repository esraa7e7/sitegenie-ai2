import React from 'react';
import { useCollaborationStore } from '../../store/collaborationStore';

export function CollaborativeCursors() {
  const collaborators = useCollaborationStore(state => state.collaborators);

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
      {collaborators.map((c) => (
        c.cursor && (
          <div 
            key={c.socketId}
            className="absolute transition-all duration-75 flex flex-col items-start"
            style={{ 
              left: `${c.cursor.x}%`, 
              top: `${c.cursor.y}%`,
              transform: 'translate(-2px, -2px)'
            }}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 18 18" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path 
                d="M4.66667 1.33334L15.3333 12L10.2917 12.3333L13.3333 15.3333L11.3333 17.3333L8.29167 14.3333L3.33334 16.6667L4.66667 1.33334Z" 
                fill={getUserColor(c.userId)} 
                stroke="white" 
                strokeWidth="1"
              />
            </svg>
            <div 
               className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap shadow-xl"
               style={{ backgroundColor: getUserColor(c.userId) }}
            >
               {c.userName}
            </div>
          </div>
        )
      ))}
    </div>
  );
}

function getUserColor(userId: string) {
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}
