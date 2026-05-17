import React from 'react';
import { Sparkles, Globe, Share2 } from 'lucide-react';

const Github = Globe; 
const Twitter = Share2;

export const Footer = () => (
  <footer className="border-t border-white/5 bg-black py-20">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">SiteGenie AI</span>
        </div>
        <p className="text-neutral-500 max-w-sm mb-8 font-medium">
          The next generation of web design. Deploy professional, production-ready websites in seconds with our multi-agent AI system.
        </p>
        <div className="flex gap-4">
          <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          <a href="#" className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white transition-colors"><Github size={20} /></a>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-6 text-white text-lg tracking-tight">Product</h4>
        <ul className="space-y-4 text-sm text-neutral-500 font-medium">
          <li><a href="#" className="hover:text-white transition-colors">AI Generator</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Design Tools</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Code Editor</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Deployment</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 text-white text-lg tracking-tight">Company</h4>
        <ul className="space-y-4 text-sm text-neutral-500 font-medium">
          <li><a href="#" className="hover:text-white transition-colors">About</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-neutral-600 text-sm">© 2024 SiteGenie AI. All rights reserved.</p>
      <div className="flex gap-8 text-neutral-600 text-sm">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);
