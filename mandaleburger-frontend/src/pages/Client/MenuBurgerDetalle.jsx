import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useMenuBurgers } from "../../hooks/useMenuBurgers";
import { X } from "lucide-react";
import { useCarrito } from "../../context/CarritoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MenuBurgerDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        detalleBurger,
        cargando,
        error,
        obtenerDetalleBurger,
    } = useMenuBurgers();
    const { agregarItem, loading } = useCarrito();

    useEffect(() => {
        if (id) obtenerDetalleBurger(id);
    }, [id]);

    const handleAgregarAlCarrito = async () => {
        try {
            await agregarItem({ menuBurgerId: detalleBurger.id, quantity: 1 });
            toast.success(`${detalleBurger.name} agregado al carrito!`);
        } catch (err) {
            console.error(err);
            toast.error("No se pudo agregar al carrito");
        }
    };

    if (cargando) return <Loading />;
    if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;
    if (!detalleBurger) return null;

    const burger = detalleBurger;

    return (
        <div className="pb-25 md:pb-0 md:px-6 md:mt-6">
            <ToastContainer
                autoClose={2000}
            />
            <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 
                      gap-8 items-center bg-gris-boton rounded-2xl shadow-2xl 
                      p-8 md:p-12 border border-gray-700/30">

                {/* BOTÓN CERRAR */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="cursor-pointer absolute top-3 right-3 z-30 h-9 w-9 md:h-10 md:w-10 
                     grid place-items-center bg-gray-800 hover:bg-gray-700 text-white 
                     rounded-full focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label="Cerrar"
                    title="Cerrar"
                >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* Imagen */}
                <div className="flex justify-center h-full">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden 
                        border border-gray-700 shadow-lg bg-white">

                        <div className="absolute -inset-4 rounded-2xl 
                            bg-gradient-to-br from-orange-400/50 to-transparent 
                            blur-4xl opacity-70 pointer-events-none z-0"></div>

                        <img
                            src={burger.img}
                            alt={burger.name}
                            className="w-full h-full object-contain rounded-2xl relative z-20 transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        />
                    </div>
                </div>

                {/* Detalles */}
                <div className="space-y-4">
                    <h1 className="text-xl md:text-3xl font-bold mb-3 text-white leading-tight line-clamp-2">
                        {burger.name}
                    </h1>

                    {/* Descripción */}
                    {burger.description && (
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {burger.description}
                        </p>
                    )}

                    {/* Ingredientes */}
                    <div className="bg-black/20 rounded-2xl p-6 border border-gray-700/50">
                        <h2 className="text-xl font-semibold text-orange-400 mb-4">
                            Ingredientes
                        </h2>

                        <ul className="space-y-3">
                            {(burger.ingredients ?? []).map((i, idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-between items-center border-b border-gray-700 pb-2 text-gray-200 hover:text-white transition-colors"
                                >
                                    <span className="text-sm">{i.ingredient_name}</span>
                                    <span className="font-semibold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-sm">
                                        x{i.quantity ?? 1}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between gap-4 flex-wrap bg-black/20 rounded-2xl p-5 border border-gray-700/30">
                        <div>
                            <p className="text-2xl font-bold text-white">${burger.price}</p>
                        </div>
                        <button 
                            className="cursor-pointer bg-naranja-boton hover:bg-naranja-boton-hover text-white font-semibold px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                            disabled={loading}
                            onClick={handleAgregarAlCarrito}
                        >
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


