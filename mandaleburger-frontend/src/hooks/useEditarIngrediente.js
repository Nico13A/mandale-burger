// hooks/useEditarIngrediente.js
import { useState } from "react";
import api from "../services/api"; // tu axios instance
// ⚠️ no tocamos services/auth ni services/api

const TOKENS_KEY = "tokens"; // { access, refresh }

const getTokens = () => {
  try { return JSON.parse(localStorage.getItem(TOKENS_KEY) || "{}"); }
  catch { return {}; }
};
const setTokens = (next) => localStorage.setItem(TOKENS_KEY, JSON.stringify(next));

const authHeader = () => {
  const { access } = getTokens();
  return access ? { Authorization: `Bearer ${access}` } : {};
};

const refreshDirecto = async () => {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No hay refresh token");
  // ⬇️ usa el endpoint correcto de SimpleJWT
  const { data } = await api.post("/api/auth/jwt/refresh/", { refresh });
  if (!data?.access) throw new Error("Refresh sin access");
  const next = { ...getTokens(), access: data.access };
  setTokens(next);
  return data.access;
};

export const useEditarIngrediente = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const editarIngrediente = async (id, payload) => {
    setCargando(true); setError("");
    const config = {
      headers: {
        ...authHeader(),
        ...(payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {}),
      },
    };

    try {
      const { data } = await api.patch(`/api/ingredients/${id}/`, payload, config);
      return data;
    } catch (e) {
      if (e?.response?.status === 401) {
        try {
          await refreshDirecto();
          // reintento con el access nuevo
          const { data } = await api.patch(`/api/ingredients/${id}/`, payload, {
            headers: {
              ...authHeader(),
              ...(payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {}),
            },
          });
          return data;
        } catch (e2) {
          setError("No se pudo editar el ingrediente.");
          throw e2;
        } finally {
          setCargando(false);
        }
      }
      setError("No se pudo editar el ingrediente.");
      throw e;
    } finally {
      setCargando(false);
    }
  };

  return { editarIngrediente, cargando, error };
};
