import { useCarrito } from "../../context/CarritoContext";
import Loading from "../../components/Loading/Loading";
import { useMercadoPagoOrden } from "../../hooks/useMercadoPagoOrden";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Hamburger } from "lucide-react";


const Carrito = () => {
    const { cart, eliminarItem, vaciarCarrito, actualizarCantidad, realizarCheckout, loading } = useCarrito();
    const { pagarOrden } = useMercadoPagoOrden();
    const [errorModal, setErrorModal] = useState(null);

    if (loading) return <Loading />;

    if (!cart || !cart.items || cart.items.length === 0)
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] md:min-h-[60vh]">
                <Hamburger className="w-16 h-16 text-naranja-boton mb-4" />
                <p className="text-xl text-gray-400 font-medium">Tu carrito está vacío</p>
                <p className="text-sm text-gray-600 mt-2">¡Agrega tus hamburguesas favoritas!</p>
            </div>
        );

    const handleIncrement = (id, quantity) => {
        actualizarCantidad(id, quantity + 1);
    };

    const handleDecrement = (id, quantity) => {
        if (quantity > 1) actualizarCantidad(id, quantity - 1);
    };

    const handleDelete = (id) => {
        eliminarItem(id);
    };

    const handleVaciar = () => {
        vaciarCarrito();
    };

    const handleCheckout = async () => {
        try {
            const data = await realizarCheckout();
            await pagarOrden(data.order_id);
        } catch (err) {
            try {
                const { msg, detalles } = JSON.parse(err.message);
                setErrorModal({ msg, detalles });
            } catch (parseError) {
                console.error("Error inesperado:", err);
                setErrorModal({
                    msg: "Ocurrió un error inesperado al procesar tu pedido.",
                    detalles: [],
                });
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 p-0 pb-25">
            {/* Header */}
            <div className="mb-8">
                <h1 className="flex items-center gap-4 text-2xl md:text-3xl font-bold bg-gradient-to-r from-naranja-boton to-orange-500 bg-clip-text text-transparent mb-2">
                    Mi carrito
                    <ShoppingCart className="w-7 h-7 text-naranja-boton" />
                </h1>
                <p className="text-gray-400 text-sm">
                    Hay {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"} en tu pedido
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Lista de items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => {
                        const isCustom = !!item.custom_burger; 
                        const name = item.promotion?.name || item.custom_burger?.custom_name || "Burger Personalizada";
                        const img = item.promotion?.img || item.custom_burger?.img || "";
                        const price = item.promotion?.price ?? item.total_price;

                        return (
                            <div
                                key={item.id}
                                className="bg-gradient-to-br from-gris-boton to-gris-boton-hover rounded-2xl p-6 border-2 border-gray-800 shadow-lg"
                            >
                                <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                                    {/* Imagen */}
                                    <div className="relative flex-shrink-0 m-auto md:m-0">
                                        <div className="w-28 h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border-2 border-gray-700">
                                            {img && (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${img}`}
                                                    alt={name}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-white text-lg mb-1 truncate max-w-[200px] md:max-w-[400px]">{name}</h3>

                                            {/* Ingredientes si es custom burger */}
                                            {isCustom && item.custom_burger.ingredients?.length > 0 && (
                                                <ul className="text-gray-400 text-sm">
                                                    {item.custom_burger.ingredients.map((ing, idx) => (
                                                        <li key={idx}>{ing.name || ing.ingredient_name}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                                                    Precio unitario
                                                </span>
                                                <span className="font-semibold text-naranja-boton">${price}</span>
                                            </p>
                                        </div>

                                        {/* Controles cantidad */}
                                        <div className="flex mt-4">
                                            <div className="flex items-center gap-3 bg-gray-800 rounded-full p-1 border border-gray-700">
                                                <button
                                                    onClick={() => handleDecrement(item.id, item.quantity)}
                                                    className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleIncrement(item.id, item.quantity)}
                                                    className="cursor-pointer bg-gradient-to-r bg-naranja-boton hover:bg-naranja-boton-hover text-white w-8 h-8 rounded-full text-lg font-bold transition-all duration-200 hover:scale-110 shadow-md shadow-orange-400/30"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subtotal y eliminar */}
                                    <div className="flex flex-col text-end justify-between">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="cursor-pointer self-end text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/delete"
                                            title="Eliminar producto"
                                        >
                                            <svg
                                                className="w-5 h-5 group-hover/delete:scale-110 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                            <p className="font-bold text-xl text-naranja-boton">${item.total_price}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Resumen */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-gris-boton to-gris-boton-hover rounded-2xl p-6 border-2 border-gray-800 shadow-xl sticky top-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-800">
                            <h2 className="text-xl font-bold text-white">Resumen del pedido</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>Productos ({cart.items.length})</span>
                                <span className="font-semibold text-white">${cart.total_price}</span>
                            </div>
                            <div className="text-gray-300">
                                <span>Se le notificará cuando su pedido esté listo.</span>
                            </div>

                            <div className="border-t-2 border-dashed border-gray-800 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-white">Total</span>
                                    <p className="text-2xl font-bold text-naranja-boton">${cart.total_price}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="cursor-pointer w-full bg-gradient-to-r text-white bg-naranja-boton hover:bg-naranja-boton-hover font-bold py-4 rounded-xl shadow-lg mb-3 flex items-center justify-center gap-2"
                        >
                            <span>Proceder al pago</span>
                        </button>

                        <button
                            onClick={handleVaciar}
                            className="cursor-pointer w-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-all duration-300 border-2 border-gray-700 hover:border-gray-600"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal de error */}
            <AnimatePresence>
                {errorModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setErrorModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-gris-boton to-gris-boton-hover text-white p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-700/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-naranja-boton/20 rounded-full blur-3xl -z-10" />
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-naranja-boton/20 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-naranja-boton" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {errorModal.msg}
                            </h2>

                            <p className="text-gray-400 text-center text-sm mb-6">
                                Los siguientes productos no tienen stock suficiente
                            </p>

                            {errorModal.detalles.length > 0 && (
                                <div className="bg-black/40 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                                    <ul className="space-y-3">
                                        {errorModal.detalles.map((d, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/10 border border-gray-700/50 hover:border-naranja-boton/30 transition-colors"
                                            >
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-naranja-boton flex-shrink-0" />
                                                <div className="flex-1 text-sm">
                                                    <span className="font-semibold text-white block mb-1">
                                                        {d.promotion}
                                                    </span>
                                                    <span className="text-gray-300">
                                                        Sin stock de <span className="text-naranja-boton font-medium">{d.ingredient.toLowerCase()}</span>
                                                    </span>
                                                    <span className="text-gray-500 text-xs block mt-1">
                                                        {d.faltante === 1 ? "Falta 1 unidad" : `Faltan ${d.faltante} unidades`}
                                                    </span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setErrorModal(null)}
                                    className="bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer text-white font-semibold py-2 px-4 rounded-xl"
                                >
                                    Entendido
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Carrito;