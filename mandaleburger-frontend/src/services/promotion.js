import api from "./api";

const ENDPOINTS = {
  PROMOTIONS_LIST: "/api/promotions/",
  PROMOTION_CREATE: "/api/promotions/create/",
  PROMOTION_DETAIL: (id) => `/api/promotions/${id}/`,
  PROMOTION_EDIT: (id) => `/api/promotions/${id}/update/`,
  PROMOTION_ACTIVATE: (id) => `/api/promotions/${id}/activate/`,
  PROMOTION_DEACTIVATE: (id) => `/api/promotions/${id}/deactivate/`,
  PROMOTION_SUBSCRIPTION_CREATE: "/api/promotions/subscription/create/",
  PROMOTION_PLAN_UPDATE: "api/promotions/plan/update/",
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

// ------------------ CREAR PROMOCIÓN (ADMIN) ------------------
export const createPromotion = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.PROMOTION_CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear la promoción."] };
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

// ------------------ EDITAR PROMOCIÓN (ADMIN) ------------------
export const updatePromotion = async (promoId, data) => {
  try {
    const res = await api.patch(ENDPOINTS.PROMOTION_EDIT(promoId), data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo actualizar la promoción."] };
  }
};

// ------------------ ACTIVAR PROMOCIÓN (ADMIN) ------------------
export const activatePromotion = async (promoId) => {
  try {
    const res = await api.patch(ENDPOINTS.PROMOTION_ACTIVATE(promoId));
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo activar la promoción."] };
  }
};

// ------------------ DAR DE BAJA PROMOCIÓN (ADMIN) ------------------
export const deactivatePromotion = async (promoId) => {
  try {
    const res = await api.patch(ENDPOINTS.PROMOTION_DEACTIVATE(promoId));
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo dar de baja la promoción."] };
  }
};

// ------------------ ASOCIAR PROMOCIÓN A PLAN (ADMIN) ------------------
export const associatePromotionToPlan = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.PROMOTION_SUBSCRIPTION_CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo asociar la promoción al plan."] };
  }
};

// ------------------ EDITAR PLAN DE PROMOCIÓN (ADMIN) ------------------
export const updatePromotionPlan = async (data) => {
  try {
    const res = await api.patch(ENDPOINTS.PROMOTION_PLAN_UPDATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo actualizar el plan de la promoción."] };
  }
};