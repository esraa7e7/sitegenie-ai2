import React, { useState } from 'react';
import { Mail, Lock, Globe, Terminal, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onSwitchSignup: () => void;
  onSwitchForgot: () => void;
}

export function LoginPage({ onSwitchSignup, onSwitchForgot }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await authService.login({ email, password });
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your workspace"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-shake">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                placeholder="admin@sitegenie.ai"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Password</label>
              <button 
                type="button"
                onClick={onSwitchForgot} 
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-widest"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#111114] px-4 text-white/20 uppercase tracking-widest font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 hover:bg-white/5 rounded-2xl py-3 text-xs font-bold transition-all active:scale-95 group">
            <Globe size={18} className="text-white/40 group-hover:text-[#4285F4] transition-colors" />
            <span>Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 hover:bg-white/5 rounded-2xl py-3 text-xs font-bold transition-all active:scale-95 group">
            <Terminal size={18} className="text-white/40 group-hover:text-white transition-colors" />
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-white/40">
          New to SiteGenie? <button type="button" onClick={onSwitchSignup} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Create account</button>
        </p>
      </form>
    </AuthLayout>
  );
}
