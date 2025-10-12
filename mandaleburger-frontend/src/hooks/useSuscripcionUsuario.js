import { useState, useEffect } from "react";
import { getActiveUserSubscription } from "../services/suscripciones";

export const useSuscripcionUsuario = () => {
    const [suscripcion, setSuscripcion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

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
        recargar: cargarSuscripcionActiva
    };
};
