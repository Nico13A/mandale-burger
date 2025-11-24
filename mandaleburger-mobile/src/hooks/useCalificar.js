import { useState,useEffect  } from "react";
import { setPublicationRating } from "../services/post";

export function usePublicationRating(initialScore = 0) {
  const [score, setScore] = useState(initialScore);
  const [cargando, setCargando] = useState(false);
  const [error,   setError] = useState(null);

  useEffect(() => {
    setScore(initialScore || 0);
  }, [initialScore]);

  const rate = async (publicationId, newScore) => {
    setCargando(true);
    setError(null);
    setScore(newScore); 
    try {
      const data = await setPublicationRating(publicationId, newScore);
      setScore(data.score);
    } catch (err) {
      console.error(err);
      setError(
        err?.non_field_errors?.[0] ||
        err?.message ||
        "No se pudo guardar la calificación."
      );
    } finally {
      setCargando(false);
    }
  };

  return { score, cargando, error, rate };
}