import { useState, useEffect, useCallback } from "react";
import { listRatingsByPublication } from "../services/posts";

export const useObtenerCalificacionPost = (postId) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarCalificaciones = useCallback(async () => {
    if (!postId) return;

    setCargando(true);
    setError(null);

    try {
      const data = await listRatingsByPublication(postId);
      setCalificaciones(data || []);
    } catch (err) {
      setError(err.message || "Error al cargar calificaciones.");
    } finally {
      setCargando(false);
    }
  }, [postId]);

  useEffect(() => {
    cargarCalificaciones();
  }, [cargarCalificaciones]);

  return {
    calificaciones,
    cargando,
    error,
    refetchCalificaciones: cargarCalificaciones,
  };
};
