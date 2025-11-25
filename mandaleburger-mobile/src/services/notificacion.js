import { api } from "./api";

const ENDPOINTS = {
    GET_NOTIFICATIONS: "/api/notifications/",
    MARK_AS_READ: (id) => `/api/notifications/${id}/mark_as_read/`,
};

// ------------------ OBTENER NOTIFICACIONES ------------------
export const getNotifications = async () => {
    try {
        const res = await api.get(ENDPOINTS.GET_NOTIFICATIONS);
        return res.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.detail || "No se pudieron obtener las notificaciones."
        );
    }
};

// ------------------ MARCAR NOTIFICACIÓN COMO LEÍDA ------------------
export const markNotificationAsRead = async (notificationId) => {
    try {
        const res = await api.post(ENDPOINTS.MARK_AS_READ(notificationId));
        return res.data;
    } catch (err) {
        throw new Error(
            err.response?.data?.error || "No se pudo marcar la notificación como leída."
        );
    }
};