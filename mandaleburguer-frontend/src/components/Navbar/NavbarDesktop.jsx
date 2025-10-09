import { useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";
import { getMenuItems } from "./menu.config.js";
import PerfilDropdown from "../PerfilDropdown/PerfilDropdown.jsx";
import { StarIcon } from "@heroicons/react/24/solid";

const NavbarDesktop = ({ role = "Client", cartCount = 0, onLogout, suscripcion }) => {
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

        {/* Dropdown de perfil + badge de suscripción */}
        {perfilItem && (
          <div className="relative flex items-center">
            <PerfilDropdown onLogout={onLogout} />

            {suscripcion?.plan && (
              <div className="relative group ml-2">
                {/* Badge con icono y nombre */}
                <div className="flex items-center bg-gris-boton text-white rounded-full p-2 font-medium cursor-default">
                  <StarIcon className="w-6 h-6 mr-2" />
                  <span className="text-xs">{suscripcion.plan.name}</span>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                  Tu plan actual
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarDesktop;


