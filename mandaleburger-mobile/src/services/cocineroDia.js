import { api } from "./api";

const ENDPOINTS = {
    COCINERO_DIA_ACTUAL: "/api/cocinero-dia/actual/",
};

// ------------------ OBTENER COCINERO DEL DÍA ------------------
export const getCocineroDelDiaActual = async () => {
    try {
        const res = await api.get(ENDPOINTS.COCINERO_DIA_ACTUAL);
        return res.data;
    } catch (err) {
        const mensaje =err.response?.data?.detail || "No se pudo obtener el cocinero del día.";
        throw new Error(mensaje);
    }
};