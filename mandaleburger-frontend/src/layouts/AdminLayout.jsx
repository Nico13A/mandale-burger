import { Outlet, useNavigate } from "react-router-dom";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarMobile from "../components/Navbar/NavbarMobile";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();             
    navigate("/login");   
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar Mobile */}
      <NavbarMobile role={user?.groups?.[0]} />

      {/* Navbar Desktop */}
      <NavbarDesktop role={user?.groups?.[0]} onLogout={handleLogout} />

      {/* Main content */}
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

export default AdminLayout;


