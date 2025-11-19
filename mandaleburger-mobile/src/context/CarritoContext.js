import { createContext, useContext, useEffect } from "react";
import { useCarrito as useCarritoHook } from "../hooks/useCarrito";
import { useAuth } from "../hooks/useAuth";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const carrito = useCarritoHook();
  const { user } = useAuth();
  useEffect(() => {
    if (user) carrito.fetchCart();        
  }, [user]);
  return (
    <CarritoContext.Provider value={carrito}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);