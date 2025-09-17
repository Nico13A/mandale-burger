import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Spinner from "../components/Spinner/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const { user } = useAuth();
  const { handleLogin, error, loading } = useLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/redirect" replace />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Iniciar sesión
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(username, password);
        }}
        className="w-full max-w-md flex flex-col gap-4"
      >
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingrese su usuario"
        />

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingrese su contraseña"
        />

        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}

        <Button
          type="submit"
          className="bg-naranja-boton hover:bg-naranja-boton-hover shadow-md flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Ingresar"}
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-orange-400 hover:underline font-medium">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

