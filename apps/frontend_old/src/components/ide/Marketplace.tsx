import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Star, Download, ShieldCheck, Cpu, Layout, Puzzle } from 'lucide-react';

export function Marketplace() {
  const [filter, setFilter] = useState<'all' | 'plugin' | 'template' | 'component'>('all');
  
  const items = [
    { id: 1, type: 'plugin', name: 'Database Visualizer', creator: 'Prisma Labs', rating: 4.8, installs: '12k', icon: <Cpu className="text-purple-500" />, price: 'Free' },
    { id: 2, type: 'template', name: 'SaaS Dashboard Pro', creator: 'SiteGenie Team', rating: 4.9, installs: '45k', icon: <Layout className="text-blue-500" />, price: 'Free' },
    { id: 3, type: 'plugin', name: 'Vercel One-Click', creator: 'Deployment Hero', rating: 4.7, installs: '8k', icon: <Puzzle className="text-emerald-500" />, price: 'Free' },
    { id: 4, type: 'component', name: 'Bento Grid System', creator: 'Design Master', rating: 5.0, installs: '22k', icon: <Layout className="text-pink-500" />, price: 'Free' },
    { id: 5, type: 'plugin', name: 'AI Code Auditor', creator: 'Security First', rating: 4.6, installs: '5k', icon: <ShieldCheck className="text-blue-500" />, price: 'Free' },
    { id: 6, type: 'template', name: 'E-commerce Engine', creator: 'Shopify Expert', rating: 4.9, installs: '18k', icon: <ShoppingBag className="text-orange-500" />, price: 'Free' },
  ];

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter);

  return (
    <div className="flex-1 bg-[#0A0A0C] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <ShoppingBag className="text-blue-500" />
              SiteGenie Marketplace
            </h1>
            <p className="text-white/40 text-sm mt-1">Supercharge your workspace with premium extensions and templates.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  placeholder="Search marketplace..." 
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
             </div>
             <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                <Filter size={14} />
                Filters
             </button>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/5">
           <TabButton label="All Items" active={filter === 'all'} onClick={() => setFilter('all')} />
           <TabButton label="Plugins" active={filter === 'plugin'} onClick={() => setFilter('plugin')} />
           <TabButton label="Templates" active={filter === 'template'} onClick={() => setFilter('template')} />
           <TabButton label="Components" active={filter === 'component'} onClick={() => setFilter('component')} />
        </div>

        <div className="grid grid-cols-3 gap-6">
           {filteredItems.map(item => (
             <MarketplaceCard key={item.id} item={item} />
           ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white'}`}
    >
      {label}
    </button>
  );
}

function MarketplaceCard({ item }: { item: any }) {
  return (
    <div className="group bg-white/[0.02] border border-white/5 hover:border-blue-500/20 p-6 rounded-[24px] transition-all hover:-translate-y-1 hover:bg-white/[0.04]">
       <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
             {item.icon}
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.price}</span>
             <div className="flex items-center gap-1 mt-2 text-yellow-500">
               <Star size={10} fill="currentColor" />
               <span className="text-[10px] font-bold">{item.rating}</span>
             </div>
          </div>
       </div>

       <div>
          <h3 className="font-bold text-lg mb-1">{item.name}</h3>
          <p className="text-[11px] text-white/20 font-medium">by <span className="text-white/40">{item.creator}</span></p>
       </div>

       <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/40 font-bold text-[10px] uppercase tracking-widest">
             <Download size={14} />
             {item.installs} installs
          </div>
          <button className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/10 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
             Install
          </button>
       </div>
    </div>
  );
}
