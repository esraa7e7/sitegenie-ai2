import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sitegenie_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data.message || 'An unexpected API error occurred.';

      switch (status) {
        case 400:
          errorMessage = data.message || 'Bad Request';
          break;
        case 401:
          errorMessage = data.message || 'Unauthorized. Please log in.';
          // Optionally redirect to login page
          // window.location.href = 
          break;
        case 403:
          errorMessage = data.message || 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = data.message || 'Resource not found.';
          break;
        case 500:
          errorMessage = data.message || 'Internal Server Error. Please try again later.';
          break;
        default:
          break;
      }
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error('No response from server. Please check your network connection.');
    } else {
      toast.error('Request failed: ' + error.message);
    }
    return Promise.reject(error);
  }
);

export const aiApi = {
  generate: async (projectId: string, prompt: string) => {
    const response = await api.post('/ai/generate', { projectId, prompt });
    return response.data;
  },
  chat: async (prompt: string, context?: string) => {
    const response = await api.post('/ai/chat', { prompt, context });
    return response.data;
  },
  getStatus: async (taskId: string) => {
    const response = await api.get(`/ai/status/${taskId}`);
    return response.data;
  },
  deploy: async (projectId: string, platform: 'vercel' | 'netlify') => {
    const response = await api.post('/ai/deploy', { projectId, platform });
    return response.data;
  }
};

export const projectApi = {
  list: async () => {
    const response = await api.get("/projects");
    return response.data;
  },
  create: async (data: { name: string; description: string; code: string }) => {
    const response = await api.post("/projects", data);
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  update: async (id: string, data: { name: string; code: string }) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export default api;
