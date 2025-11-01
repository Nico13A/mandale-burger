import { useState } from "react";
import { getCocinaOrders } from "../services/orders";

export const useCocinaOrders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarOrdenesCocina = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getCocinaOrders();
      setOrdenes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return {
    ordenes,
    cargando,
    error,
    cargarOrdenesCocina,
  };
};
