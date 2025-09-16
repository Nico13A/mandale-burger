import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {user, login } = useAuth();

  if (user) return <Navigate to="/redirect" replace />;

  const handleLogin = async () => {
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="mb-6"
        />

        <Button
          className="bg-naranja-boton hover:bg-naranja-boton-hover"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default Login;
