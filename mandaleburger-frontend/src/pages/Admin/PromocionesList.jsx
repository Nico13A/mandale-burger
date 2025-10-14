import { useNavigate } from "react-router-dom";

const PromocionesList = ({ promociones, onActivate, onDeactivate }) => {

    const navigate = useNavigate();

    if (!promociones) return null;

    if (promociones.length === 0) {
        return <p className="text-gray-500 mt-4">No hay promociones disponibles.</p>;
    }

    return (
        <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Promociones actuales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {promociones.map((promo) => (
                    <div
                        key={promo.id}
                        className="flex flex-col justify-between border border-gray-300 rounded-2xl p-6 shadow hover:shadow-md transition-all"
                    >
                        <div>
                            {promo.img && (
                                <img
                                    src={promo.img}
                                    alt={promo.name}
                                    className="h-40 object-cover rounded mb-2 mx-auto"
                                />
                            )}
                            <h3 className="text-lg md:text-xl font-extrabold mb-2">{promo.name}</h3>
                            <p className="text-sm md:text-base text-gray-500 mb-2">{promo.description}</p>
                            <p className="text-sm md:text-base font-semibold">
                                Precio: <span className="text-naranja-boton">${promo.price}</span>
                            </p>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate(`/admin/promociones/editar/${promo.id}`)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-sm md:text-base cursor-pointer"
                            >
                                Editar
                            </button>

                            {promo.is_active ? (
                                <button
                                    onClick={() => onDeactivate(promo.id)}
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-sm md:text-base cursor-pointer"
                                >
                                    Baja
                                </button>
                            ) : (
                                <button
                                    onClick={() => onActivate(promo.id)}
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm md:text-base cursor-pointer"
                                >
                                    Alta
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PromocionesList;


