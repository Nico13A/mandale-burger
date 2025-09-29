import api from "./api";

const ENDPOINTS = {
  COCINEROS_ACTIVOS: "/api/cocineros/active/",
  COCINEROS_INACTIVOS: "/api/cocineros/inactive/",
  CREATE_COCINERO: "/api/cocineros/create/",
  UPDATE_COCINERO: (id) => `/api/cocineros/${id}/edit/`,
  DELETE_COCINERO: (id) => `/api/cocineros/${id}/delete/`,
  ACTIVATE_COCINERO: (id) => `/api/cocineros/${id}/activate/`,
};

// ------------------ OBTENER COCINEROS ------------------
export const getCocinerosActivos = async () => {
  try {
    const res = await api.get(ENDPOINTS.COCINEROS_ACTIVOS);
    return res.data;
  } catch (error) {
    const mensaje = error.response?.data?.detail || "No se pudo obtener la lista de cocineros activos.";
    throw new Error(mensaje);
  }
};

export const getCocinerosInactivos = async () => {
  try {
    const res = await api.get(ENDPOINTS.COCINEROS_INACTIVOS);
    return res.data;
  } catch (error) {
    const mensaje = error.response?.data?.detail || "No se pudo obtener la lista de cocineros inactivos.";
    throw new Error(mensaje);
  }
};

// ------------------ CREAR COCINERO ------------------
export const createCocinero = async (cocineroData) => {
  try {
    const res = await api.post(ENDPOINTS.CREATE_COCINERO, cocineroData);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: ["No se pudo crear el cocinero."] };
  }
};

// ------------------ ACTUALIZAR COCINERO ------------------
export const updateCocinero = async (id, cocineroData) => {
  try {
    const res = await api.patch(ENDPOINTS.UPDATE_COCINERO(id), cocineroData);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: ["No se pudo actualizar el cocinero."] };
  }
};

// ------------------ BORRADO LÓGICO ------------------
export const deactivateCocinero = async (id) => {
  try {
    const res = await api.delete(ENDPOINTS.DELETE_COCINERO(id));
    return { success: true, data: res.data };
  } catch (err) {
    return { 
      success: false, 
      error: err.response?.data?.error || "No se pudo dar de baja al cocinero" 
    };
  }
};

// ------------------ DAR DE ALTA ------------------
export const activateCocinero = async (id) => {
  try {
    const res = await api.patch(ENDPOINTS.ACTIVATE_COCINERO(id));
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: ["No se pudo dar de alta al cocinero."] };
  }
};
