import { useState, useEffect } from "react";
import { createUserSubscription, getActiveUserSubscription } from "../services/suscripciones";

export const useSuscripcionUsuario = () => {
    const [suscripcion, setSuscripcion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Crear suscripción
    const crearSuscripcion = async (planId) => {
        setCargando(true);
        setError(null);
        try {
            const res = await createUserSubscription(planId);
            setSuscripcion(res);
            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Obtener suscripción activa
    const cargarSuscripcionActiva = async () => {
        setCargando(true);
        setError(null);
        try {
            const res = await getActiveUserSubscription();
            setSuscripcion(res);
            return res;
        } catch (err) {
            setError(err);
            setSuscripcion(null);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarSuscripcionActiva();
    }, []);

    return {
        suscripcion,
        cargando,
        error,
        crearSuscripcion,
        recargar: cargarSuscripcionActiva
    };
};
