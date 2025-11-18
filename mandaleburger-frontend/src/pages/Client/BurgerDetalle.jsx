import { useParams, useNavigate } from "react-router-dom";
import { useObtenerBurger } from "../../hooks/useObtenerBurger";
import { useCarrito } from "../../context/CarritoContext";
import Loading from "../../components/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreatePost } from "../../hooks/useCreatePost" 
import { X } from "lucide-react";
const BurgerDetalle = () => {

  const {
    post,
    cargando: cargandoPost,
    error: errorPost,
    handleCreatePost,
  } = useCreatePost();

  const { id } = useParams();
  const { burger, cargando, error } = useObtenerBurger(id);
  const { agregarItem, loading } = useCarrito();
  const navigate = useNavigate(); 

  const handleAgregarAlCarrito = async () => {
    try {
      await agregarItem({ customBurgerId: burger.id, quantity: 1 });
      toast.success(`${burger.custom_name} agregada al carrito!`);
      setTimeout(() => {
      navigate("/client/carrito");
    }, 3500);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo agregar al carrito");
    }
  };
  const esCreador = burger?.is_owner;

  const handlePublicar = async () => {
    if (!esCreador) return;

    try {
      const payload = {
        title: burger.custom_name,
        description: burger.description || "",
        image_url: burger.img,
        custom_burger_id: burger.id,
      };
      await handleCreatePost(payload);
      toast.success("Publicación creada", {
        autoClose: 1500,
        onClose: () => navigate("/client/posts"),
        pauseOnHover: false,
        closeOnClick: true,
      });
    } catch (e) {
      console.error(e);
      toast.error(e?.quota || "Error al publicar");
    }
  };

  if (cargando) return <Loading />;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;
  if (!burger) return null;

  return (
    <div className="pb-25 md:pb-0 md:px-6 md:mt-6">
      <ToastContainer autoClose={2000} />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gris-boton rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700/30">
        <button
          type="button"
          onClick={() => navigate("/client/misburgers")}
          className="absolute top-3 right-3 z-30 h-9 w-9 md:h-10 md:w-10 grid place-items-center
                    bg-gray-800 hover:bg-gray-700 text-white rounded-full
                    focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Cerrar"
          title="Cerrar"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        {/* Imagen */}
        <div className="flex justify-center h-full">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700 shadow-lg bg-white">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-orange-400/50 to-transparent blur-4xl opacity-70 pointer-events-none z-0"></div>
            <img
              src={burger.img}
              alt={burger.custom_name}
              className="w-full h-full object-contain rounded-2xl relative z-20 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-3 text-white leading-tight">
              {burger.name ?? burger.custom_name ?? "(Sin nombre)"}
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              {burger.description}
            </p>
          </div>

          <div className="bg-black/20 rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
              Ingredientes
            </h2>
            <ul className="space-y-3">
              {(burger.ingredients ?? []).map((i) => (
                <li
                  key={i.id}
                  className="flex justify-between items-center border-b border-gray-700 pb-2 text-gray-200 hover:text-white transition-colors"
                >
                  {/* i.ingredient es un string (StringRelatedField) */}
                  <span className="text-sm">{i.ingredient}</span>
                  <span className="font-semibold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-sm">
                    x{i.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap bg-black/20 rounded-2xl p-5 border border-gray-700/30">
            <div>
              <p className="text-2xl font-bold text-white">
                &#36;{burger.price ?? burger.total_price ?? 0}
              </p>
            </div>
            <button
              onClick={handleAgregarAlCarrito}
              disabled={loading}
              className="cursor-pointer bg-naranja-boton hover:bg-naranja-boton-hover text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </div>
          {esCreador && (
            <button
              onClick={handlePublicar}
              disabled={cargandoPost}
              className="cursor-pointer w-full bg-gray-800 
              hover:bg-gray-700 text-white hover:text-white 
              font-bold tracking-wider py-3 rounded-xl transition-all duration-300
               border-2 border-gray-700 hover:border-gray-600"
            >
              {cargandoPost ? "Publicando..." : "Publicar"}
            </button>
          )}
          
          {errorPost?.already_published && <p className="text-red-400 text-sm mt-2">{String(errorPost.already_published)}</p>}
        </div>
      </div>
    </div>
  );
};

export default BurgerDetalle;
