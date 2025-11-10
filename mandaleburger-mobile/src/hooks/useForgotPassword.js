import { useState } from "react";
import { forgotPassword } from "../services/auth";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleForgotPassword = async (email) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess("Se envió un email con las instrucciones para resetear tu contraseña.");
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return { handleForgotPassword, loading, error, success };
};

