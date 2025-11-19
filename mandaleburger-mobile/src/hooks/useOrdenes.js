import { useEffect, useState } from "react";
import { getOrdenes } from "../services/orden";

export const useOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarOrdenes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getOrdenes();
      setOrdenes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  return { cargarOrdenes, ordenes, cargando, error};
};
