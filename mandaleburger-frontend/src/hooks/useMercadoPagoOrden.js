import { useState } from "react";
import { crearPreferenciaPagoOrden } from "../services/pago";

export const useMercadoPagoOrden = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const pagarOrden = async (orderId) => {
    setCargando(true);
    setError(null);
    try {
      const { init_point } = await crearPreferenciaPagoOrden(orderId);
      window.location.href = init_point;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, pagarOrden };
};
