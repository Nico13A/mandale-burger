import { useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";
import { getMenuItems } from "./menu.config.js";

export default function NavbarMobile({ role = "Client", cartCount = 0 }) {
  const navigate = useNavigate();
  const items = getMenuItems(role);

  return (
    <nav
      role="navigation"
      className="flex md:hidden justify-between fixed bottom-4 left-2 right-2 rounded-3xl bg-white shadow-lg py-2 z-50"
    >
      {items.map(({ key, label, icon: Icon }) =>
        key === "Carrito" ? (
          <CartButton
            key={key}
            count={cartCount}
            onClick={() => navigate("/client/carrito")}
            isMobile
          />
        ) : (
          <Button
            key={key}
            onClick={() => {
              if (role === "AppAdmin") navigate(`/admin/${key.toLowerCase()}`);
              else if (role === "Cook") navigate(`/cook/${key.toLowerCase()}`);
              else navigate(`/client/${key.toLowerCase()}`);
            }}
            aria-label={`Ir a ${label}`}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center justify-between h-12">
              <Icon className="w-6 h-6 text-gris-boton group-hover:text-naranja-boton-hover transition-colors duration-200" />
              <span className="text-xs text-gris-boton mt-1 transition-colors duration-200 group-hover:text-naranja-boton-hover">
                {label}
              </span>
            </div>
          </Button>
        )
      )}
    </nav>
  );
}

