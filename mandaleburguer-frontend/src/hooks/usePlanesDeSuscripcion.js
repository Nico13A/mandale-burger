import { useState, useEffect } from "react";
import { getSubscriptionPlans } from "../services/suscripciones";

// ------------------ HOOK PARA LISTAR PLANES ------------------
export const usePlanesDeSuscripcion = () => {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPlanes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getSubscriptionPlans();
      setPlanes(data);
    } catch (err) {
      setError(err.message || "Error al obtener los planes de suscripción");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlanes();
  }, []);

  return { planes, cargando, error, recargar: cargarPlanes };
};
