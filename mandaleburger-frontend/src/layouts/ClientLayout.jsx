import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import NavbarDesktop from "../components/Navbar/NavbarDesktop";
import NavbarMobile from "../components/Navbar/NavbarMobile";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../hooks/useAuth";
import { useSuscripcionUsuario } from "../hooks/useSuscripcionUsuario";

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { suscripcion: suscripcionInicial, crearSuscripcion } = useSuscripcionUsuario();
  const [suscripcionActual, setSuscripcionActual] = useState(suscripcionInicial);

  useEffect(() => {
    if (suscripcionInicial) {
      setSuscripcionActual(suscripcionInicial);
    }
  }, [suscripcionInicial]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartCount = 3;

  const outletContext = useMemo(
    () => ({
      suscripcionActual,
      setSuscripcionActual,
      crearSuscripcion,
    }),
    [suscripcionActual, crearSuscripcion]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavbarMobile role={user?.groups?.[0]} cartCount={cartCount} />
      <NavbarDesktop
        role={user?.groups?.[0]}
        cartCount={cartCount}
        onLogout={handleLogout}
        suscripcion={suscripcionActual}
      />

      <main className="flex-1 p-5 text-gris-boton md:mt-36">
        <Outlet context={outletContext} />
      </main>

      <div className="hidden md:block">
        <Footer role={user?.groups?.[0]} />
      </div>
    </div>
  );
};

export default ClientLayout;


