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
      toast.success("¡Registro exitoso! Ya puedes iniciar sesión.", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading };
};
