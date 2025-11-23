import { useState, useEffect } from "react";
import { createComment } from "../../services/posts";
import { useParams, useNavigate } from "react-router-dom";
import { useObtenerPost } from "../../hooks/useObtenerPost";
import { usePublicationRating } from "../../hooks/useCalificar";
import { useObtenerCalificacionPost } from "../../hooks/useObtenerCalificacion";
import StarRating from "../../components/StarRating/StarRating";
import Loading from "../../components/Loading/Loading";
import { useCarrito } from "../../context/CarritoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner/Spinner";
import { useObtenerBurger } from "../../hooks/useObtenerBurger";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, cargando, error } = useObtenerPost(id);

  const {
    calificaciones,
    cargando: cargandoCalificacion,
    error: errorCalificacion,
    refetchCalificaciones,
  } = useObtenerCalificacionPost(id);

  const {
    score,
    cargando: ratingCargando,
    error: ratingError,
    rate,
  } = usePublicationRating(post?.user_score || 0);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [promedio, setPromedio] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  const { agregarItem, loading } = useCarrito();

  const {
    burger,
    cargando: cargandoBurger,
    error: errorBurger,
  } = useObtenerBurger(post?.custom_burger_id);

  useEffect(() => {
    if (!post) return;
    setComentarios(post.comments || []);
  }, [post]);

  useEffect(() => {
    const total = calificaciones?.length || 0;
    if (total === 0) {
      setPromedio(null);
      return;
    }
    const suma = calificaciones.reduce((acc, r) => acc + r.score, 0);
    const promedioCalculado = (suma / total).toFixed(1);
    setPromedio(promedioCalculado);
  }, [calificaciones]);

  const handleRate = async (newScore) => {
    await rate(post.id, newScore);
    await refetchCalificaciones();
  };

  async function onComment(e) {
    e.preventDefault();
    setSending(true);
    try {
      const nuevoComentario = await createComment(id, text);
      setText("");
      setComentarios((prev) => [...prev, nuevoComentario]);
    } catch (e) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  const handleAgregarAlCarrito = async () => {
    if (!post) return;
    try {
      await agregarItem({
        customBurgerId: post.custom_burger_id,
        quantity: 1,
      });
      toast.success(`${post.title} agregado al carrito!`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo agregar al carrito");
    }
  };

  if (cargando) return <Loading />;
  if (!post) return <p className="text-center text-red-500 mt-4">Error: {error}</p>;

  return (
    <div className="pb-25 md:pb-0 md:px-6 md:mt-6">
      <ToastContainer autoClose={2000} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-[80px] bg-naranja-boton hover:bg-orange-400 focus:ring-orange-500 text-white px-4 py-2 rounded disabled:opacity-60 cursor-pointer flex justify-center"
          >
            <span>Volver</span>
          </button>
          <button
            onClick={handleAgregarAlCarrito}
            className="w-[80px] bg-naranja-boton hover:bg-orange-400 focus:ring-orange-500 text-white py-2 rounded disabled:opacity-60 cursor-pointer flex justify-center"
            disabled={loading}
          >
            <span>{loading ? <Spinner /> : "Pedir"}</span>
          </button>
        </div>

        {/* CONTENEDOR: IMAGEN + INFO */}
        <div className="mt-4 flex flex-col md:flex-row md:items-stretch gap-8">

          {/* Imagen */}
          <figure className="w-full md:w-1/2 flex">
            <div className="p-4 bg-black rounded-xl shadow-sm flex-1 flex items-center justify-center">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="max-h-full w-auto object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Sin imagen
                </div>
              )}
            </div>
          </figure>

          {/* INFO DERECHA */}
          <div className="w-full md:w-1/2 border-2 border-[#FA9A34] rounded-lg p-3 flex flex-col">

            {/* CALIFICACIÓN */}
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm text-black">
                <span className="font-medium">Calificación promedio:</span>
                {promedio ? (
                  <span className="px-2 py-1 rounded bg-gray-800 text-yellow-300 font-semibold">
                    {promedio} / 5
                  </span>
                ) : (
                  <span className="text-gray-400">Aún no hay calificaciones.</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StarRating value={score} onChange={handleRate} />
                {ratingError && <span className="text-xs text-red-400">{ratingError}</span>}
              </div>
            </div>

            {/* TITULO + DESCRIPCIÓN */}
            <figcaption className="mt-5">
              <h1 className="text-3xl font-bold">{post.title}</h1>

              <p className="text-gris-boton mt-2 font-semibold">
                Fecha de publicación:
                <span className="font-normal text-gray-700">
                  {" "}
                  {new Intl.DateTimeFormat("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hourCycle: "h23",
                    timeZone: "America/Argentina/Buenos_Aires",
                  }).format(new Date(post.publication_date))}{" "}
                  hs.
                </span>
              </p>

              {post.description && (
                <p className="mt-2 text-gris-boton whitespace-pre-line font-semibold">
                  Descripción: <span className="font-normal text-gray-700">{post.description}</span>
                </p>
              )}
            </figcaption>

            {/* INGREDIENTES */}
            {cargandoBurger && <Spinner />}
            {errorBurger && <p className="mt-4 text-red-500">{errorBurger}</p>}
            {burger?.ingredients?.length > 0 && (
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Ingredientes:</h3>
                <div className="flex flex-wrap gap-2">
                  {burger.ingredients.map((ing) => (
                    <span
                      key={ing.id}
                      className="px-3 py-1 bg-gris-boton text-gray-100 rounded-full text-sm font-medium shadow-sm"
                    >
                      {ing.ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* COMENTARIOS */}
            <h3 className="font-semibold mt-5">Comentarios:</h3>
            <div className="mt-1 max-h-30 md:max-h-70 overflow-y-auto pr-1">
              <ul className="grid gap-2">
                {comentarios?.map((c) => (
                  <li key={c.id} className="border rounded p-2 bg-white">
                    <p className="text-sm text-gray-600">
                      {c.user_display} —{" "}
                      {new Intl.DateTimeFormat("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hourCycle: "h23",
                        timeZone: "America/Argentina/Buenos_Aires",
                      }).format(new Date(c.comment_date))}{" "}
                      hs
                    </p>
                    <p>{c.comment_text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* NUEVO COMENTARIO */}
            <form onSubmit={onComment} className="grid gap-2 mt-5">
              <textarea
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2"
                placeholder="Escribí tu comentario…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={3}
              />
              <button
                className="w-full bg-naranja-boton hover:bg-naranja-boton-hover text-white px-4 py-2 rounded cursor-pointer"
                disabled={sending}
              >
                {sending ? "Comentando..." : "Comentar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

