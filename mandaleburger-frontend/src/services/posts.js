import api from "./api";

const ENDPOINTS = {
  LIST: "/api/publications/",
  CREATE: "/api/publications/create/",
  DETAIL: (id) => `/api/publications/${id}/`,
  EDIT:   (id) => `/api/publications/${id}/edit/`,
  DELETE: (id) => `/api/publications/${id}/delete/`,
  COMMENTS_LIST:  (id) => `/api/publications/${id}/comments/`,
  COMMENT_CREATE: (id) => `/api/publications/${id}/comments/create/`,
  RATING_SET:   (id) => `/api/publications/${id}/rating/`,
  RATINGS_BY_POST: (id) => `/api/publications/${id}/ratings/`,  
};

// -------------------LISTAR PUBLICACIONES-----------------------
export const listPublications = async (params = {}) => {
  try {
    const res = await api.get(ENDPOINTS.LIST, {
      params,             
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      "No se pudieron obtener las publicaciones.";
    throw new Error(msg);
  }
};
// ------------------ OBTENER PUBLICACIÓN POR ID ------------------
export const getPublicationById = async (id) => {
  try {
    const res = await api.get(ENDPOINTS.DETAIL(id));
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.detail || "No se pudo obtener la publicación.";
    throw new Error(msg);
  }
};

// ------------------ CREAR PUBLICACIÓN ------------------
// Acepta objeto o FormData. (Si usas FormData, no seteés Content-Type manualmente)
export const createPublication = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear la publicación."] };
  }
};

// ------------------ EDITAR PUBLICACIÓN ------------------
// PATCH parcial por defecto; cambialo a PUT si necesitás reemplazo total
export const updatePublication = async (id, data) => {
  try {
    const res = await api.patch(ENDPOINTS.EDIT(id), data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo actualizar la publicación."] };
  }
};

// ------------------ ELIMINAR PUBLICACIÓN ------------------
export const deletePublication = async (id) => {
  try {
    await api.delete(ENDPOINTS.DELETE(id));
    return true;
  } catch (err) {
    const msg = err.response?.data?.detail || "No se pudo eliminar la publicación.";
    throw new Error(msg);
  }
};

// ------------------ COMENTARIOS: LISTAR ------------------
export const listComments = async (publicationId) => {
  try {
    const res = await api.get(ENDPOINTS.COMMENTS_LIST(publicationId));
    return res.data; // asume array de comentarios
  } catch (err) {
    const msg = err.response?.data?.detail || "No se pudieron obtener los comentarios.";
    throw new Error(msg);
  }
};

// ------------------ COMENTARIOS: CREAR ------------------
export const createComment = async (publicationId, comment_text) => {
  try {
    const res = await api.post(ENDPOINTS.COMMENT_CREATE(publicationId), { comment_text });
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear el comentario."] };
  }
};

// ------------------ CALIFICAR PUBLICACIÓN (crear/actualizar rating) ------------------
export const setPublicationRating = async (publicationId, score) => {
  try {
    const res = await api.post(ENDPOINTS.RATING_SET(publicationId), { score });
    return res.data; 
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo guardar la calificación."] };
  }
};

// ------------------ LISTAR CALIFICACIONES DE UNA PUBLICACIÓN ------------------
export const listRatingsByPublication = async (publicationId) => {
  try {
    const res = await api.get(ENDPOINTS.RATINGS_BY_POST(publicationId));
    return res.data; 
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      "No se pudieron obtener las calificaciones de la publicación.";
    throw new Error(msg);
  }
};

