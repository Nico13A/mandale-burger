import api from "./api";

const ENDPOINTS = {
  CATEGORIES_LIST: "/api/categories/",
};

// ------------------ LISTAR CATEGORIAS ------------------
export const getCategories = async () => {
  try {
    const res = await api.get(ENDPOINTS.CATEGORIES_LIST);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudieron obtener las categorías.";
    throw new Error(mensaje);
  }
};
