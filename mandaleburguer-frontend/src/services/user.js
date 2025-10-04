import api from "./api";

const ENDPOINTS = {
  USER: "/api/user/",
  PROFILE_UPDATE: "/api/user/profile/",
  PROFILE_IMAGE: "/api/user/profile/image/",
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


// ------------------ ACTUALIZAR INFORMACIÓN DE PERFIL ------------------
export const updateUserProfile = async (data) => {
  try {
    const res = await api.put(ENDPOINTS.PROFILE_UPDATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) {
      throw err.response.data;
    }
    throw { non_field_errors: ["No se pudo actualizar el perfil."] };
  }
};



// ------------------ ACTUALIZAR IMAGEN DE PERFIL ------------------
export const updateProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.put(ENDPOINTS.PROFILE_IMAGE, formData);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo actualizar la imagen de perfil.";
    throw new Error(mensaje);
  }
};

