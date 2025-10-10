import axios from "axios";
import { logout } from "./auth"; 

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

// Agregar token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar refresco automático de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest.url.includes("/api/auth/jwt/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}/api/auth/jwt/refresh/`, { refresh });
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Error refrescando token:", err);
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

