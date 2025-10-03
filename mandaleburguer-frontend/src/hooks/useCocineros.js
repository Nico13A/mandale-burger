import { useState, useEffect, useCallback } from "react";
import {
  getCocinerosActivos,
  getCocinerosInactivos,
  createCocinero,
  updateCocinero,
  deactivateCocinero,
  activateCocinero,
} from "../services/cocinero";

export const useCocineros = () => {
  const [cocinerosActivos, setCocinerosActivos] = useState([]);
  const [cocinerosInactivos, setCocinerosInactivos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [activePagination, setActivePagination] = useState({ count: 0, next: null, previous: null });
  const [inactivePagination, setInactivePagination] = useState({ count: 0, next: null, previous: null });

  // ------------------ OBTENER LISTAS ------------------
  const fetchCocineros = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const activos = await getCocinerosActivos(activePage);
      const inactivos = await getCocinerosInactivos(inactivePage);
      setCocinerosActivos(activos.results);
      setActivePagination({
        count: activos.count,
        next: activos.next,
        previous: activos.previous,
      });
      setCocinerosInactivos(inactivos.results);
      setInactivePagination({
        count: inactivos.count,
        next: inactivos.next,
        previous: inactivos.previous,
      });
    } catch (err) {
      setError(err.message || "Error al obtener cocineros");
    } finally {
      setLoadingList(false);
    }
  }, [activePage, inactivePage]);

  useEffect(() => {
    fetchCocineros();
  }, [fetchCocineros]);

  // ------------------ CREAR ------------------
  const handleCreate = async (formData) => {
    setLoadingAction(true);
    try {
      await createCocinero(formData);
    } catch (err) {
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------ ACTUALIZAR ------------------
  const handleUpdate = async (id, data) => {
    setLoadingAction(id);
    setError(null);
    try {
      await updateCocinero(id, data);
    } catch (err) {
      setError(err.response?.data || "Error al actualizar cocinero");
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------ DESACTIVAR (BORRADO LÓGICO) ------------------
  const handleDeactivate = async (id) => {
    setLoadingAction(id);
    setError(null);

    const result = await deactivateCocinero(id);

    if (result.success) {
      const cocinero = cocinerosActivos.find(c => c.id === id);
      if (cocinero) {
        setCocinerosActivos(prev => prev.filter(c => c.id !== id));
        setCocinerosInactivos(prev => [...prev, cocinero]);
      }
    } else {
      setError(result.error);
    }

    setLoadingAction(null);
  };


  // ------------------ ACTIVAR ------------------
  const handleActivate = async (id) => {
    setLoadingAction(id);
    setError(null);
    try {
      await activateCocinero(id);
      const cocinero = cocinerosInactivos.find(c => c.id === id);
      if (cocinero) {
        setCocinerosInactivos(prev => prev.filter(c => c.id !== id));
        setCocinerosActivos(prev => [...prev, cocinero]);
      }
    } catch (err) {
      setError(err.message || "Error al activar cocinero");
      throw err;
    } finally {
      setLoadingAction(null);
    }
  };

  // ------------------ PAGINACIÓN ------------------
  const goToActivePage = (page) => setActivePage(page);
  const goToInactivePage = (page) => setInactivePage(page);

  return {
    cocinerosActivos,
    cocinerosInactivos,
    loadingList,
    loadingAction,
    error,
    activePagination,
    inactivePagination,
    fetchCocineros,
    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleActivate,
    goToActivePage,
    goToInactivePage,
  };
};
