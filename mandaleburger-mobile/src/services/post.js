import { api } from "./api";

const ENDPOINTS = {
  PUBLICATIONS_LIST: "/api/publications/",
  PUBLICATION_CREATE: "/api/publications/create/",
  PUBLICATION_DETAIL: (id) => `/api/publications/${id}/`,
  PUBLICATION_COMMENTS_LIST: (id) => `/api/publications/${id}/comments/`,
  PUBLICATION_COMMENT_CREATE: (id) => `/api/publications/${id}/comments/create/`,
  PUBLICATION_RATING_SET: (id) => `/api/publications/${id}/rating/`,
  PUBLICATION_RATINGS_BY_POST: (id) => `/api/publications/${id}/ratings/`,
};

// ------------------- LISTAR PUBLICACIONES -----------------------
export const listPublications = async (params = {}) => {
  try {
    const res = await api.get(ENDPOINTS.PUBLICATIONS_LIST, {
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
    const res = await api.get(ENDPOINTS.PUBLICATION_DETAIL(id));
    return res.data;
  } catch (err) {
    const mensaje =
      err.response?.data?.detail || "No se pudo obtener la publicación.";
    throw new Error(mensaje);
  }
};

// ------------------ CREAR PUBLICACIÓN ------------------
export const createPublication = async (data) => {
  try {
    const res = await api.post(ENDPOINTS.PUBLICATION_CREATE, data);
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear la publicación."] };
  }
};

// ------------------ COMENTARIOS: LISTAR ------------------
export const getPublicationComments = async (publicationId) => {
  try {
    const res = await api.get(
      ENDPOINTS.PUBLICATION_COMMENTS_LIST(publicationId)
    );
    return res.data; 
  } catch (err) {
    const mensaje =
      err.response?.data?.detail ||
      "No se pudieron obtener los comentarios.";
    throw new Error(mensaje);
  }
};

// ------------------ COMENTARIOS: CREAR ------------------
export const createPublicationComment = async (publicationId, comment_text) => {
  try {
    const res = await api.post(
      ENDPOINTS.PUBLICATION_COMMENT_CREATE(publicationId),
      { comment_text }
    );
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo crear el comentario."] };
  }
};

// ------------------ ACTUALIZAR CALIFICACION ------------------
export const setPublicationRating = async (publicationId, score) => {
  try {
    const res = await api.post(
      ENDPOINTS.PUBLICATION_RATING_SET(publicationId),
      { score }
    );
    return res.data;
  } catch (err) {
    if (err.response?.data) throw err.response.data;
    throw { non_field_errors: ["No se pudo guardar la calificación."] };
  }
};

