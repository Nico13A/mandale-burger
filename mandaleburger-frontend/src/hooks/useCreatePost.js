import { useState } from "react";
import {createPublication } from "../services/posts"


export const useCreatePost = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  const handleCreatePost = async (data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await createPublication(data); 
      setPost(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, post, handleCreatePost };
};
