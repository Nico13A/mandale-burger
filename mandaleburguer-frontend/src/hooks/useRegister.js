/*
import { useState } from "react";
import { register as apiRegister } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      await apiRegister(formData);
      setLoading(false);
      toast.success("¡Registro exitoso! Ya puedes iniciar sesión.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      setLoading(false);
      toast.error(`Error: ${err.message || "Error en el registro"}`, {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return { handleRegister, loading };
};

*/
import { useState } from "react";
import { register as apiRegister } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      await apiRegister(formData);
      setLoading(false);

      toast.success("¡Registro exitoso! Ya puedes iniciar sesión.", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      setLoading(false);
      // no mostramos toast en error, lo maneja el formulario
      throw err;
    }
  };

  return { handleRegister, loading };
};
