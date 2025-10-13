import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { listPublications } from "../../services/posts";

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
  const [items, setItems] = useState([]);
  const { pathname } = useLocation();
  const base = pathname.startsWith("/admin") ? "/admin" : "/client";

  useEffect(() => {
    (async () => {
      try {
        const data = await listPublications();
        setItems(data);
      } catch (e) {
        console.error(e);
        alert("Error cargando publicaciones");
      }
    })();
  }, []);

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-2xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      <h1 className="text-xl font-bold mb-4 text-center">Burgers Creadas</h1>

      <ul className="flex flex-col items-center gap-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="group flex items-center gap-4 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 md:px-6 md:py-4 hover:bg-gray-100 hover:border-gray-400 transition"
          >
            {/* Miniatura */}
            <div className="h-16 w-16 md:h-20 md:w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Texto */}
            <div className="min-w-0 flex-1">
              <h3 className="text-gray-900 font-semibold text-base md:text-lg truncate">{p.title}</h3>
              <p className="text-xs md:text-sm text-gray-600">
                {p.user_display} — {new Date(p.publication_date).toLocaleString("es-AR")}
              </p>
              {p.description && <p className="mt-2 text-sm text-gray-700">{p.description}</p>}
            </div>

            {/* Acciones derecha */}
            <div className="ml-3 md:ml-6 h-16 md:h-20 flex items-center gap-3">
              <div className="scale-90 md:scale-100">
                <Stars value={p.rating ?? 4} />
              </div>
              <Link className="text-blue-600 underline hover:no-underline text-sm md:text-base" to={`${base}/posts/${p.id}`}>
                Ver burger
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
