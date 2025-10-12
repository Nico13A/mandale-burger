import api from "./api";

const ENDPOINTS = {
  CREAR_PREFERENCIA: "/api/pago/crear-preferencia/",
};

export const crearPreferenciaPago = async (planId) => {
  try {
    const res = await api.post(ENDPOINTS.CREAR_PREFERENCIA, { plan_id: planId });
    return res.data; 
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo generar la preferencia de pago.";
    throw new Error(mensaje);
  }
};

