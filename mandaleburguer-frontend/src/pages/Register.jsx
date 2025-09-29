import { useState } from "react";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useRegister } from "../hooks/useRegister";
import Spinner from "../components/Spinner/Spinner";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { handleRegister, loading } = useRegister();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "El usuario es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.first_name) newErrors.first_name = "El nombre es obligatorio";
    if (!formData.last_name) newErrors.last_name = "El apellido es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await handleRegister(formData);
    } catch (err) {
      if (err.password) {
        err.password = err.password.map((msg) =>
          msg.includes("This password is too short")
            ? "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."
            : msg
        );
      }
      setErrors(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-gris-boton">
      <div className="w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gris-boton mb-6">Crear cuenta</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <Input name="username" value={formData.username} onChange={handleChange} placeholder="Usuario" disabled={loading} />
        {errors.username && <p className="text-red-500 text-sm">{Array.isArray(errors.username) ? errors.username[0] : errors.username}</p>}

        <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" disabled={loading} />
        {errors.email && <p className="text-red-500 text-sm">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}

        <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" disabled={loading} />
        {errors.password && (
          Array.isArray(errors.password) ? (
            <ul className="text-red-500 text-sm list-disc ml-5">
              {errors.password.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          ) : <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <Input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Nombre" disabled={loading} />
        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

        <Input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Apellido" disabled={loading} />
        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

        <Button type="submit" className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50" disabled={loading}>
          {loading ? <Spinner /> : "Registrarse"}
        </Button>

        <div className="mt-4 md:text-base text-center text-sm text-gris-boton">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-orange-400 hover:underline font-medium">
            Inicia sesión
          </Link>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Register;



