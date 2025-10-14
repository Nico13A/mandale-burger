import { useState } from "react";
import { updatePromotion, activatePromotion, deactivatePromotion } from "../services/promotion";

export const usePromocionAdmin = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const editarPromo = async (promoId, data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await updatePromotion(promoId, data);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  const activarPromo = async (promoId) => {
    setCargando(true);
    setError(null);
    try {
      const res = await activatePromotion(promoId);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  const desactivarPromo = async (promoId) => {
    setCargando(true);
    setError(null);
    try {
      const res = await deactivatePromotion(promoId);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, editarPromo, activarPromo, desactivarPromo };
};
