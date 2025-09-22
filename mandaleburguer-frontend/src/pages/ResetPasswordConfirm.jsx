import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordConfirm } from "../services/auth";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams(); // vienen desde la URL: /password/reset/confirm/:uid/:token
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);
    try {
      await resetPasswordConfirm(uid, token, newPassword);
      setMensaje("Contraseña cambiada correctamente. Puedes iniciar sesión ahora.");
      setTimeout(() => navigate("/login"), 3000); // redirige al login después de 3s
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva contraseña</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input
          type="password"
          placeholder="Ingrese nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {mensaje && <p className="text-green-500 text-sm">{mensaje}</p>}
        <button
          type="submit"
          className="bg-naranja-boton hover:bg-naranja-boton-hover text-white py-2 rounded shadow"
          disabled={loading}
        >
          {loading ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordConfirm;
