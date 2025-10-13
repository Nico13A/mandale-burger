import { useState } from "react";
import { createPromotion } from "../services/promotion";

export const useCreatePromotion = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [promocionCreada, setPromocionCreada] = useState(null);

  const handleCreatePromotion = async (data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await createPromotion(data);
      setPromocionCreada(res);
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
    promocionCreada,
    handleCreatePromotion,
  };
};
