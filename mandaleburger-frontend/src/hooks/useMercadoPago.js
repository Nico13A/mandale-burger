import { useState } from "react";
import { crearPreferenciaPago } from "../services/pago";

export const useMercadoPago = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const pagarPlan = async (planId) => {
    setCargando(true);
    setError(null);
    try {
      const { init_point } = await crearPreferenciaPago(planId);
      window.location.href = init_point;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, pagarPlan };
};
