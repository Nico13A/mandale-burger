import api from "./api";

const ENDPOINTS = {
  USER: "/api/user/",
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

// ------------------ ACTUALIZAR IMAGEN DE PERFIL ------------------
export const updateProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.put(ENDPOINTS.PROFILE_IMAGE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo actualizar la imagen de perfil.";
    throw new Error(mensaje);
  }
};
