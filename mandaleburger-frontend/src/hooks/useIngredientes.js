import { useState, useEffect } from "react";
import { getIngredients } from "../services/ingredientes";

export const useIngredientes = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarIngredientes = async () => {
      setCargando(true);
      try {
        const data = await getIngredients();
        setIngredientes(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los ingredientes");
      } finally {
        setCargando(false);
      }
    };

    cargarIngredientes();
  }, []);

  return { ingredientes, cargando, error };
};

