import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export const authService = {
  login: async (data: any) => {
    try {
      const response = await api.post('/auth/login', data);
      const { user, token } = response.data.data;
      useAuthStore.getState().setAuth(user, token);
      localStorage.setItem('sitegenie_auth_token', token);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid email or password');
    }
  },

  signup: async (data: any) => {
    try {
      const response = await api.post('/auth/signup', data);
      const { user, token } = response.data.data;
      useAuthStore.getState().setAuth(user, token);
      localStorage.setItem('sitegenie_auth_token', token);
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  },

  forgotPassword: async (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  verifyToken: async (token: string) => {
    try {
      const response = await api.get('/auth/verify');
      return response.data.status === 'success';
    } catch (e) {
      return false;
    }
  }
};
