import axios from "axios";
import { clearAuthSession, getAccessToken } from "./authStorage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8181/restroly",
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
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 2026-11-08 - issue: 403 redirects to login - reason: only 401 unauthenticated should clear session and redirect to login, 403 is access-denied
    if (error.response?.status === 401) {
      if (!error.config?.url?.includes("/public/")) {
        clearAuthSession();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
