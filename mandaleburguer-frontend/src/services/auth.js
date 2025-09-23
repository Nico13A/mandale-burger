/*import api from './api';

export const login = async (username, password) => {
  try {
    const res = await api.post('/api/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'Error en el login';
    throw new Error(mensaje);
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/api/user/');
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'No se pudo obtener el usuario';
    throw new Error(mensaje);
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('No hay refresh token disponible');

  try {
    const res = await api.post('/api/token/refresh/', { refresh });
    localStorage.setItem('access_token', res.data.access);
    return res.data.access;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'No se pudo refrescar la sesión';
    logout();
    throw new Error(mensaje);
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post('/api/register/', userData);
    return res.data;
  } catch (err) {
    if (err.response?.data?.username) {
      throw new Error(err.response.data.username[0]);
    }
    if (err.response?.data?.email) {
      throw new Error(err.response.data.email[0]);
    }
    const mensaje = err.response?.data?.detail || 'Error en el registro';
    throw new Error(mensaje);
  }
};
*/
import api from "./api";

// 🔑 Login usando Djoser JWT
/*
export const login = async (username, password) => {
  try {
    const res = await api.post("/api/auth/jwt/create/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  } catch (err) {
    console.log(err);
    
    let mensaje = err.response?.data?.detail || "Error en el login";
    if (mensaje === "No active account found with the given credentials") {
      mensaje = "No se encontró un usuario con esas credenciales.";
    }
    //const mensaje = err.response?.data?.detail || "Error en el login";
    throw new Error(mensaje);
  }
};
*/


export const login = async (username, password) => {
  try {
    const res = await api.post("/api/auth/jwt/create/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  } catch (err) {
    console.log(err);

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

// 🚪 Logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get('/api/user/');
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || 'No se pudo obtener el usuario';
    throw new Error(mensaje);
  }
};

// 🔄 Refrescar token usando Djoser JWT
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No hay refresh token disponible");

  try {
    const res = await api.post("/api/auth/jwt/refresh/", { refresh });
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  } catch (err) {
    const mensaje =
      err.response?.data?.detail || "No se pudo refrescar la sesión";
    logout();
    throw new Error(mensaje);
  }
};

// 📝 Registro (tu endpoint custom)
/*
export const register = async (userData) => {
  try {
    const res = await api.post("/api/register/", userData);
    return res.data;
  } catch (err) {
    console.log(err);
    
    if (err.response?.data?.username) {
      throw new Error(err.response.data.username[0]);
    }
    if (err.response?.data?.email) {
      throw new Error(err.response.data.email[0]);
    }
    if (err.response?.data?.password) {
  throw new Error(err.response.data.password.join(" | "));
}
    const mensaje = err.response?.data?.detail || "Error en el registro";
    throw new Error(mensaje);
  }
};
*/
export const register = async (userData) => {
  try {
    const res = await api.post("/api/register/", userData);
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data; // devolvemos el objeto con todos los errores
    }
    throw { detail: "Error en el registro" };
  }
};



// 📧 Solicitar reseteo de contraseña (Djoser)
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/api/auth/users/reset_password/", { email });
    return res.data;
  } catch (err) {
    console.log(err);
    const mensaje = err.response?.data?.email || "Error al enviar la solicitud de reseteo.";
    throw new Error(mensaje);
  }
};

// 🔑 Confirmar reseteo de contraseña (Djoser)
/*
export const resetPasswordConfirm = async (uid, token, new_password) => {
  try {
    const res = await api.post(
      "/api/auth/users/reset_password_confirm/",
      { uid, token, new_password }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    
    const mensaje =
      err.response?.data?.detail ||
      "Error al cambiar la contraseña. El enlace es inválido o ha expirado.";
    throw new Error(mensaje);
  }
};
*/

/*
export const resetPasswordConfirm = async (uid, token, new_password) => {
  try {
    const res = await api.post(
      "/api/auth/users/reset_password_confirm/",
      { uid, token, new_password }
    );
    return res.data;
  } catch (err) {
    console.log(err);
    
    let mensaje = "Error al cambiar la contraseña. El enlace es inválido o ha expirado.";
    
    if (err.response?.data?.new_password) {
      // Maneja el array de errores de validación de la contraseña
      // Une los mensajes en una sola cadena
      mensaje = err.response.data.new_password.join(" y ");
    } else if (err.response?.data?.detail) {
      // Maneja errores genéricos como token o uid inválido
      mensaje = err.response.data.detail;
    }

    throw new Error(mensaje);
  }
};
*/


/*
export const resetPasswordConfirm = async (uid, token, new_password) => {
      try {
    const res = await api.post(
      "/api/auth/users/reset_password_confirm/",
      { uid, token, new_password }
    );
    return res.data;
    } catch (err) {
      console.log(err)
      
        // En lugar de una cadena, devolvemos el array de errores
        if (err.response?.data?.new_password) {
            throw err.response.data.new_password;
        } else if (err.response?.data?.detail) {
            throw new Error(err.response.data.detail);
        } else {
            throw new Error("Error al cambiar la contraseña.");
        }
    }
};
*/
export const resetPasswordConfirm = async (uid, token, new_password) => {
  try {
    const res = await api.post("/api/auth/users/reset_password_confirm/", {
      uid,
      token,
      new_password,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    
    if (err.response?.data) {
      throw err.response.data;
    }
    throw { detail: "Error al cambiar la contraseña." };
  }
};