import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,

      setAuth: (user, token) => set({ 
        user, 
        accessToken: token, 
        isAuthenticated: true, 
        isLoading: false 
      }),

      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false, 
        isLoading: false 
      }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'sitegenie-auth',
      partialize: (state) => ({ accessToken: state.accessToken }), // Only persist token
    }
  )
);
