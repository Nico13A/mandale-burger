import api from "./api";

const ENDPOINTS = {
  GET_CART: "/api/cart/",
  ADD_ITEM: "/api/cart/add_item/",
  REMOVE_ITEM: "/api/cart/remove_item/",
  UPDATE_QUANTITY: "/api/cart/update_quantity/",
  CHECKOUT: "/api/cart/checkout/",
  CLEAR_CART: "/api/cart/clear_cart/",
};

// ------------------ OBTENER CARRITO ------------------
export const getCart = async () => {
  try {
    const res = await api.get(ENDPOINTS.GET_CART);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "No se pudo obtener el carrito."
    );
  }
};

// ------------------ AGREGAR ÍTEM ------------------
export const addItemToCart = async ({ promotionId = null, customBurgerId = null, quantity = 1 }) => {
  try {
    const body = {
      quantity,
      ...(promotionId ? { promotion_id: promotionId } : {}),
      ...(customBurgerId ? { custom_burger_id: customBurgerId } : {}),
    };
    const res = await api.post(ENDPOINTS.ADD_ITEM, body);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "No se pudo agregar el ítem al carrito."
    );
  }
};

// ------------------ ELIMINAR ÍTEM ------------------
export const removeItemFromCart = async (itemId) => {
  try {
    const res = await api.post(ENDPOINTS.REMOVE_ITEM, { item_id: itemId });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "No se pudo eliminar el ítem del carrito."
    );
  }
};

// ------------------ ACTUALIZAR CANTIDAD ------------------
export const updateCartItemQuantity = async (itemId, quantity) => {
  try {
    const res = await api.post(ENDPOINTS.UPDATE_QUANTITY, {
      item_id: itemId,
      quantity,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "No se pudo actualizar la cantidad del ítem."
    );
  }
};

// ------------------ CLEAR CART (Vaciar carrito) ------------------
export const clearCart = async () => {
  try {
    const res = await api.post(ENDPOINTS.CLEAR_CART);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.error || "No se pudo vaciar el carrito."
    );
  }
};

// ------------------ CHECKOUT (VACÍAR CARRITO) ------------------
export const checkoutCart = async ({pickup_date, pickup_time}) => {
  try {
    const res = await api.post(ENDPOINTS.CHECKOUT, {
      pickup_date,
      pickup_time
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.error || "No se pudo vaciar el carrito.";
    const detalles = err.response?.data?.detalles || [];
    throw new Error(JSON.stringify({ msg, detalles }));
  }
};
