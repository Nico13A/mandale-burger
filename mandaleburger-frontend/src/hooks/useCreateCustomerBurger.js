import { useState } from "react";
import { createCustomerBurger } from "../services/customerBurger";

export const useCreateCustomerBurger = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [burgerCreada, setBurgerCreada] = useState(null);

  const handleCreateCustomerBurger = async (data) => {
    setCargando(true);
    setError(null);
    try {
      const res = await createCustomerBurger(data); // res = burger (objeto)
      setBurgerCreada(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, burgerCreada, handleCreateCustomerBurger };
};
