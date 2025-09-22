/*import axios from "axios";

const API_URL = "http://localhost:8000";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; 
    const isAuthRequest = originalRequest.url.includes("/api/token/");
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No hay refresh token disponible");
        const res = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh,
        });
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Error refrescando el token:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
*/
import axios from "axios";

const API_URL = "http://localhost:8000";
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refrescar token automáticamente si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; 
    const isAuthRequest = originalRequest.url.includes("/api/auth/jwt/");
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No hay refresh token disponible");
        
        // 🚨 Cambiado para Djoser
        const res = await axios.post(`${API_URL}/api/auth/jwt/refresh/`, { refresh });
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Error refrescando el token:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
