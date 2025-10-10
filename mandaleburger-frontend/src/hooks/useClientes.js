import { useState, useEffect, useCallback } from "react";
import {
  getClientesActivos,
  getClientesInactivos,
  activarCliente,
  bajaCliente,
  editarCliente,
  getClienteById
} from "../services/clientes";

export const useClientes = () => {
  // ------------------ ESTADOS ------------------
  const [clientesActivos, setClientesActivos] = useState([]);
  const [clientesInactivos, setClientesInactivos] = useState([]);
  const [clienteActual, setClienteActual] = useState(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingAction, setLoadingAction] = useState({ id: null, action: "" });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [pageActivos, setPageActivos] = useState(1);
  const [pageInactivos, setPageInactivos] = useState(1);
  const [totalPagesActivos, setTotalPagesActivos] = useState(0);
  const [totalPagesInactivos, setTotalPagesInactivos] = useState(0);

  const pageSize = 10;

  // ------------------ FETCH LISTA CLIENTES ------------------
  const fetchClientes = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const activos = await getClientesActivos(pageActivos, searchTerm);
      const inactivos = await getClientesInactivos(pageInactivos, searchTerm);

      setClientesActivos(activos.results);
      setClientesInactivos(inactivos.results);

      setTotalPagesActivos(Math.ceil(activos.count / pageSize));
      setTotalPagesInactivos(Math.ceil(inactivos.count / pageSize));
    } catch (err) {
      setError(err.message || "Error al obtener clientes");
    } finally {
      setLoadingList(false);
    }
  }, [pageActivos, pageInactivos, searchTerm]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // ------------------ CARGAR CLIENTE POR ID ------------------
  const loadCliente = useCallback(async (id) => {
    setLoadingAction({ id, action: "cargar" });
    setError(null);
    try {
      const data = await getClienteById(id);
      setClienteActual(data);
    } catch (err) {
      setError(typeof err === "object" ? err : { general: "Error al cargar cliente" });
      throw err;
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  }, []);

  // ------------------ ACCIONES ------------------
  const handleActivate = async (id) => {
    setLoadingAction({ id, action: "activar" });
    setError(null);
    try {
      await activarCliente(id);

      const cliente = clientesInactivos.find(c => c.id === id);
      if (cliente) {
        setClientesInactivos(prev => prev.filter(c => c.id !== id));
        setClientesActivos(prev => [...prev, { ...cliente, is_active: true }]);
      }
      if (clientesInactivos.length === 1 && pageInactivos > 1) {
        setPageInactivos(pageInactivos - 1);
      }
      
    } catch (err) {
      setError(typeof err === "object" ? err : { general: "Error al activar cliente" });
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  const handleDeactivate = async (id) => {
    setLoadingAction({ id, action: "eliminar" });
    setError(null);
    try {
      await bajaCliente(id);

      const cliente = clientesActivos.find(c => c.id === id);
      if (cliente) {
        setClientesActivos(prev => prev.filter(c => c.id !== id));
        setClientesInactivos(prev => [...prev, { ...cliente, is_active: false }]);
      }

      if (clientesActivos.length === 1 && pageActivos > 1) {
        setPageActivos(pageActivos - 1);
      }
    } catch (err) {
      setError(typeof err === "object" ? err : { general: "Error al dar de baja cliente" });
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingAction({ id, action: "editar" });
    setError(null);
    try {
      await editarCliente(id, data);

      setClientesActivos(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      setClientesInactivos(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      if (clienteActual?.id === id) {
        setClienteActual(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      setError(typeof err === "object" && !Array.isArray(err) ? err : { general: "Error al editar cliente" });
      throw err;
    } finally {
      setLoadingAction({ id: null, action: "" });
    }
  };

  // ------------------ CAMBIO DE PÁGINA ------------------
  const handlePageChangeActivos = (newPage) => setPageActivos(newPage);
  const handlePageChangeInactivos = (newPage) => setPageInactivos(newPage);

  return {
    clientesActivos,
    clientesInactivos,
    clienteActual,
    loadingList,
    loadingAction,
    error,
    searchTerm,
    setSearchTerm,
    pageActivos,
    totalPagesActivos,
    pageInactivos,
    totalPagesInactivos,
    fetchClientes,
    loadCliente,
    handleActivate,
    handleDeactivate,
    handleUpdate,
    handlePageChangeActivos,
    handlePageChangeInactivos,
    setPageActivos,
    setPageInactivos,
  };
};



