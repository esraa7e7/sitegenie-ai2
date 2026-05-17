import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { authService } from '../../services/authService';

export function ForgotPasswordPage({ onBack }: { onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const email = (e.currentTarget as any).email.value;
    await authService.forgotPassword(email);
    setIsSent(true);
    setIsLoading(false);
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle={isSent ? "Check your inbox for a secure link" : "Enter your email to receive recovery instructions"}
    >
      {isSent ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <Send size={24} />
          </div>
          <button 
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 font-bold flex items-center justify-center gap-2 w-full transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span>Send Reset Link</span>}
          </button>

          <button 
            type="button"
            onClick={onBack}
            className="text-white/40 hover:text-white font-bold flex items-center justify-center gap-2 w-full transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
