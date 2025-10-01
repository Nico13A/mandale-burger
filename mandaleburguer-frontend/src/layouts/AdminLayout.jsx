import { Outlet } from "react-router-dom";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarMobile from "../components/Navbar/NavbarMobile";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer/Footer";

const AdminLayout = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <NavbarMobile role={user?.groups?.[0]} />
            <NavbarDesktop role={user?.groups?.[0]} />
            <main className="flex-1 p-5 text-gris-boton md:mt-36">
                <Outlet />
            </main>
                  {/* Footer visible solo en desktop */}
      <div className="hidden md:block">
        <Footer role={user?.groups?.[0]} />
      </div>

        </div>
    );
}

export default AdminLayout;