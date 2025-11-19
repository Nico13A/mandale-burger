import { useState } from "react";
import { getSubscriptionPlans } from "../services/suscripciones";

export const usePlanes = () => {
    const [planes, setPlanes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarPlanes = async () => {
        setCargando(true);
        setError(null);
        try {
            const res = await getSubscriptionPlans();
            setPlanes(res || []); 
            return res;
        } catch (err) {
            setError(err.message);
            setPlanes([]);
        } finally {
            setCargando(false);
        }
    };

    return {
        planes,
        cargando,
        error,
        cargarPlanes,
    };
};
