import { useState } from "react";
import { updateUserProfile } from "../services/user";

export const usePerfil = () => {
  const [cargando, setCargando] = useState(false);

  const actualizarPerfil = async (datos) => {
    setCargando(true);
    try {
      const respuesta = await updateUserProfile(datos);
      return respuesta; 
    } catch (err) {
      console.log("Error al actualizar el perfil:", err);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, actualizarPerfil };
};
