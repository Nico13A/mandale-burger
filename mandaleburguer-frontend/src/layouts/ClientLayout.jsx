import { Outlet, useNavigate } from "react-router-dom";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarMobile from "../components/Navbar/NavbarMobile";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../hooks/useAuth";
import { useSuscripcionUsuario } from "../hooks/useSuscripcionUsuario";

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { suscripcion } = useSuscripcionUsuario(); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = 3;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar Mobile */}
      <NavbarMobile role={user?.groups?.[0]} cartCount={cartCount} />

      {/* Navbar Desktop */}
      <NavbarDesktop
        role={user?.groups?.[0]}
        cartCount={cartCount}
        onLogout={handleLogout}
        suscripcion={suscripcion} 
      />

      {/* Contenido principal */}
      <main className="flex-1 p-5 text-gris-boton md:mt-36">
        <Outlet />
      </main>

      {/* Footer visible solo en desktop */}
      <div className="hidden md:block">
        <Footer role={user?.groups?.[0]} />
      </div>
    </div>
  );
};

export default ClientLayout;

