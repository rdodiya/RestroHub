import axios from 'axios';
import { clearAuthSession, getAccessToken } from './authStorage';
import { spamHeaders } from '../../utils/spamState';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8181/restroly',
});

// Add interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    // Add token only for secure APIs
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    if (config.method === 'post' && config.url?.includes('/public/api/v1/auth/')) {
      Object.assign(
        config.headers,
        spamHeaders(import.meta.env.VITE_SPAM_PROTECTION_MODE || 'honeypot')
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (!error.config?.url?.includes('/public/')) {
        clearAuthSession();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
