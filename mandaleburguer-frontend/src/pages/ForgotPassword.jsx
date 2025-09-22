import { useState } from "react";
import { forgotPassword } from "../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setMensaje("Se envió un email con las instrucciones para resetear tu contraseña.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recuperar contraseña</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input
          type="email"
          placeholder="Ingrese su email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {mensaje && <p className="text-green-500 text-sm">{mensaje}</p>}
        <button
          type="submit"
          className="bg-naranja-boton hover:bg-naranja-boton-hover text-white py-2 rounded shadow"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
