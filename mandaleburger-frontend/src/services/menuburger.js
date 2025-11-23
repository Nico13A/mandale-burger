import api from "./api";

const ENDPOINTS = {
    BURGERS_LIST: "/api/burgers/",
    BURGER_DETAIL: (id) => `/api/burgers/${id}/`,
    BURGERS_ALL: "/api/burgers/all/",
};

// ------------------ LISTAR BURGERS ------------------
export const getMenuBurgers = async (params = {}) => {
    try {
        const res = await api.get(ENDPOINTS.BURGERS_LIST, { params });
        return res.data; 
    } catch (err) {
        const mensaje = err.response?.data?.detail || "No se pudieron obtener las burgers.";
        throw new Error(mensaje);
    }
};

// ------------------ LISTAR TODAS LAS BURGERS (SIN PAGINAR) ------------------
export const getAllMenuBurgers = async () => {
    try {
        const res = await api.get(ENDPOINTS.BURGERS_ALL);
        return res.data; 
    } catch (err) {
        const mensaje = err.response?.data?.detail || "No se pudieron obtener todas las burgers.";
        throw new Error(mensaje);
    }
};

// ------------------ OBTENER UNA BURGER POR ID ------------------
export const getMenuBurgerById = async (id) => {
    try {
        const res = await api.get(ENDPOINTS.BURGER_DETAIL(id));
        return res.data;
    } catch (err) {
        const mensaje = err.response?.data?.detail || "No se pudo obtener la burger.";
        throw new Error(mensaje);
    }
};
