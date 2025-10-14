import { useState, useEffect } from "react";
import { getPromotionById } from "../services/promotion";

export const useObtenerPromo = (promoId) => {
  const [promo, setPromo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPromo = async () => {
      if (!promoId) return;
      setCargando(true);
      setError(null);

      try {
        const data = await getPromotionById(promoId);
        setPromo(data);
      } catch (err) {
        setError(err.message || "Error al cargar la promoción.");
      } finally {
        setCargando(false);
      }
    };

    cargarPromo();
  }, [promoId]);

  return { promo, cargando, error };
};
