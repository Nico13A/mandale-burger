import api from "./api";

const ENDPOINTS = {
  COCINERO_DIA_ACTUAL: "/api/cocinero-dia/actual/",
  CREATE_COCINERO_DIA: "/api/cocinero-dia/create/",
};

// ------------------ OBTENER COCINERO DEL DÍA ------------------
export const getCocineroDelDiaActual = async () => {
  try {
    const res = await api.get(ENDPOINTS.COCINERO_DIA_ACTUAL);
    return res.data;
  } catch (error) {
    const mensaje = error.response?.data?.detail || "No se pudo obtener el cocinero del día.";
    throw new Error(mensaje);
  }
};

// ------------------ CREAR / REEMPLAZAR COCINERO DEL DÍA ------------------
export const createCocineroDelDia = async (cocineroData) => {
  try {
    const res = await api.post(ENDPOINTS.CREATE_COCINERO_DIA, cocineroData);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { detail: ["No se pudo asignar el cocinero del día."] };
  }
};
