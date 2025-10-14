import { useState, useEffect } from "react";
import { getPromotions } from "../services/promotion";

export const useListarPromos = () => {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarPromociones = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getPromotions();
      setPromociones(data);
    } catch (err) {
      setError(err.message || "Error al cargar las promociones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  return {
    promociones,
    cargando,
    error,
    recargar: cargarPromociones,
  };
};
