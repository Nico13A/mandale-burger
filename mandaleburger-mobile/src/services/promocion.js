import { api } from "./api";

const ENDPOINTS = {
  PROMOTIONS_LIST: "/api/promotions/",
  PROMOTION_DETAIL: (id) => `/api/promotions/${id}/`,
};

// ------------------ LISTAR PROMOCIONES ------------------
export const getPromotions = async () => {
  try {
    const res = await api.get(ENDPOINTS.PROMOTIONS_LIST);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudieron obtener las promociones.";
    throw new Error(mensaje);
  }
};

// ------------------ OBTENER PROMOCIÓN POR ID ------------------
export const getPromotionById = async (promoId) => {
  try {
    const res = await api.get(ENDPOINTS.PROMOTION_DETAIL(promoId));
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener la promoción.";
    throw new Error(mensaje);
  }
};