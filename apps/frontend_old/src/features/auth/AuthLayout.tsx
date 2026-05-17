import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-float">
            <Sparkles size={32} className="text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="text-white/50 text-sm">{subtitle}</p>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {children}
          </div>
        </div>

        <p className="text-center text-xs text-white/20">
          By continuing, you agree to SiteGenie AI's <a href="#" className="hover:text-white/40 underline underline-offset-4">Terms of Service</a> and <a href="#" className="hover:text-white/40 underline underline-offset-4">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
