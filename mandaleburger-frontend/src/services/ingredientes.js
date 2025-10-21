import api from "./api";

const BASE = "/api/ingredients/"; 
const ENDPOINTS = {
  INGREDIENTS_LIST: BASE,   
   INGREDIENTS_BY_CATEGORY: `${BASE}by-category/`,                        
  INGREDIENT_DETAIL: (id) => `${BASE}${id}/`,      
  ACTIVATE: (id) => `${BASE}${id}/activate/`,      
  DEACTIVATE: (id) => `${BASE}${id}/deactivate/`,  
};

const authHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function rethrowWithMessage(err, fallback) {
  const mensaje = err?.response?.data?.detail || fallback;
  const e = new Error(mensaje);
  e.response = err?.response;
  throw e;
}

// ------------------ LISTAR ------------------
export const getIngredients = async (filters = {}) => {
  try {
    const res = await api.get(ENDPOINTS.INGREDIENTS_LIST, {
     params: filters,
     headers: authHeaders(),
     });
     return res.data;
  } catch (err) {
    rethrowWithMessage(err, "No se pudieron obtener los ingredientes.");
  }
};

// ------------------ OBTENER UNO ------------------
export const getIngredient = async (id) => {
  try {
    const res = await api.get(ENDPOINTS.INGREDIENT_DETAIL(id), {
    headers: authHeaders(),
    })
    return res.data;
  } catch (err) {
    rethrowWithMessage(err, "No se pudo obtener el ingrediente.");
  }
};

// ------------------ CREAR ------------------
export const createIngredient = async (formData) => {
  const res = await api.post(ENDPOINTS.INGREDIENTS_LIST, formData, {
   headers: authHeaders(),
 });
  return res.data;
};

// ------------------ ACTUALIZAR ------------------
export const updateIngredient = async (id, formData) => {
  const res = await api.patch(ENDPOINTS.INGREDIENT_DETAIL(id), formData, {
    headers: authHeaders(),
  });
  return res.data;
};

// ------------------ ELIMINAR ------------------
export const deleteIngredient = async (id) => {
  try {
    await api.delete(ENDPOINTS.INGREDIENT_DETAIL(id), {
     headers: authHeaders(),
   });
    return true;
  } catch (err) {
    rethrowWithMessage(err, "No se pudo eliminar el ingrediente.");
  }
};

// ------------------ ACTIVAR / DESACTIVAR ------------------
export const activateIngredient = async (id) => {
  const res = await api.patch(ENDPOINTS.INGREDIENT_DETAIL(id), { is_active: true }, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deactivateIngredient = async (id) => {
  const res = await api.patch(ENDPOINTS.INGREDIENT_DETAIL(id), { is_active: false }, {
    headers: authHeaders(),
  });
  return res.data;
};

// ------------------ CATEGORÍAS ------------------
export const getCategories = async () => {
  try {
    const res = await api.get("/api/categories/", {
    headers: authHeaders(),
   });
    return res.data;
  } catch (err) {
    rethrowWithMessage(err, "No se pudieron obtener las categorías.");
  }
};
