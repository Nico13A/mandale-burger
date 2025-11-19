import { api } from "./api";

const ENDPOINTS = {
    SUBSCRIPTION_PLANS_LIST: "/api/subscription/plans/",
    USER_SUBSCRIPTION_ACTIVE: "/api/subscription/user/active/",
};

// ------------------ LISTAR PLANES ------------------
export const getSubscriptionPlans = async () => {
    try {
        const res = await api.get(ENDPOINTS.SUBSCRIPTION_PLANS_LIST);
        return res.data;
    } catch (err) {
        const mensaje =
            err.response?.data?.detail ||
            "No se pudo obtener los planes de suscripción.";
        throw new Error(mensaje);
    }
};

// ------------------ OBTENER SUSCRIPCIÓN ACTIVA DEL USUARIO ------------------
export const getActiveUserSubscription = async () => {
    try {
        const res = await api.get(ENDPOINTS.USER_SUBSCRIPTION_ACTIVE);
        return res.data;
    } catch (err) {
        const mensaje =
            err.response?.data?.detail ||
            "No se pudo obtener la suscripción activa.";
        throw new Error(mensaje);
    }
};
