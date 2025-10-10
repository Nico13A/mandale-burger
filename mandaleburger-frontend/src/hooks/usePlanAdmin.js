import { useState } from "react";
import {
    createSubscriptionPlan,
    updateSubscriptionPlan,
    activateSubscriptionPlan,
    deactivateSubscriptionPlan
} from "../services/suscripciones";

export const usePlanAdmin = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Crear plan
    const crearPlan = async (data) => {
        setCargando(true);
        setError(null);
        try {
            const res = await createSubscriptionPlan(data);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Editar plan
    const editarPlan = async (id, data) => {
        setCargando(true);
        setError(null);
        try {
            const res = await updateSubscriptionPlan(id, data);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Activar plan
    const activarPlan = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const res = await activateSubscriptionPlan(id);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Desactivar plan
    const desactivarPlan = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const res = await deactivateSubscriptionPlan(id);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    return {
        cargando,
        error,
        crearPlan,
        editarPlan,
        activarPlan,
        desactivarPlan
    };
};
