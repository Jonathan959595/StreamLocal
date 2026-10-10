import axios from 'axios';
import { content } from '../data/content';

export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://127.0.0.1:5000/api');
export const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true, timeout: 10000 });
api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem('streamlocal-session') || 'null');
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  if (session?.selectedProfileId) config.headers['x-profile-id'] = session.selectedProfileId;
  return config;
});
export const contentService = {
  search: async (query) => {
    try { const response = await api.get('/content/search', { params: { q: query } }); return response.data.map((item) => ({ ...item, id: item.contentId, type: item.contentType === 'series' ? 'Series' : 'Movie', image: item.posterPath, genre: item.tags?.[0] || 'Featured', year: item.tags?.find((tag) => /^\d{4}$/.test(tag)) || '—', duration: item.tags?.find((tag) => /h|Season|Part/.test(tag)) || '—', rating: item.tags?.find((tag) => /^\d\.\d$/.test(tag)) || '—' })); } catch { return content.filter((item) => `${item.title} ${item.genre} ${item.type}`.toLowerCase().includes(query.toLowerCase())); }
  },
  getFeed: async () => content,
  getById: async (id) => content.find((item) => item.id === id),
};

// These service boundaries intentionally do not simulate a backend response. They
// are the single place to connect the Express API when it becomes available.
export const authService = {
  register: ({ email, password }) => api.post('/auth/register', { email: String(email || '').trim().toLowerCase(), password }),
  login: ({ email, password }) => api.post('/auth/login', { email: String(email || '').trim().toLowerCase(), password }),
  me: (token) => api.get('/auth/me', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined),
  logout: () => api.post('/auth/logout'),
  createProfile: (payload) => api.post('/auth/profiles', payload),
};

export const subscriptionService = {
  checkout: (payload) => api.post('/billing/checkout', payload),
};

export const streamService = { createSession: (contentId) => api.post(`/stream/session/${contentId}`), heartbeat: (videoId, timestampSeconds) => api.post('/stream/heartbeat', { videoId, timestampSeconds }), progress: (contentId) => api.get(`/stream/progress/${contentId}`) };
