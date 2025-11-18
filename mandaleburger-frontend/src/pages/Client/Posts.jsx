import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useListaPost } from "../../hooks/useListPost"
import Loading from "../../components/Loading/Loading";

function Stars({ value = 0, max = 5 }) {
  const v = Math.max(0, Math.min(max, Math.round(value)));
  return (
    <div className="flex gap-1 mt-2">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < v ? "fill-yellow-400" : "fill-gray-300"}`}>
          <path d="M10 15.27 15.18 18l-1.64-5.27L18 8.99l-5.38-.01L10 3.5 7.38 8.98 2 8.99l4.46 3.74L4.82 18z" />
        </svg>
      ))}
    </div>
  );
}

export default function Posts() {
  const {
    listaPost,
    cargando,
    error,
    handleListarPost,
    paginaActual,
    totalPaginas,
    irPaginaAnterior,
    irPaginaSiguiente,
  } = useListaPost();

  useEffect(() => {
    handleListarPost(1);
  }, [handleListarPost]);

  if (cargando) return <Loading />;
  if (error) return <div className="p-4 text-red-600">Error: {String(error.message || error)}</div>;

  const postsArray = Array.isArray(listaPost)
    ? listaPost
    : listaPost?.results || [];

  const { pathname } = useLocation();
  const base = pathname.startsWith("/admin") ? "/admin" : "/client";

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      <h1 className="text-xl md:text-3xl font-semibold mt-6 mb-4">
        Burgers publicadas
      </h1>

      <ul className="flex flex-col gap-3 w-full">
        {postsArray.map((p) => (
          <li
            key={p.id}
            className="group flex items-center gap-4 rounded-xl border border-gray-300 bg-black
                px-4 py-4 md:px-5 md:py-3 hover:bg-[#212121] hover:border-gray-400 transition
                h-32 md:h-36 overflow-hidden"
          >
            {/* Miniatura */}
            <div
              className="h-24 w-24 md:h-28 md:w-28 flex-shrink-0
                          rounded-lg bg-gradient-to-b from-white to-orange-100 overflow-hidden
                          flex items-center justify-center"
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="h-full w-auto object-contain object-center"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>


            {/* Texto */}
            <div className="min-w-0 basis-0 flex-1">
              <h3 className="w-full truncate leading-tight text-white font-semibold text-base md:text-lg">
                {p.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                {p.user_display}  {new Date(p.publication_date).toLocaleString("es-AR")}
              </p>
              {p.description && <p className="mt-2 text-sm text-white line-clamp-1">{p.description}</p>}
            </div>

            {/* Acciones derecha */}
            <div className="ml-3 md:ml-6 h-16 md:h-20 flex items-center gap-3 shrink-0"> {/* <- shrink-0 */}
              <div className="scale-90 md:scale-100">
                <Stars value={p.average_score ?? 3} />
              </div>
              <Link className="text-gray-300 underline hover:no-underline text-sm md:text-base" to={`${base}/posts/${p.id}`}>
                Ver burger
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {/* Controles de paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={irPaginaAnterior}
            disabled={paginaActual === 1}
            className="px-3 py-1 rounded-full border text-sm disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={irPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 rounded-full border text-sm disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
