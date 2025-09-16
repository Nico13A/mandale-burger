import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user.groups?.[0]; // "client", "cook", "admin"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido {user.username}</h1>
        <p className="text-gray-600 mb-6">Has iniciado sesión correctamente.</p>

        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
          <p>
            <strong>Usuario:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {role}
          </p>
        </div>

        {/* Contenido condicional según rol */}
        {role === "Client" && (
          <div className="mb-6 p-4 border rounded bg-blue-50">
            <h2 className="font-semibold">Panel Cliente</h2>
            <p>Podés hacer pedidos y ver tu historial.</p>
          </div>
        )}

        {role === "Cook" && (
          <div className="mb-6 p-4 border rounded bg-green-50">
            <h2 className="font-semibold">Panel Cocinero</h2>
            <p>Podés ver los pedidos pendientes y actualizarlos.</p>
          </div>
        )}

        {role === "AppAdmin" && (
          <div className="mb-6 p-4 border rounded bg-red-50">
            <h2 className="font-semibold">Panel Administrador</h2>
            <p>Podés gestionar usuarios, roles y pedidos.</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

