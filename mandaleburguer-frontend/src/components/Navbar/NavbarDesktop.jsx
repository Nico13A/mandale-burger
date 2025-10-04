import { useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";
import { getMenuItems } from "./menu.config.js";
import PerfilDropdown from "../PerfilDropdown/PerfilDropdown.jsx";

const NavbarDesktop = ({ role = "Client", cartCount = 0, onLogout }) => {
  const navigate = useNavigate();
  const allItems = getMenuItems(role);
  
  const textItems = allItems.filter(
    item => item.key !== "Carrito" && item.key !== "Perfil"
  );
  const cartItem = allItems.find(item => item.key === "Carrito");
  const perfilItem = allItems.find(item => item.key === "Perfil");

  return (
    <nav className="hidden md:flex items-center justify-between w-full bg-white shadow-xs px-6 py-3 fixed top-0 left-0 z-50">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/assets/Logo.png"
          alt="Logo Mandale Burger"
          className="w-30"
        />
      </div>

      {/* Botones del navbar */}
      <div className="flex items-center space-x-6">
        {textItems.map(({ key, label }) => (
          <Button
            key={key}
            onClick={() => {
              if (role === "AppAdmin") navigate(`/admin/${key.toLowerCase()}`);
              else if (role === "Cook") navigate(`/cook/${key.toLowerCase()}`);
              else navigate(`/client/${key.toLowerCase()}`);
            }}
            aria-label={`Ir a ${label}`}
          >
            <span className="relative inline-block text-gris-boton hover:text-naranja-boton-hover after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-naranja-boton-hover after:transition-all after:duration-300 hover:after:w-full">
              {label}
            </span>
          </Button>
        ))}

        {/* Botón del carrito */}
        {cartItem && (
          <CartButton
            key={cartItem.key}
            count={cartCount}
            onClick={() => navigate("/client/carrito")}
          />
        )}

        {/* Dropdown de perfil */}
        {perfilItem && <PerfilDropdown onLogout={onLogout} />}
      </div>
    </nav>
  );
};

export default NavbarDesktop;


