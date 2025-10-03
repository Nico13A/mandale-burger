import { useState, useEffect } from "react";
import {
  getClientesActivos,
  getClientesInactivos,
  activarCliente,
  bajaCliente,
  editarCliente
} from "../services/clientes";

export const useClientes = () => {
  const [clientesActivos, setClientesActivos] = useState([]);
  const [clientesInactivos, setClientesInactivos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingAction, setLoadingAction] = useState({ id: null, action: "" });
  const [error, setError] = useState(null);

  // ------------------ FETCH CLIENTES ------------------
  const fetchClientes = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const activos = await getClientesActivos();
      const inactivos = await getClientesInactivos();
      setClientesActivos(activos);
      setClientesInactivos(inactivos);
    } catch (err) {
      setError(err.message || "Error al obtener clientes");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // ------------------ ACTIVAR CLIENTE ------------------
  const handleActivate = async (id) => {
    setLoadingAction({ id, action: "activar" });
    setError(null);
    try {
      await activarCliente(id);
      const cliente = clientesInactivos.find(c => c.id === id);
      if (cliente) {
        setClientesInactivos(prev => prev.filter(c => c.id !== id));
        const clienteActivo = { ...cliente, is_active: true };
        setClientesActivos(prev => [...prev, clienteActivo]);
      }
    } catch (err) {
      setError(err.message || "Error al activar cliente");
      throw err;
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  // ------------------ DAR DE BAJA CLIENTE ------------------
  const handleDeactivate = async (id) => {
    setLoadingAction({ id, action: "eliminar" });
    setError(null);
    try {
      await bajaCliente(id);
      const cliente = clientesActivos.find(c => c.id === id);
      if (cliente) {
        setClientesActivos(prev => prev.filter(c => c.id !== id));
        const clienteInactivo = { ...cliente, is_active: false }; 
        setClientesInactivos(prev => [...prev, clienteInactivo]);
      }
    } catch (err) {
      setError(err.message || "Error al dar de baja cliente");
      throw err;
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  // ------------------ EDITAR CLIENTE ------------------
  const handleUpdate = async (id, data) => {
    setLoadingAction({ id, action: "editar" });
    setError(null);
    try {
      await editarCliente(id, data);
      await fetchClientes();
    } catch (err) {
      setError(err.message || "Error al editar cliente");
      throw err;
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  return {
    clientesActivos,
    clientesInactivos,
    loadingList,
    loadingAction,
    error,
    fetchClientes,
    handleActivate,
    handleDeactivate,
    handleUpdate
  };
};


