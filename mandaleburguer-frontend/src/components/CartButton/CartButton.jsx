import Button from "../Button/Button.jsx";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function CartButton({ count = 0, onClick, isMobile = false }) {
  return (
    <Button
      onClick={onClick}
      aria-label="Ir al carrito"
      className="flex-1 flex flex-col items-center px-2 py-2"
    >
      <div className="relative flex items-center justify-center">
        <ShoppingCartIcon className="w-6 h-6 text-gris-boton hover:text-naranja-boton-hover transition-colors duration-200" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </div>
      {isMobile && <span className="sr-only">Carrito</span>}
    </Button>
  );
}
