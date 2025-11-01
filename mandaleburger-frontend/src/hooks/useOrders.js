import { useState } from "react";
import { getOrders, getOrderDetail, advanceOrderStatus } from "../services/orders";

export const useOrders = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarOrdenes = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await getOrders();
      setOrdenes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerOrden = async (id) => {
    try {
      setCargando(true);
      setError(null);
      const data = await getOrderDetail(id);
      setOrden(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // Actualiza solo la orden que cambió
  const cambiarEstadoOrden = async (orderId, newStatus) => {
    try {
      setError(null);
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((orden) =>
          orden.id === orderId ? { ...orden, status: newStatus } : orden
        )
      );
      await advanceOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError(err.message);
      cargarOrdenes();
    }
  };


  return {
    ordenes,
    orden,
    cargando,
    error,
    cargarOrdenes,
    obtenerOrden,
    cambiarEstadoOrden,
  };
};
