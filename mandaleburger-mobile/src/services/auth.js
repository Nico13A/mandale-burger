import { api, clearTokens } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENDPOINTS = {
  LOGIN: "/api/auth/jwt/create/",
  REFRESH: "/api/auth/jwt/refresh/",
  REGISTER: "/api/register/",
  RESET_PASSWORD: "/api/auth/users/reset_password/",
  RESET_PASSWORD_CONFIRM: "/api/auth/users/reset_password_confirm/",
};

// LOGIN
export const login = async (username, password) => {
  try {
    const res = await api.post(ENDPOINTS.LOGIN, { username, password });
    await AsyncStorage.setItem("access_token", res.data.access);
    await AsyncStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  } catch (err) {
    let mensaje = err.response?.data?.detail || "Error en el login";
    switch (mensaje) {
      case "No active account found with the given credentials":
        mensaje = "No se encontró un usuario con esas credenciales.";
        break;
      case "User account is disabled.":
        mensaje = "La cuenta está deshabilitada.";
        break;
      case "Unable to log in with provided credentials.":
        mensaje = "Usuario o contraseña incorrecta.";
        break;
      default:
        mensaje = "Error en el login";
    }
    throw new Error(mensaje);
  }
};

// LOGOUT
export const logout = async () => {
  await clearTokens();
};

// REGISTER
export const register = async (userData) => {
  try {
    const res = await api.post(ENDPOINTS.REGISTER, userData);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: ["Error en el registro"] };
  }
};

// RESET PASSWORD
export const forgotPassword = async (email) => {
  try {
    const res = await api.post(ENDPOINTS.RESET_PASSWORD, { email });
    return res.data;
  } catch (err) {
    let mensaje;
    if (Array.isArray(err.response?.data)) {
      mensaje = err.response.data[0];
    } else if (err.response?.data?.email?.[0]) {
      mensaje = err.response.data.email[0];
    } else {
      mensaje = "Error al enviar la solicitud de reseteo.";
    }
    throw new Error(mensaje);
  }
};

