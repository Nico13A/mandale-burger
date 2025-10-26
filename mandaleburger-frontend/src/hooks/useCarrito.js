import { useState, useEffect } from "react";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  checkoutCart,
} from "../services/carrito";

export const useCarrito = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar carrito al iniciar
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Agregar ítem
  const agregarItem = async (promotionId, quantity = 1) => {
    setLoading(true);
    try {
      const data = await addItemToCart(promotionId, quantity);
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ítem
  const eliminarItem = async (itemId) => {
    // 1️⃣ Actualización local inmediata
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const nuevoTotal = updatedItems.reduce(
        (acc, item) => acc + item.total_price,
        0
      );
      return { ...prevCart, items: updatedItems, total_price: nuevoTotal };
    });

    // 2️⃣ Llamada al backend
    try {
      await removeItemFromCart(itemId);
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };


  // Actualizar cantidad
  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    // 1️⃣ Actualización local inmediata (optimista)
    setCart((prevCart) => {
      if (!prevCart) return prevCart;

      const updatedItems = prevCart.items.map((item) =>
        item.id === itemId
          ? {
            ...item,
            quantity: nuevaCantidad,
            total_price: nuevaCantidad * parseFloat(item.promotion.price),
          }
          : item
      );

      const nuevoTotal = updatedItems.reduce(
        (acc, item) => acc + item.total_price,
        0
      );

      return { ...prevCart, items: updatedItems, total_price: nuevoTotal };
    });

    // Sincronización con el backend
    try {
      await updateCartItemQuantity(itemId, nuevaCantidad);
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      setError(err.message);
      fetchCart();
    }
  };

  const vaciarCarrito = async () => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      return { ...prevCart, items: [], total_price: 0 };
    });
    try {
      await checkoutCart();
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    agregarItem,
    eliminarItem,
    actualizarCantidad,
    vaciarCarrito,
  };
};
