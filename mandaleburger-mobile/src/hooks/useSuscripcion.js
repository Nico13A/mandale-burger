import { useState } from "react";
import { getActiveUserSubscription } from "../services/suscripciones";

export const useSuscripcion = () => {
    const [suscripcion, setSuscripcion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarSuscripcionActiva = async () => {
        setCargando(true);
        setError(null);
        try {
            const res = await getActiveUserSubscription();
            if (!res || !res.plan) {
                setSuscripcion(null);
            } else {
                setSuscripcion(res);
            }
            return res;
        } catch (err) {
            setError(err);
            setSuscripcion(null);
        } finally {
            setCargando(false);
        }
    };

    return {
        suscripcion,
        cargando,
        error,
        cargarSuscripcionActiva,
    };
};
