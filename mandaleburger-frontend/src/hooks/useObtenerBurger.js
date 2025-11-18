import { useState, useEffect } from "react";
import { getCustomerBurgerById } from "../services/customerBurger";

export const useObtenerBurger = (burgerId) => {
  const [burger, setBurger] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarBurger = async () => {
      if (!burgerId) return;
      setCargando(true);
      setError(null);

      try {
        const data = await getCustomerBurgerById(burgerId);
        setBurger(data);
      } catch (err) {
        setError(err.message || "Error al cargar la burger.");
      } finally {
        setCargando(false);
      }
    };

    cargarBurger();
  }, [burgerId]);

  return { burger, cargando, error };
};
