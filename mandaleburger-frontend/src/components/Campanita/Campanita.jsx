import { useState, useRef, useEffect } from "react";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { Bell, X } from "lucide-react";

const Campanita = () => {
  const { notificaciones, cargando, marcarComoLeida } = useNotificaciones();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  const sinLeer = notificaciones.filter((n) => !n.read).length;

  const formatFechaHora = (isoString) => {
    const fecha = new Date(isoString);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Botón de campanita */}
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="relative p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer group"
        aria-label="Ver notificaciones"
      >
        <Bell
          size={22}
          className={`transition-transform duration-200 ${sinLeer > 0 ? 'text-orange-600' : 'text-gray-600'} ${abierto ? 'rotate-12' : 'group-hover:rotate-12'}`}
        />
        {sinLeer > 0 && (
          <span className="absolute -top-0 right-0.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
            {sinLeer > 9 ? '9+' : sinLeer}
          </span>
        )}
      </button>

      {/* Dropdown modal */}
      {abierto && (
        <div className="absolute right-0 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-gris-boton">
          {/* Header con X para cerrar */}
          <div className="p-4 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-orange-50 to-white">
            <div>
              <h3 className="font-semibold">Notificaciones</h3>
              {sinLeer > 0 && (
                <p className="text-xs text-naranja-boton font-medium">{sinLeer} sin leer</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Cerrar"
            >
              <X size={18} className="text-gray-500 hover:text-naranja-boton" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cargando ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 mt-3">Cargando...</p>
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Bell size={28} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Todo al día</p>
                <p className="text-xs text-gray-400 mt-1">No tenés notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notificaciones.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 transition-colors hover:bg-gray-50 ${!n.read ? "bg-orange-50" : "bg-white"
                      }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-2">
                        {!n.read ? (
                          <div className="w-2 h-2 bg-naranja-boton rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {n.message}
                        </p>
                        <small className="text-gray-400 text-xs block mt-1">
                          {formatFechaHora(n.created_at)}
                        </small>

                        {!n.read && (
                          <button
                            onClick={() => marcarComoLeida(n.id)}
                            className="cursor-pointer block mt-2 text-xs text-naranja-boton-hover hover:underline font-semibold transition-colors"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Campanita;
