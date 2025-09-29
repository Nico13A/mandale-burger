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

  // ------------------ OBTENER LISTAS ------------------
  const fetchCocineros = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const activos = await getCocinerosActivos();
      const inactivos = await getCocinerosInactivos();
      setCocinerosActivos(activos);
      setCocinerosInactivos(inactivos);
    } catch (err) {
      setError(err.message || "Error al obtener cocineros");
    } finally {
      setLoadingList(false);
    }
  }, []);

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


  return {
    cocinerosActivos,
    cocinerosInactivos,
    loadingList,
    loadingAction,
    error,
    fetchCocineros,
    handleCreate,
    handleUpdate,
    handleDeactivate,
    handleActivate,
  };
};
