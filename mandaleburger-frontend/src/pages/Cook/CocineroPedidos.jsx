import { useEffect } from "react";
import { useOrders } from "../../hooks/useOrders";
import Loading from "../../components/Loading/Loading";
import { estadosColores, estadosTraduccion } from "../../utils/estadoPedidos";
import { CheckCircle, ClipboardCheck } from "lucide-react";

export const CocineroPedidos = () => {
  const { ordenes, cargando, error, cargarOrdenes, cambiarEstadoOrden } = useOrders();

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleClick = async (orden, nuevoEstado) => {
    try {
      await cambiarEstadoOrden(orden.id, nuevoEstado);
    } catch (err) {
      console.error(err);
    }
  };

  const activos = ordenes.filter(orden => ["paid", "in_progress", "ready_for_pickup"].includes(orden.status));

  if (cargando) return <Loading />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-red-600 text-xl font-semibold bg-red-50 px-6 py-4 rounded-lg">Error: {error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-25 md:p-0 min-h-[60vh]">
      {/* Header */}
      <div className="bg-white text-gris-boton rounded-xl shadow-sm p-6 mb-6 border-l-4 border-naranja-boton">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-naranja-boton" />
          Ordenes
        </h1>
        <p className="text-gray-400 mt-2">
          Pedidos activos: <span className="font-semibold text-orange-400">{activos.length}</span>
        </p>
      </div>

      {ordenes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
          <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
          <p className="text-gray-500 text-xl font-medium">
            ¡Todo al día! No hay pedidos pendientes
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ordenes.map((orden) => (
            <div
              key={orden.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition-all duration-200"
            >
              {/* Header de la orden */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold">
                    Orden #{orden.id}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Intl.DateTimeFormat("es-AR", {
                      hour: "numeric",
                      minute: "numeric",
                      hourCycle: "h23",
                      timeZone: "America/Argentina/Buenos_Aires",
                    }).format(new Date(orden.created_at))} hs
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-2 rounded-lg border-2 ${estadosColores[orden.status] || "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                >
                  {estadosTraduccion[orden.status] || orden.status}
                </span>
              </div>

              {/* Items del pedido */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Items:
                </h3>
                <div className="space-y-2">
                  {orden.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="bg-naranja-boton min-w-10 w-10 flex justify-center text-white font-bold text-sm px-2 py-1 rounded">
                          {item.quantity}×
                        </span>
                        <span className="font-medium">
                          {item.item_type === "promotion" && item.promotion?.name}
                          {item.item_type === "custom_burger" && item.custom_burger?.custom_name}
                          {item.item_type === "menu_burger" && item.menu_burger?.name}
                        </span>
                      </div>
                      <span className="font-bold">
                        ${item.total_price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-green-50 border-2 border-green-100 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-green-800 uppercase">
                    Total
                  </span>
                  <span className="text-xl font-bold text-green-800">
                    ${orden.total_price}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              {orden.status === "paid" && (
                <button
                  className="cursor-pointer w-full py-3 bg-gris-boton text-white rounded-lg hover:bg-gris-boton-hover font-bold text-base transition-colors shadow-md"
                  onClick={() => handleClick(orden, "in_progress")}
                >
                  Comenzar preparación
                </button>
              )}
              {orden.status === "in_progress" && (
                <button
                  className="cursor-pointer w-full py-3 bg-gris-boton text-white rounded-lg hover:bg-gris-boton-hover font-bold text-base transition-colors shadow-md"
                  onClick={() => handleClick(orden, "ready_for_pickup")}
                >
                  Marcar como lista
                </button>
              )}
              {orden.status === "ready_for_pickup" && (
                <button
                  className="cursor-pointer w-full py-3 bg-gris-boton text-white rounded-lg hover:bg-gris-boton-hover font-bold text-base transition-colors shadow-md"
                  onClick={() => handleClick(orden, "picked_up")}
                >
                  Entregada
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CocineroPedidos;



