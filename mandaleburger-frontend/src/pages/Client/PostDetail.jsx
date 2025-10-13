import { useEffect, useState } from "react";
import { getPublication, createComment } from "../../services/posts";
import { useParams, useNavigate } from "react-router-dom";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    try {
      const data = await getPublication(id);
      setPost(data);
    } catch (e) {
      console.error(e);
      alert("Error cargando el post");
    }
  }
  useEffect(() => { load(); }, [id]);

  async function onComment(e) {
    e.preventDefault();
    setSending(true);
    try {
      await createComment(id, text);
      setText("");
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  if (!post) return <div className="p-4">Cargando…</div>;

  return (
    // Contenedor centrado y con ancho límite real (≈ 700px)
    <div className="mx-auto w-full px-4 md:px-5" style={{ maxWidth: 720 }}>
      {/* Volver */}
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">
        ← Volver
      </button>

      {/* Imagen */}
      <figure className="mx-auto max-w-xl">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Sin imagen
            </div>
          )}
        </div>

        {/* Texto debajo de la imagen */}
        <figcaption className="mt-4">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-gray-600">
            {post.user_display} — {new Date(post.publication_date).toLocaleString("es-AR")}
          </p>
          {post.description && (
            <p className="mt-2 text-gray-800 whitespace-pre-line">{post.description}</p>
          )}
        </figcaption>
      </figure>

      {/* Comentarios */}
      <h3 className="font-semibold mt-6">Comentarios</h3>
      <ul className="grid gap-2">
        {post.comments?.map((c) => (
          <li key={c.id} className="border rounded p-2">
            <p className="text-sm text-gray-600">
              {c.user_display} — {new Date(c.comment_date).toLocaleString("es-AR")}
            </p>
            <p>{c.comment_text}</p>
          </li>
        ))}
      </ul>

      {/* Nuevo comentario */}
      <form onSubmit={onComment} className="grid gap-2 mt-4">
        <textarea
          className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Escribí tu comentario…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
        />
        <button
          className="w-full bg-naranja-boton hover:bg-orange-600 focus:ring-orange-500 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={sending}
        >
          {sending ? "Comentando..." : "Comentar"}
        </button>
      </form>
    </div>
  );
}
