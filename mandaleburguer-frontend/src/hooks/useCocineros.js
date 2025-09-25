import { useState, useEffect } from "react";
import { getCocineros } from "../services/auth"; 

export const useCocineros = () => {
  const [cocineros, setCocineros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCocineros = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCocineros();
      console.log(data);
      setCocineros(data);
    } catch (err) {
      setError(err.message || "Error al obtener cocineros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCocineros();
  }, []);

  return { cocineros, loading, error, fetchCocineros };
};
