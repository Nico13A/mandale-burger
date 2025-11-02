import { useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead } from "../services/notificacion";

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarNotificaciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotificaciones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const marcarComoLeida = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  return { notificaciones, cargando, error, cargarNotificaciones, marcarComoLeida };
};
