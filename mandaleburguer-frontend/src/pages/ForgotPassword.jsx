import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import Spinner from "../components/Spinner/Spinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Input from "../components/Input/Input";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { handleForgotPassword, loading, error } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForgotPassword(email);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center cursor-pointer text-gris-boton hover:text-gris-boton-hover font-medium px-2 py-1 text-sm md:text-base"
      >
        <ArrowLeftIcon className="w-6 h-6 mr-2 text-naranja-boton hover:text-naranja-boton-hover" />
        Volver
      </button>

      <div className="w-full max-w-md flex flex-col">
        <h2 className="text-2xl md:text-3xl font-bold text-gris-boton mb-6 text-center">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            name="email"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="bg-naranja-boton hover:bg-naranja-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Enviar email"}
          </Button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;


