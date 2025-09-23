import api from "./api";

const ENDPOINTS = {
  LOGIN: "/api/auth/jwt/create/",
  REFRESH: "/api/auth/jwt/refresh/",
  REGISTER: "/api/register/",
  USER: "/api/user/",
  RESET_PASSWORD: "/api/auth/users/reset_password/",
  RESET_PASSWORD_CONFIRM: "/api/auth/users/reset_password_confirm/",
};

// ------------------ LOGIN ------------------
export const login = async (username, password) => {
  try {
    const res = await api.post(ENDPOINTS.LOGIN, { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
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

// ------------------ LOGOUT ------------------
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// ------------------ CURRENT USER ------------------
export const getCurrentUser = async () => {
  try {
    const res = await api.get(ENDPOINTS.USER);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener el usuario";
    throw new Error(mensaje);
  }
};

// ------------------ REFRESH TOKEN ------------------
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No hay refresh token disponible");

  try {
    const res = await api.post(ENDPOINTS.REFRESH, { refresh });
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  } catch (err) {
    logout();
    const mensaje = err.response?.data?.detail || "No se pudo refrescar la sesión";
    throw new Error(mensaje);
  }
};

// ------------------ REGISTER ------------------
export const register = async (userData) => {
  try {
    const res = await api.post(ENDPOINTS.REGISTER, userData);
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw { detail: ["Error en el registro"] };
  }
};

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = async (email) => {
  try {
    const res = await api.post(ENDPOINTS.RESET_PASSWORD, { email });
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.email || "Error al enviar la solicitud de reseteo.";
    throw new Error(mensaje);
  }
};

// ------------------ RESET PASSWORD CONFIRM ------------------
export const resetPasswordConfirm = async (uid, token, new_password) => {
  try {
    const res = await api.post(ENDPOINTS.RESET_PASSWORD_CONFIRM, { uid, token, new_password });
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw { detail: ["Error al cambiar la contraseña."] };
  }
};
