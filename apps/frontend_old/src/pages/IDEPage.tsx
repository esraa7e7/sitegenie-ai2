import React from 'react';
import { WorkspaceIDE } from '../components/ide/WorkspaceIDE';

export default function IDEPage() {
  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <aside className="w-72 border-r border-white/10 bg-slate-900">
        Sidebar
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="h-14 border-b border-white/10">
          Toolbar
        </div>

        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          <div className="border-r border-white/10 overflow-auto">
            Editor
          </div>

          <div className="overflow-auto bg-white">
            Preview
          </div>
        </div>
      </main>
    </div>
  );
}