import { useEffect, useState } from "react";
import { useMenuBurgers } from "../../hooks/useMenuBurgers";
import { CheckIcon, Eye } from "lucide-react";
import Buscador from "../../components/Buscador/Buscador";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

const MenuBurgers = () => {
    const navigate = useNavigate();

    const {
        burgers,
        cargando,
        error,
        paginacion,
        obtenerBurgers,
        irAPagina,
        buscarLocal,
    } = useMenuBurgers();

    // Estados para filtros
    const [busqueda, setBusqueda] = useState("");
    const [vegana, setVegana] = useState(false);
    const [sinTacc, setSinTacc] = useState(false);

    const handleBusqueda = (texto) => {
        setBusqueda(texto);
        if (texto.trim() === "") {
            obtenerBurgers({ page: 1, is_vegan: vegana || undefined, is_gluten_free: sinTacc || undefined });
            return;
        }
        buscarLocal(texto);
    };

    useEffect(() => {
        setBusqueda("");
        const params = {};
        if (vegana) params.is_vegan = true;
        if (sinTacc) params.is_gluten_free = true;
        params.page = 1;
        obtenerBurgers(params);
    }, [vegana, sinTacc]);

    const obtenerPaginaActual = () => {
        if (!paginacion.previous && !paginacion.next) return 1;
        if (!paginacion.previous) return 1;
        const previousUrl = new URL(paginacion.previous);
        const prevPage = Number(previousUrl.searchParams.get("page") || 1);
        return prevPage + 1;
    };

    return (
        <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">

            <h1 className="text-xl md:text-3xl font-semibold mt-6 mb-4">
                Nuestras hamburguesas
            </h1>

            {/* Buscador */}
            <Buscador value={busqueda} onChange={handleBusqueda} />

            <div className="flex justify-end space-x-2 my-3">
                <button
                    onClick={() => setVegana(!vegana)}
                    className={`px-4 py-2 rounded-full font-semibold tracking-wider text-white transition-all cursor-pointer 
                        ${vegana ? "bg-gris-boton" : "bg-naranja-boton hover:bg-naranja-boton-hover"}
                    `}
                >
                    {vegana ? (
                        <span className="flex items-center gap-1">
                            <CheckIcon className="h-4 w-4" /> Vegana
                        </span>
                    ) : "Vegana"}
                </button>

                <button
                    onClick={() => setSinTacc(!sinTacc)}
                    className={`px-4 py-2 rounded-full font-semibold tracking-wider text-white transition-all cursor-pointer 
                        ${sinTacc ? "bg-gris-boton" : "bg-naranja-boton hover:bg-naranja-boton-hover"}
                    `}
                >
                    {sinTacc ? (
                        <span className="flex items-center gap-1">
                            <CheckIcon className="h-4 w-4" /> Sin TACC
                        </span>
                    ) : "Sin TACC"}
                </button>
            </div>

            {/* Contenido */}
            {cargando ? (
                <Loading />
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : burgers.length === 0 ? (
                <p className="text-center text-gray-500 text-lg py-10">
                    No se encontraron hamburguesas.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                    {burgers.map((burger) => (
                        <div
                            key={burger.id}
                            className="w-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
                        >
                            <div className="flex justify-center items-center bg-gradient-to-b from-white to-orange-100 overflow-hidden">
                                <img
                                    className="w-full h-48 md:h-75 object-contain transition-transform duration-300 hover:scale-105"
                                    src={burger.img}
                                    alt={burger.name}
                                />
                            </div>

                            <div className="h-2 w-full bg-gradient-to-b from-white via-[#d9d9d9]/30 to-gris-boton"></div>

                            <div className="bg-gris-boton p-4 flex flex-col justify-between flex-1">
                                <h3 className="text-base md:text-lg font-semibold text-white text-center mb-2 tracking-wider truncate">
                                    {burger.name}
                                </h3>

                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-orange-500 text-sm">
                                        ${burger.price}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/client/menuburgers/${burger.id}`)}
                                        className="cursor-pointer bg-naranja-boton hover:bg-naranja-boton-hover text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    disabled={!paginacion.previous || cargando}
                    onClick={() => irAPagina(paginacion.previous)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer w-[140px] font-medium
                        ${paginacion.previous
                            ? "border-naranja-boton text-naranja-boton hover:bg-naranja-boton hover:text-white"
                            : "border-gris-boton text-gray-400 opacity-40"}
                    `}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Anterior
                </button>
                <span className="hidden md:block px-4 py-2.5 text-sm tracking-wider font-semibold bg-gris-boton text-white rounded-xl w-[140px] h-[42px] text-center">
                    Página {obtenerPaginaActual()}
                </span>

                <button
                    disabled={!paginacion.next || cargando}
                    onClick={() => irAPagina(paginacion.next)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer w-[140px] font-medium
                        ${paginacion.next
                            ? "border-naranja-boton text-naranja-boton hover:bg-naranja-boton hover:text-white"
                            : "border-gris-boton text-gray-400 opacity-40"}
                    `}
                >
                    Siguiente
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default MenuBurgers;
