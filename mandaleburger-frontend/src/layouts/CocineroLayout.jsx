import { Outlet, useNavigate } from "react-router-dom";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarMobile from "../components/Navbar/NavbarMobile";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../hooks/useAuth";

const CocineroLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar Mobile */}
      <NavbarMobile role="Cook" />

      {/* Navbar Desktop */}
      <NavbarDesktop role="Cook" onLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-1 p-5 md:mt-36 text-gris-boton">
        <Outlet />
      </main>

      {/* Footer visible solo en desktop */}
      <div className="hidden md:block">
        <Footer role="Cook" />
      </div>
    </div>
  );
};

export default CocineroLayout;
