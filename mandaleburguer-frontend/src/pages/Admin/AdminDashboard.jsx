import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Panel de Administrador</h1>
      <p className="mb-6">
        Bienvenido, {user.username} ({user.groups?.[0]})
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </>
  );
}

export default AdminDashboard;