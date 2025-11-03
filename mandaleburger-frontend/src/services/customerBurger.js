import api from "./api";

const ENDPOINTS = {
  LIST: "/api/customer-burgers/",
  CREATE: "/api/customer-burgers/create/",
  DETAIL: (id) => `/api/customer-burgers/${id}/`,
  EDIT:   (id) => `/api/customer-burgers/${id}/update/`,
};

// ------------------ LISTAR BURGERS ------------------
export const getCustomerBurgers = async () => {
  try {
    const res = await api.get(ENDPOINTS.LIST);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.detail || "No se pudieron obtener las burgers.";
    throw new Error(msg);
  }
};

// ------------------ CREAR BURGER (CLIENT) ------------------
// data puede ser objeto o FormData (no seteés Content-Type manualmente si es FormData)
export const createCustomerBurger = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear la burger."] };
  }
};

// ------------------ OBTENER BURGER POR ID ------------------
export const getCustomerBurgerById = async (id) => {
  try {
    const res = await api.get(ENDPOINTS.DETAIL(id));
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.detail || "No se pudo obtener la burger.";
    throw new Error(msg);
  }
};

// ------------------ EDITAR BURGER (ADMIN o dueño si habilitás) ------------------
export const updateCustomerBurger = async (id, data) => {
  try {
    const res = await api.patch(ENDPOINTS.EDIT(id), data); // PATCH parcial
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo actualizar la burger."] };
  }
};