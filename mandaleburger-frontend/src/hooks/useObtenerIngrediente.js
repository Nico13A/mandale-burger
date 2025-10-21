import { useEffect, useState } from "react";
import { getIngredient } from "../services/ingredientes";
import { refreshToken } from "../services/auth"; 

export const useObtenerIngrediente = (id) => {
  const [ingrediente, setIngrediente] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancel = false;

    const run = async () => {
      setCargando(true);
      setError("");
      try {
        const data = await getIngredient(id);
        if (!cancel) setIngrediente(data);
      } catch (e) {
        
        if (e?.response?.status === 401) {
          try {
            await refreshToken();
            const data2 = await getIngredient(id);
            if (!cancel) {
              setIngrediente(data2);
              return; 
            }
          } catch (e2) {
            
          }
        }
        if (!cancel) setError("No se pudo obtener el ingrediente.");
      } finally {
        if (!cancel) setCargando(false);
      }
    };

    run();
    return () => { cancel = true; };
  }, [id]);

  return { ingrediente, cargando, error };
};
