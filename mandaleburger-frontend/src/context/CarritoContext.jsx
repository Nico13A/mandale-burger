import { createContext, useContext } from "react";
import { useCarrito as useCarritoHook } from "../hooks/useCarrito";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const carrito = useCarritoHook(); 
  return (
    <CarritoContext.Provider value={carrito}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
