import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";
import { getMenuItems } from "./menu.config.js";

export default function NavbarMobile({ role = "Client", cartCount = 0 }) {
  const items = getMenuItems(role);

  return (
    <nav
      role="navigation"
      className="flex md:hidden justify-between fixed bottom-4 left-4 right-4 rounded-3xl bg-white shadow-lg p-2 z-50"
    >
      {items.map(({ key, label, icon: Icon }) =>
        key === "Carrito" ? (
          <CartButton
            key={key}
            count={cartCount}
            onClick={() => console.log("Navegar a", key)}
            isMobile
          />
        ) : (
          <Button
            key={key}
            onClick={() => console.log("Navegar a", key)}
            aria-label={`Ir a ${label}`}
            className="flex-1 flex flex-col items-center justify-center px-2 py-2"
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

