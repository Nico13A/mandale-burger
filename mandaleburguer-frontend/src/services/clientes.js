import api from "./api";

const ENDPOINTS = {
  CLIENTES: "/api/clientes/",
};

// Listar activos
export const getClientesActivos = async () => {
  try {
    const res = await api.get(`${ENDPOINTS.CLIENTES}?activos=true`);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo obtener los clientes activos.";
    throw new Error(mensaje);
  }
};

// Listar inactivos
export const getClientesInactivos = async () => {
  try {
    const res = await api.get(`${ENDPOINTS.CLIENTES}?activos=false`);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo obtener los clientes inactivos.";
    throw new Error(mensaje);
  }
};

// Activar cliente
export const activarCliente = async (id) => {
  try {
    const res = await api.patch(`${ENDPOINTS.CLIENTES}${id}/activate/`);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo activar el cliente.";
    throw new Error(mensaje);
  }
};

// Dar de baja cliente
export const bajaCliente = async (id) => {
  try {
    const res = await api.delete(`${ENDPOINTS.CLIENTES}${id}/delete/`);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo dar de baja al cliente.";
    throw new Error(mensaje);
  }
};

// Editar cliente
export const editarCliente = async (id, datos) => {
  try {
    const res = await api.put(`${ENDPOINTS.CLIENTES}${id}/edit/`, datos);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.error || "No se pudo editar el cliente.";
    throw new Error(mensaje);
  }
};
