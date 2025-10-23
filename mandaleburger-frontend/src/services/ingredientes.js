import api from "./api";

const ENDPOINTS = {
  INGREDIENTS_LIST: "/api/ingredients/",
  INGREDIENTS_CRUD: "/api/ingredients-crud/",
};


// ------------------ LISTAR CATEGORIAS CON INGREDIENTES ------------------
export const getIngredients = async (filters = {}) => {
  try {
    const res = await api.get(ENDPOINTS.INGREDIENTS_LIST, { params: filters });
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudieron obtener los ingredientes.";
    throw new Error(mensaje);
  }
};


// ------------------ LISTAR TODOS LOS INGREDIENTES ------------------
export const getIngredientsCRUD = async () => {
  try {
    const res = await api.get(ENDPOINTS.INGREDIENTS_CRUD);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudieron obtener los ingredientes.";
    throw new Error(mensaje);
  }
};


// ------------------ CREAR INGREDIENTE ------------------
export const createIngredient = async (ingredientData) => {
  try {
    const res = await api.post(ENDPOINTS.INGREDIENTS_CRUD, ingredientData);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo crear el ingrediente.";
    throw new Error(mensaje);
  }
};


// ------------------ ACTUALIZAR INGREDIENTE ------------------
export const updateIngredient = async (id, ingredientData) => {
  try {
    const res = await api.put(`${ENDPOINTS.INGREDIENTS_CRUD}${id}/`, ingredientData);
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo actualizar el ingrediente.";
    throw new Error(mensaje);
  }
};


// ------------------ BORRAR / DESACTIVAR INGREDIENTE ------------------
export const deleteIngredient = async (id) => {
  try {
    await api.delete(`${ENDPOINTS.INGREDIENTS_CRUD}${id}/`);
    return true;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo eliminar el ingrediente.";
    throw new Error(mensaje);
  }
};


// ------------------ ACTIVAR INGREDIENTE ------------------
export const activateIngredient = async (id) => {
  try {
    const res = await api.patch(`${ENDPOINTS.INGREDIENTS_CRUD}${id}/`, { is_active: true });
    return res.data;
  } catch (err) {
    const mensaje = err.response?.data?.detail || "No se pudo activar el ingrediente.";
    throw new Error(mensaje);
  }
};