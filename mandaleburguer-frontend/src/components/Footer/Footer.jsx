import { useNavigate } from "react-router-dom";
import { getMenuItems } from "../Navbar/menu.config.js";
import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";

const Footer = ({ role = "Client", cartCount = 0 }) => {
  const navigate = useNavigate();
  const allItems = getMenuItems(role);
  const textItems = allItems.filter((item) => item.key !== "Carrito");
  const cartItem = allItems.find((item) => item.key === "Carrito");

  let displayItems = textItems;
  if (role === "AppAdmin") {
    displayItems = textItems
      .filter((item) => item.key !== "Inicio" && item.key !== "Perfil")
      .map((item) => ({
        ...item,
        label: `Administrar ${item.label.toLowerCase()}`,
      }));
  }

  return (
    <footer className="hidden md:flex w-full bg-gris-boton text-white py-12 px-12 mt-17 flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between space-x-12">
        <div
          className="cursor-pointer flex flex-col items-center md:items-start"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/LogoBlanco.png"
            alt="Logo Mandale Burger"
            className="w-32 mb-4"
          />
        </div>

        <div className="flex flex-col items-start space-y-2">
          {displayItems.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => {
                if (role === "AppAdmin") navigate(`/admin/${key.toLowerCase()}`);
                else if (role === "Cook") navigate(`/cook/${key.toLowerCase()}`);
                else navigate(`/client/${key.toLowerCase()}`);
              }}
              aria-label={`Ir a ${label}`}
              className="w-48 text-left"
            >
              <span className="relative inline-block text-sm text-gray-300 hover:text-naranja-boton-hover after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-naranja-boton-hover after:transition-all after:duration-300 hover:after:w-full">
                {label}
              </span>
            </Button>
          ))}

          {cartItem && role !== "AppAdmin" && (
            <CartButton
              key={cartItem.key}
              count={cartCount}
              onClick={() => navigate("/client/carrito")}
              className="w-48 text-left"
            />
          )}
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">&copy; 2025 Mandale Burger. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;







