import { useState } from "react";
import { updateProfileImage } from "../services/auth";

export const useUpdateProfileImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleUpdateProfileImage = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateProfileImage(file);
      return data; 
    } catch (err) {
      setError(err.message || "No se pudo actualizar la imagen de perfil");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { handleUpdateProfileImage, loading, error };
};
