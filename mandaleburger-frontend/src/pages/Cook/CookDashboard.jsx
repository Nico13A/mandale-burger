import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NavbarDesktop from "../../components/Navbar/NavbarDesktop";
import NavbarMobile from "../../components/Navbar/NavbarMobile";

const CookDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("CookDashboard: user →", user);
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <>
      <NavbarMobile role={user?.groups?.[0]} />
      <NavbarDesktop role={user?.groups?.[0]} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-gris-boton">
      <h1 className="text-3xl font-bold mb-4">Panel de Cocinero</h1>
      <p className="mb-6">Bienvenido, {user.username} ({user.groups?.[0]})</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
  
    </div>
    </>
  );
}

export default CookDashboard;