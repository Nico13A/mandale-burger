import { useState } from "react";
import { forgotPassword } from "../services/auth";
import { toast } from "react-toastify";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleForgotPassword = async (email) => {
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);

      toast.success(
        "Se envió un email con las instrucciones para resetear tu contraseña.",
        { position: "top-right", autoClose: 3000 }
      );
    } catch (err) {
      setError(err.message || "Error al enviar el email");
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading, error };
};
