import { useState } from "react";
import { associatePromotionToPlan } from "../services/promotion";

export const useAsociarPromoPlan = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [asociacionExitosa, setAsociacionExitosa] = useState(null);

  const handleAsociarPromo = async (data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await associatePromotionToPlan(data);
      setAsociacionExitosa(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return {
    cargando,
    error,
    asociacionExitosa,
    handleAsociarPromo,
  };
};
