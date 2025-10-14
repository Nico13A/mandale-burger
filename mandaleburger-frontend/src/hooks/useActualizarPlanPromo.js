import { useState } from "react";
import { updatePromotionPlan } from "../services/promotion";

export const useActualizarPlanPromo = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const actualizarPlan = async (data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await updatePromotionPlan(data);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { actualizarPlan, cargando, error };
};

