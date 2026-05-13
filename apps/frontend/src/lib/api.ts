import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sitegenie_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const response = await api.get('/projects');
    return response.data;
  },
  create: async (data: { name: string; description: string }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }
};

export default api;
