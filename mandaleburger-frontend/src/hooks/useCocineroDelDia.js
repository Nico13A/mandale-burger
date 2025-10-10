import { useState, useEffect } from "react";
import { createCocineroDelDia, getCocineroDelDiaActual } from "../services/cocineroDia";

export const useCocineroDelDia = () => {
  const [cocineroActual, setCocineroActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------------------ OBTENER COCINERO DEL DÍA ------------------
  const fetchCocineroDelDia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCocineroDelDiaActual();
      setCocineroActual(data);
    } catch (err) {
      setError(err.message || "No se pudo obtener el cocinero del día.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ ASIGNAR NUEVO COCINERO DEL DÍA ------------------
  const asignarCocineroDelDia = async (cocineroId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createCocineroDelDia({ cocinero_id: cocineroId });
      setCocineroActual(data); // actualiza automáticamente el estado
      return data;
    } catch (err) {
      setError(err.detail || ["No se pudo asignar el cocinero del día."]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar el cocinero actual al montar
  useEffect(() => {
    fetchCocineroDelDia();
  }, []);

  return {
    cocineroActual,
    loading,
    error,
    fetchCocineroDelDia,
    asignarCocineroDelDia,
  };
};
