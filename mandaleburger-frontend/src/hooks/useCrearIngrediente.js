import { useState } from "react";
import { createIngredient } from "../services/ingredientes";
import { refreshToken } from "../services/auth";

export const useCrearIngrediente = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const crearIngrediente = async (payload) => {
    setCargando(true);
    setError("");
    try {
      
      const data = await createIngredient(payload);
      return data;
    } catch (e) {
      
      if (e?.response?.status === 401) {
        try {
          await refreshToken();
          const data2 = await createIngredient(payload);
          return data2;
        } catch (e2) {
          setError("No se pudo crear el ingrediente.");
          throw e2;
        } finally {
          setCargando(false);
        }
      }
      setError("No se pudo crear el ingrediente.");
      throw e;
    } finally {
      setCargando(false);
    }
  };

  return { crearIngrediente, cargando, error };
};
