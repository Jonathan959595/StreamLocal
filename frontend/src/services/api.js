import axios from 'axios';
import { content } from '../data/content';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
export const contentService = {
  // Replace these local results with API calls once the Express backend is available.
  search: async (query) => content.filter((item) => `${item.title} ${item.genre} ${item.type}`.toLowerCase().includes(query.toLowerCase())),
  getFeed: async () => content,
  getById: async (id) => content.find((item) => item.id === id),
};

// These service boundaries intentionally do not simulate a backend response. They
// are the single place to connect the Express API when it becomes available.
export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const subscriptionService = {
  checkout: (payload) => api.post('/subscription/checkout', payload),
};
