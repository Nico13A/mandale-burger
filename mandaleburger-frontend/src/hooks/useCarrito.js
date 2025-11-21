import { useState, useEffect } from "react";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  checkoutCart,
  clearCart,
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
  const agregarItem = async ({ promotionId = null, customBurgerId = null, quantity = 1 }) => {
    setLoading(true);
    try {
      const data = await addItemToCart({ promotionId, customBurgerId, quantity });
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar ítem
  const eliminarItem = async (itemId) => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      const updatedItems = prevCart.items.filter(item => item.id !== itemId);
      const nuevoTotal = updatedItems.reduce(
        (acc, item) => acc + item.total_price,
        0
      );
      return { ...prevCart, items: updatedItems, total_price: nuevoTotal };
    });

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
            total_price: nuevaCantidad * parseFloat(
              item.promotion?.price ?? item.custom_burger?.total_price ?? 0
            ),
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

  // Vaciar carrito
  const vaciarCarrito = async () => {
    setCart((prevCart) => {
      if (!prevCart) return prevCart;
      return { ...prevCart, items: [], total_price: 0 };
    });

    try {
      await clearCart();
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  // Checkout: crear orden y vaciar carrito
  const realizarCheckout = async (pickup_date, pickup_time) => {
    setLoading(true);
    try {
      const data = await checkoutCart({pickup_date, pickup_time});
      setCart({ ...cart, items: [], total_price: 0 });
      return data;
    } catch (err) {
      setError(err.message);
      fetchCart();
      throw err;
    } finally {
      setLoading(false);
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
    realizarCheckout,
  };
};
