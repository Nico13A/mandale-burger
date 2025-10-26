import { useCarrito } from "../../context/CarritoContext";
import Loading from "../../components/Loading/Loading";

const Carrito = () => {
    const { cart, eliminarItem, vaciarCarrito, actualizarCantidad, loading } = useCarrito();

    if (loading) return <Loading />;

    if (!cart || !cart.items || cart.items.length === 0)
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] md:min-h-[60vh]">
                <div className="text-7xl mb-4">🍔</div>
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

    const handleCheckout = () => {
        console.log("Procediendo al pago...");
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 p-0 pb-25 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-naranja-boton to-orange-500 bg-clip-text text-transparent mb-2">
                    Mi Carrito 🛒
                </h1>
                <p className="text-gray-400 text-sm">
                    Hay {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"} en tu pedido
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
                {/* Lista de items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gradient-to-br from-gris-boton to-gris-boton-hover rounded-2xl p-6 border-2 border-gray-800 shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
                                {/* Imagen */}
                                <div className="relative flex-shrink-0 m-auto md:m-0">
                                    <div className="w-28 h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border-2 border-gray-700">
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${item.promotion.img}`}
                                            alt={item.promotion.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-lg mb-1">{item.promotion.name}</h3>
                                        <p className="text-gray-400 text-sm flex items-center gap-2">
                                            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                                                Precio unitario
                                            </span>
                                            <span className="font-semibold text-naranja-boton">
                                                ${item.promotion.price}
                                            </span>
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
                    ))}
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
        </div>
    );
};

export default Carrito;

