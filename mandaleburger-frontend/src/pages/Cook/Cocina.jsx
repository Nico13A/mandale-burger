import { useEffect } from "react";
import Loading from "../../components/Loading/Loading";
import { CookingPot, UtensilsCrossed, Check, Circle } from "lucide-react";
import { useCocinaOrders } from "../../hooks/useCocinaOrders";

const Cocina = () => {
    const { ordenes, cargando, error, cargarOrdenesCocina } = useCocinaOrders();
    console.log(ordenes);


    useEffect(() => {
        cargarOrdenesCocina();
    }, []);

    if (cargando) return <Loading />;
    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                <p>Error: {error}</p>
            </div>
        );

    // Filtramos las órdenes en preparación
    const enPreparacion = ordenes.filter(o => o.status === "in_progress");

    return (
        <div className="max-w-6xl mx-auto min-h-[60vh] pb-25 md:p-0">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border-l-4 border-naranja-boton">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-gris-boton">
                    <CookingPot className="text-naranja-boton w-8 h-8" />
                    Cocina - En preparación
                </h1>
                <p className="text-gray-400 mt-2">
                    Pedidos activos en cocina:{" "}
                    <span className="font-semibold text-orange-400">{enPreparacion.length}</span>
                </p>
            </div>

            {enPreparacion.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
                    <Check className="w-20 h-20 text-green-500 mb-4" />
                    <p className="text-gray-500 text-xl font-medium">
                        ¡No hay pedidos en preparación!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {enPreparacion.map((orden) => (
                        <div
                            key={orden.id}
                            className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                <h2 className="text-xl font-bold">Orden #{orden.id}</h2>
                            </div>
                            {orden.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gris-boton rounded-lg p-4 mb-4 border border-gray-200"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <UtensilsCrossed className="text-naranja-boton w-5 h-5" />
                                            <h3 className="font-semibold text-naranja-boton">
                                                {item.quantity}× {item.promotion.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Ingredientes */}
                                    {item.promotion.ingredients ? (
                                        <ul className="text-sm text-gray-300 pl-6 list-disc">
                                            {item.promotion.ingredients.map((ing) => (
                                                <li key={ing.id} className="flex items-center gap-2">
                                                    <Circle className="w-3 h-3 text-green-500" />
                                                    {ing.quantity}× {ing.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-300 text-sm italic pl-6">
                                            (Sin detalles de ingredientes)
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cocina;
