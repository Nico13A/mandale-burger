import api from "./api";

const ENDPOINTS = {
  SUBSCRIPTION_PLANS_LIST: "/api/subscription/plans/",
  SUBSCRIPTION_PLAN_CREATE: "/api/subscription/plans/create/",
  SUBSCRIPTION_PLAN_EDIT: (id) => `/api/subscription/plans/${id}/edit/`,
  SUBSCRIPTION_PLAN_ACTIVATE: (id) => `/api/subscription/plans/${id}/activate/`,
  SUBSCRIPTION_PLAN_DEACTIVATE: (id) => `/api/subscription/plans/${id}/deactivate/`,
  USER_SUBSCRIPTION_ACTIVE: "/api/subscription/user/active/",
};

// ------------------ LISTAR PLANES ------------------
export const getSubscriptionPlans = async () => {
  try {
    const res = await api.get(ENDPOINTS.SUBSCRIPTION_PLANS_LIST);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener los planes de suscripción.";
    throw new Error(mensaje);
  }
};

// ------------------ CREAR PLAN DE SUSCRIPCIÓN (ADMIN) ------------------
export const createSubscriptionPlan = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.SUBSCRIPTION_PLAN_CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear el plan de suscripción."] };
  }
};

// ------------------ EDITAR PLAN DE SUSCRIPCIÓN (ADMIN) ------------------
export const updateSubscriptionPlan = async (planId, data) => {
  try {
    const res = await api.put(ENDPOINTS.SUBSCRIPTION_PLAN_EDIT(planId), data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo actualizar el plan de suscripción."] };
  }
};

// ------------------ ACTIVAR PLAN DE SUSCRIPCIÓN (ADMIN) ------------------
export const activateSubscriptionPlan = async (planId) => {
  try {
    const res = await api.patch(ENDPOINTS.SUBSCRIPTION_PLAN_ACTIVATE(planId));
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo activar el plan de suscripción."] };
  }
};

// ------------------ DAR DE BAJA PLAN DE SUSCRIPCIÓN (ADMIN) ------------------
export const deactivateSubscriptionPlan = async (planId) => {
  try {
    const res = await api.patch(ENDPOINTS.SUBSCRIPTION_PLAN_DEACTIVATE(planId));
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo dar de baja el plan de suscripción."] };
  }
};

// ------------------ OBTENER SUSCRIPCIÓN ACTIVA DEL USUARIO ------------------
export const getActiveUserSubscription = async () => {
  try {
    const res = await api.get(ENDPOINTS.USER_SUBSCRIPTION_ACTIVE);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener la suscripción activa.";
    throw new Error(mensaje);
  }
};

