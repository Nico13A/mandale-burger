import { useEffect, useState } from "react";
import { getPromotions } from "../services/promocion";

export const usePromociones = () => {
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
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  return { cargarPromociones, promociones, cargando, error};
};
