import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Menu, X, Github, Twitter, LogOut } from 'lucide-react';
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

type View = 'landing' | 'dashboard' | 'editor'; // This type is no longer strictly needed in App.tsx but kept for consistency if other components rely on it.

interface NavbarProps {
  view?: View; // Make optional as it's not directly used for routing anymore
  setView?: (v: View) => void; // Make optional
}

export const Navbar = ({ view, setView }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { success, error } = await signOut();
    if (success) {
      toast.success("Logged out successfully!");
      navigate("/");
    } else {
      toast.error(error || "Failed to log out.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* الشعار */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SiteGenie AI</span>
          </Link>
          
          {/* روابط سطح المكتب */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              المشاريع
            </Link>
            <a href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">المميزات</a>
            <a href="#pricing" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">الأسعار</a>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">النظام يعمل</span>
          </div>
          
          {!session ? (
            <Link to="/auth" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">
              تسجيل الدخول
            </Link>
          ) : (
            <button 
              onClick={handleSignOut}
              className="text-sm font-medium text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          )}
          
          <Link 
            to={session ? "/dashboard" : "/auth"}
            className="hidden sm:flex bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-neutral-200 transition-all items-center gap-2 shadow-xl shadow-white/5 active:scale-95"
          >
            ابدأ الآن
            <ChevronRight className="w-4 h-4" />
          </Link>
          
          {/* زر القائمة للجوال */}
          <button className="md:hidden p-2 text-neutral-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* القائمة المنبثقة للجوال */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-4">
          <Link 
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-left text-lg font-medium text-white"
          >
            المشاريع
          </Link>
          <a href="#" className="block text-lg font-medium text-neutral-400">المميزات</a>
          <a href="#" className="block text-lg font-medium text-neutral-400">الأسعار</a>
          <hr className="border-white/10" />
          <Link 
            to={session ? "/dashboard" : "/auth"}
            onClick={() => setIsMenuOpen(false)}
            className="block w-full bg-white text-black py-3 rounded-xl font-bold"
          >
            ابدأ الآن
          </Link>
        </div>
      )}
    </nav>
  );
};
