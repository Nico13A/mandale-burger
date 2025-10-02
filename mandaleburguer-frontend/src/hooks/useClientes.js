import { useState, useEffect } from "react";
import { getClientesActivos, getClientesInactivos } from "../services/clientes";

export const useClientes = () => {
  const [clientesActivos, setClientesActivos] = useState([]);
  const [clientesInactivos, setClientesInactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const activos = await getClientesActivos();
        const inactivos = await getClientesInactivos();
        setClientesActivos(activos);
        setClientesInactivos(inactivos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  return { clientesActivos, clientesInactivos, loading, error };
};
