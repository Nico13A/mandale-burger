import { useState, useEffect } from "react";
import { getPromotionById } from "../services/promocion";

export const usePromocionDetalle = (promoId) => {
    const [promocion, setPromocion] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarPromocion = async () => {
        if (!promoId) return;
        setCargando(true);
        setError(null);
        try {
            const data = await getPromotionById(promoId);
            setPromocion(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPromocion();
    }, [promoId]);

    return { cargarPromocion, promocion, cargando, error };
};
