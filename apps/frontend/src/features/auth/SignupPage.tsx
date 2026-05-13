import React, { useState } from 'react';
import { Mail, Lock, Building, User, ArrowRight, Loader2, Globe, Terminal } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { authService } from '../../services/authService';

export function SignupPage({ onSwitch }: { onSwitch: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      tenantName: formData.get('tenantName') as string,
    };

    try {
      await authService.signup(data as any);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Organization" 
      subtitle="Start building your autonomous web presence today"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                <User size={16} />
              </div>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Jane Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Org Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                <Building size={16} />
              </div>
              <input 
                name="tenantName"
                type="text" 
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                placeholder="Acme Inc"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
              <Mail size={16} />
            </div>
            <input 
              name="email"
              type="email" 
              required
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Security Key</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
              <Lock size={16} />
            </div>
            <input 
              name="password"
              type="password" 
              required
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
             <span className="bg-[#111114] px-4 text-white/20 uppercase tracking-widest font-bold">Quick Access</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 hover:bg-white/5 rounded-2xl py-3 text-xs font-bold transition-all active:scale-95 group">
            <Globe size={16} className="text-white/40 group-hover:text-white transition-colors" />
            <span>Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 hover:bg-white/5 rounded-2xl py-3 text-xs font-bold transition-all active:scale-95 group">
            <Terminal size={16} className="text-white/40 group-hover:text-white transition-colors" />
            <span>GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-white/40 pt-2">
          Already have an account? <button type="button" onClick={onSwitch} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign in</button>
        </p>
      </form>
    </AuthLayout>
  );
}
