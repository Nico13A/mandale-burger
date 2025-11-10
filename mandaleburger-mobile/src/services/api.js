import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

// Función interna para limpiar tokens
const clearTokens = async () => {
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("refresh_token");
};

// Agregar token a cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejar refresco automático de token
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
      const refresh = await AsyncStorage.getItem("refresh_token");
      if (!refresh) {
        await clearTokens();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}/api/auth/jwt/refresh/`, {
          refresh,
        });
        await AsyncStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Error refrescando token:", err);
        await clearTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export { api, clearTokens };

