import { useState, useEffect, useMemo } from "react";
import { useOrders } from "../../hooks/useOrders";
import { ChefHat, Clock, CheckCircle, Flame, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

export const CookDashboard = () => {
  const { ordenes, cargando, error, cargarOrdenes } = useOrders();
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  const actualizarOrdenes = () => {
    cargarOrdenes();
    setUltimaActualizacion(new Date());
  };

  useEffect(() => {
    actualizarOrdenes();
  }, []);

  const resumen = useMemo(() => {
    const pendientes = ordenes.filter(o => o.status === "paid").length;
    const enPreparacion = ordenes.filter(o => o.status === "in_progress").length;
    const listos = ordenes.filter(o => o.status === "ready_for_pickup").length;
    return { pendientes, enPreparacion, listos, total: ordenes.length };
  }, [ordenes]);

  if (cargando) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto min-h-[60vh] pb-25 md:p-0">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between mb-8 border-l-4 border-naranja-boton">
        <div className="flex items-center gap-3">
          <ChefHat className="text-naranja-boton w-8 h-8" />
          <h1 className="text-3xl font-bold text-gris-boton">Panel</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Última actualización: {ultimaActualizacion.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            onClick={actualizarOrdenes}
            disabled={cargando}
            className={`cursor-pointer p-2 rounded-full transition ${cargando ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            title={cargando ? "Cargando..." : "Actualizar órdenes"}
          >
            <RefreshCw
              className={`w-5 h-5 transition-transform ${cargando ? "animate-spin text-gray-400" : "text-gray-500"
                }`}
            />
          </button>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition-all border-t-4 border-yellow-400">
          <Clock className="text-yellow-400 w-7 h-7 mb-3" />
          <h2 className="text-gray-600 text-sm font-semibold uppercase">Pendientes</h2>
          <p className="text-4xl font-bold text-yellow-500 mt-1">{resumen.pendientes}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition-all border-t-4 border-blue-500">
          <Flame className="text-blue-500 w-7 h-7 mb-3" />
          <h2 className="text-gray-600 text-sm font-semibold uppercase">En preparación</h2>
          <p className="text-4xl font-bold text-blue-600 mt-1">{resumen.enPreparacion}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition-all border-t-4 border-green-500">
          <CheckCircle className="text-green-500 w-7 h-7 mb-3" />
          <h2 className="text-gray-600 text-sm font-semibold uppercase">Listos</h2>
          <p className="text-4xl font-bold text-green-600 mt-1">{resumen.listos}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition-all border-t-4 border-gray-400">
          <ChefHat className="text-gray-400 w-7 h-7 mb-3" />
          <h2 className="text-gray-600 text-sm font-semibold uppercase">Total pedidos hoy</h2>
          <p className="text-4xl font-bold text-gray-800 mt-1">{resumen.total}</p>
        </div>
      </div>

      {/* CTA a pedidos usando Link */}
      <div className="mt-10 text-center">
        <Link
          to="/cook/pedidos"
          className="inline-block bg-naranja-boton hover:bg-naranja-boton-hover text-white font-semibold py-3 px-8 rounded-xl shadow transition"
        >
          Ver pedidos activos
        </Link>
      </div>
    </div>
  );
};

export default CookDashboard;



