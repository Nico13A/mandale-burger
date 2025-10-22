import api from "./api";

const ENDPOINTS = {
  INGREDIENTS_LIST: "/api/ingredients/",
};

// ------------------ LISTAR INGREDIENTES ------------------
export const getIngredients = async (filters = {}) => {
  try {
    const res = await api.get(ENDPOINTS.INGREDIENTS_LIST, { params: filters });
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudieron obtener los ingredientes.";
    throw new Error(mensaje);
  }
};
