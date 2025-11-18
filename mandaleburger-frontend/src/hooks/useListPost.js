import { useState,useCallback  } from "react";
import { listPublications } from "../services/posts";

export const useListaPost = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [listaPost, setListaPost] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const PAGE_SIZE = 10;

  const handleListarPost = useCallback(
    async (pagina = 1) => {
      setCargando(true);
      setError(null);
      try {
        const res = await listPublications({
          page: pagina,
          page_size: PAGE_SIZE,
        });

        setListaPost(res || null);

        const total = res?.count ?? 0;
        const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;

        setPaginaActual(pagina);
        setTotalPaginas(totalPages);

        return res;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setCargando(false);
      }
    },
    []
  );

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      handleListarPost(paginaActual + 1);
    }
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) {
      handleListarPost(paginaActual - 1);
    }
  };

  return {
    cargando,
    error,
    listaPost,
    handleListarPost,
    paginaActual,
    totalPaginas,
    irPaginaSiguiente,
    irPaginaAnterior,
  };
};