import { useState, useEffect } from "react";
import { getPromotionById } from "../services/promotion";

export const usePromocionDetalle = (promoId) => {
  const [promo, setPromo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!promoId) return;

    const fetchPromo = async () => {
      setCargando(true);
      setError(null);
      try {
        const data = await getPromotionById(promoId);
        setPromo(data);
      } catch (err) {
        setError(err.message || "Error al cargar la promoción");
      } finally {
        setCargando(false);
      }
    };

    fetchPromo();
  }, [promoId]);

  return { promo, cargando, error };
};
