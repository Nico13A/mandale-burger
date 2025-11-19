import { api } from "./api";

const ENDPOINTS = {
    LIST: "/api/orders/",
};

// ------------------ OBTENER TODAS LAS ÓRDENES ------------------
export const getOrdenes = async () => {
    try {
        const res = await api.get(ENDPOINTS.LIST);
        return res.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail || "No se pudieron obtener las órdenes."
        );
    }
};

