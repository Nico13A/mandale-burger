import { useNavigate } from "react-router-dom";
import { getMenuItems } from "../Navbar/menu.config.js";
import Button from "../Button/Button.jsx";

const Footer = ({ role = "Client" }) => {
  const navigate = useNavigate();
  const allItems = getMenuItems(role);

  let textItems = allItems.filter(
    (item) =>
      item.key !== "Carrito" &&
      item.key !== "Perfil" &&
      item.key !== "Inicio"
  );

  let displayItems = textItems;
  if (role === "AppAdmin") {
    displayItems = textItems.map((item) => ({
      ...item,
      label: `Administrar ${item.label.toLowerCase()}`,
    }));
  }

  return (
    <footer className="hidden md:flex w-full bg-gris-boton text-white p-12 mt-17 flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
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

        {/* Menú dinámico */}
        <div
          className={`flex ${role === "AppAdmin"
              ? "flex-col items-start space-y-2" 
              : "flex-row justify-center gap-5"
            }`}
        >
          {displayItems.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => {
                if (role === "AppAdmin") navigate(`/admin/${key.toLowerCase()}`);
                else if (role === "Cook") navigate(`/cook/${key.toLowerCase()}`);
                else navigate(`/client/${key.toLowerCase()}`);
              }}
              aria-label={`Ir a ${label}`}
              className={`${role === "AppAdmin"
                  ? "w-52 text-left"
                  : ""
                }`}
            >
              <span
                className="relative inline-block text-sm text-gray-300 hover:text-naranja-boton-hover after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-naranja-boton-hover after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400 text-center">
        &copy; 2025 Mandale Burger. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;









