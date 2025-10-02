import api from "./api";

const ENDPOINTS = {
  CLIENTES: "/api/clientes/",
};


// Clientes activos
export const getClientesActivos = async () => {
  try {
    const url = `${ENDPOINTS.CLIENTES}?activos=true`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener los clientes activos.";
    throw new Error(mensaje);
  }
};


// Clientes inactivos
export const getClientesInactivos = async () => {
  try {
    const res = await api.get(`${ENDPOINTS.CLIENTES}?activos=false`);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo obtener los clientes inactivos.";
    throw new Error(mensaje);
  }
};