import { useState, useEffect } from "react";
import { getPublicationById } from "../services/posts";

export const useObtenerPost = (postId) => {
  const [post, setPost] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPost = async () => {
      if (!postId) return;
      setCargando(true);
      setError(null);

      try {
        const data = await getPublicationById(postId);
        setPost(data);
      } catch (err) {
        setError(err.message || "Error al cargar Post.");
      } finally {
        setCargando(false);
      }
    };

    cargarPost();
  }, [postId]);

  return { post, cargando, error };
};
