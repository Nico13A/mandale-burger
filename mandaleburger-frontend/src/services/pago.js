import api from "./api";

const ENDPOINTS = {
  CREAR_PREFERENCIA_SUSCRIPCION: "/api/pago/crear-preferencia/",
  CREAR_PREFERENCIA_ORDEN: "/api/pago/crear-preferencia-pedido/",
};

// Crear preferencia de pago para suscripción
export const crearPreferenciaPago = async (planId) => {
  try {
    const res = await api.post(ENDPOINTS.CREAR_PREFERENCIA_SUSCRIPCION, { plan_id: planId });
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo generar la preferencia de pago.";
    throw new Error(mensaje);
  }
};

// Crear preferencia de pago para una orden
export const crearPreferenciaPagoOrden = async (orderId) => {
  try {
    const res = await api.post(ENDPOINTS.CREAR_PREFERENCIA_ORDEN, { order_id: orderId });
    return res.data; 
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo generar la preferencia de pago para la orden.";
    throw new Error(mensaje);
  }
};


