import { useState } from "react";
import { getCustomerBurgers } from "../services/customerBurger";

export const useListaBurger = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [listaBurger, setListaBurger] = useState([]);

  const handleListarBurger = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await getCustomerBurgers();
      setListaBurger(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { cargando, error, listaBurger, handleListarBurger };
};
