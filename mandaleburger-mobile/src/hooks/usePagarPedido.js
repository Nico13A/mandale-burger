import { useState } from "react";
import { Linking } from "react-native";
import { crearPreferenciaPagoOrden } from "../services/pago";

export const usePagarPedido = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const pagarPedido = async (orderId) => {
        setCargando(true);
        setError(null);
        try {
            const { init_point } = await crearPreferenciaPagoOrden(orderId);
            await Linking.openURL(init_point);
        } catch (err) {
            const mensaje = err.message || "Error al iniciar el pago de la orden.";
            setError(mensaje);
            throw new Error(mensaje);
        } finally {
            setCargando(false);
        }
    };

    return { cargando, error, pagarPedido };
};
