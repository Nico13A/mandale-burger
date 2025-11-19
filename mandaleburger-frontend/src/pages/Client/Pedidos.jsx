import { useEffect } from "react";
import { useOrders } from "../../hooks/useOrders";
import Loading from "../../components/Loading/Loading";

const Pedidos = () => {
    const { ordenes, cargando, error, cargarOrdenes } = useOrders();

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            paid: "bg-red-500",
            in_progress: "bg-blue-100 text-blue-800 border-blue-200",
            ready_for_pickup: "bg-green-100 text-green-800 border-green-200",
            picked_up: "bg-gray-100 text-gray-800 border-gray-200",
            cancelled: "bg-red-100 text-red-800 border-red-200",
        };
        return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    const statusText = {
        pending: "Pendiente",
        paid: "Pagado",
        in_progress: "En proceso",
        ready_for_pickup: "Listo para retirar",
        picked_up: "Retirado",
        cancelled: "Cancelado",
    };

    if (cargando) return <Loading />;
    if (error) return <p className="text-center text-red-500 mt-4">Error: {error}</p>;

    return (
        <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
            <h1 className="text-xl md:text-3xl font-semibold mt-6 mb-4">Mis pedidos</h1>
            {ordenes.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                    <p className="text-gray-600 text-lg">Todavía no realizaste ningún pedido.</p>
                    <p className="text-gray-500 text-sm mt-2">Cuando hagas tu primer pedido, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {ordenes.map((orden) => (
                        <div
                            key={orden.id}
                            className="bg-gris-boton border text-white border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg">
                                            Orden #{orden.id}
                                        </h3>
                                        <span
                                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                orden.status
                                            )}`}
                                        >
                                            {statusText[orden.status.toLowerCase()] || orden.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {new Intl.DateTimeFormat("es-AR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hourCycle: "h23",
                                            timeZone: "America/Argentina/Buenos_Aires",
                                        }).format(new Date(orden.created_at))} hs
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-200 mb-1">Total</p>
                                    <p className="font-bold text-xl text-naranja-boton">
                                        ${orden.total_price}
                                    </p>
                                </div>
                            </div>

                            {orden.items && orden.items.length > 0 && (
                                <div className="border-t border-gray-700 pt-4">
                                    <h4 className="text-sm font-medium text-gray-200 mb-3">Productos</h4>
                                    <ul className="space-y-2">
                                        {orden.items.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex justify-between items-center bg-black rounded-lg p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="border border-gray-800 rounded-md px-2 py-1 text-sm font-medium text-gray-500 min-w-10 flex justify-center">
                                                        {item.quantity}×
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {item.item_type === "promotion"
                                                            ? item.promotion.name
                                                            : item.custom_burger.custom_name}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-500">
                                                    ${item.total_price}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Pedidos;