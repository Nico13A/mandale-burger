import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordConfirm } from "../services/auth";
import { toast } from "react-toastify";

export const useResetPasswordConfirm = (uid, token) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleReset = async (newPassword) => {
    setErrors(null);
    setLoading(true);
    try {
      await resetPasswordConfirm(uid, token, newPassword);

      toast.success(
        "Contraseña cambiada correctamente. Puedes iniciar sesión ahora.",
        {
          position: "top-right",
          autoClose: 3000,
          onClose: () => navigate("/login"),
        }
      );
    } catch (err) {
      if (err.new_password) {
        const mensajesTraducidos = err.new_password.map((msg) =>
          msg.includes("This password is too short")
            ? "La contraseña es demasiado corta. Debe tener al menos 8 caracteres."
            : msg
        );
        setErrors(mensajesTraducidos);
      } else if (err.detail) {
        setErrors([err.detail]);
      } else {
        setErrors([err.message || "Error al cambiar la contraseña"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, loading, errors };
};
