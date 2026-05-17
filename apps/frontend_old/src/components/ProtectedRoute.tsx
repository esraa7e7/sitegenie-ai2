import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

type AuthView = 'login' | 'signup' | 'forgot-password';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, setLoading, setAuth, accessToken } = useAuthStore();
  const [view, setView] = useState<AuthView>('login');

  useEffect(() => {
    const verifySession = async () => {
      if (accessToken) {
        setLoading(true);
        try {
          // In production, we'd verify the token with the server
          const isValid = await authService.verifyToken(accessToken);
          if (!isValid) {
            useAuthStore.getState().logout();
          }
        } catch (e) {
          useAuthStore.getState().logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    verifySession();
  }, [accessToken, setLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0A0A0C] flex items-center justify-center">
        <div className="relative">
          <Loader2 className="text-blue-500 animate-spin" size={60} />
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    switch (view) {
      case 'signup':
        return <SignupPage onSwitch={() => setView('login')} />;
      case 'forgot-password':
        return <ForgotPasswordPage onBack={() => setView('login')} />;
      default:
        return (
          <LoginPage 
            onSwitchSignup={() => setView('signup')} 
            onSwitchForgot={() => setView('forgot-password')} 
          />
        );
    }
  }

  return <>{children}</>;
}
