import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button/Button";
import Spinner from "../components/Spinner/Spinner";
import Input from "../components/Input/Input";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useResetPasswordConfirm } from "../hooks/useResetPasswordConfirm";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const { handleReset, loading, errors } = useResetPasswordConfirm(uid, token);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReset(newPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-gris-boton">
      <h2 className="text-2xl md:text-3xl font-bold text-gris-boton mb-6">Nueva contraseña</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <Input
          type="password"
          name="newPassword"
          placeholder="Ingrese nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />

        {errors && errors.length > 1 ? (
          <ul className="text-red-500 text-sm list-disc list-inside">
            {errors.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : errors && (
          <p className="text-red-500 text-sm">{errors[0]}</p>
        )}

        <Button
          type="submit"
          className="bg-naranja-boton hover:bg-naranja-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Cambiar contraseña"}
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ResetPasswordConfirm;


