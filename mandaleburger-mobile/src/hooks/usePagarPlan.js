import { useState } from "react";
import { Linking } from "react-native";
import { crearPreferenciaPago } from "../services/pago";

export const usePagarPlan = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const pagarPlan = async (planId) => {
        setCargando(true);
        setError(null);
        try {
            const { init_point } = await crearPreferenciaPago(planId);
            await Linking.openURL(init_point);
        } catch (err) {
            const mensaje = err.message || "Error al iniciar el pago.";
            setError(mensaje);
            throw new Error(mensaje);
        } finally {
            setCargando(false);
        }
    };

    return { cargando, error, pagarPlan };
};
