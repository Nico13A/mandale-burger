import api from "./api";

const ENDPOINTS = {
  LIST: "/api/orders/",           
  DETAIL: (id) => `/api/orders/${id}/`,
  ADVANCE_STATUS: (id) => `/api/orders/${id}/advance_status/`, 
  LIST_COCINA: "/api/orders/cocina/",
};

// ------------------ OBTENER TODAS LAS ÓRDENES ------------------
export const getOrders = async () => {
  try {
    const res = await api.get(ENDPOINTS.LIST);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "No se pudieron obtener las órdenes."
    );
  }
};

// ------------------ OBTENER DETALLE DE UNA ORDEN ------------------
export const getOrderDetail = async (orderId) => {
  try {
    const res = await api.get(ENDPOINTS.DETAIL(orderId));
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "No se pudo obtener el detalle de la orden."
    );
  }
};

// ------------------ AVANZAR ESTADO DE UNA ORDEN ------------------
export const advanceOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api.post(ENDPOINTS.ADVANCE_STATUS(orderId), { new_status: newStatus });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "No se pudo actualizar el estado."
    );
  }
};

// ------------------ OBTENER ÓRDENES PARA COCINA ------------------
export const getCocinaOrders = async () => {
  try {
    const res = await api.get(ENDPOINTS.LIST_COCINA);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "No se pudieron obtener las órdenes de cocina."
    );
  }
};