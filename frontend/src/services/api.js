import axios from 'axios';
import { content } from '../data/content';

export const api = axios.create({ baseURL: 'http://localhost:5000/api' });
export const contentService = {
  // Replace these local results with API calls once the Express backend is available.
  search: async (query) => content.filter((item) => `${item.title} ${item.genre} ${item.type}`.toLowerCase().includes(query.toLowerCase())),
  getFeed: async () => content,
};
