import api from "./api";

 /*Obtiene la lista de publicaciones desde el backend.*/
export async function listPublications(page = 1) {
  const { data } = await api.get(`/api/publications/?page=${page}`);
  return Array.isArray(data) ? data : (data.results || []);
}
 /*Obtiene el detalle de una publicación por ID*/
export async function getPublication(id) {
  const { data } = await api.get(`/api/publications/${id}/`);
  return data;
}
 /*Crea una nueva publicación*/
export async function createPublication({ title, description, file, custom_burger_id }) {
  const form = new FormData();
  form.append("title", title);
  if (description) form.append("description", description);
  if (custom_burger_id) form.append("custom_burger_id", custom_burger_id);
  if (file) form.append("image", file); 

  const { data } = await api.post(`/api/publications/`, form);
  return data;
}
/*Crea una nueva Comentario*/
export async function createComment(publicationId, comment_text) {
  const { data } = await api.post(
    `/api/publications/${publicationId}/comments/`,
    { comment_text }
  );
  return data;
}