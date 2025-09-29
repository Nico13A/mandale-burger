import { useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";
import CartButton from "../CartButton/CartButton.jsx";
import { getMenuItems } from "./menu.config.js";

const NavbarDesktop = ({ role = "Client", cartCount = 0 }) => {
    const navigate = useNavigate();
    const allItems = getMenuItems(role);
    const textItems = allItems.filter(item => item.key !== "Carrito");
    const cartItem = allItems.find(item => item.key === "Carrito");
    
    return (
        <nav className="hidden md:flex items-center justify-between w-full bg-white shadow-xs px-6 py-3 fixed top-0 left-0 z-50">
            <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                <img src="/assets/Logo.png" alt="Logo Mandale Burger" className="w-30" />
            </div>
    
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
                        <span className="text-gris-boton hover:text-naranja-boton-hover transition-colors duration-200">
                            {label}
                        </span>
                    </Button>
                ))}
    
                {cartItem && (
                    <CartButton
                        key={cartItem.key}
                        count={cartCount}
                        onClick={() => navigate("/client/carrito")}
                    />
                )}
            </div>
        </nav>
    );
}

export default NavbarDesktop;

