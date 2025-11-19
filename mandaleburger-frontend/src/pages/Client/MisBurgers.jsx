import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useListaBurger } from "../../hooks/useListarBurger";
import { Eye } from "lucide-react";
import Loading from "../../components/Loading/Loading";

export default function MisBurgers() {
  const navigate = useNavigate();
  const { listaBurger, cargando, error, handleListarBurger } = useListaBurger();

  const handleVerDetalleBurger = (id) => {
    navigate(`/client/burger/${id}`);
  };

  useEffect(() => {
    handleListarBurger();
  }, []);

  if (cargando) return <Loading />;
  if (error)
    return <p className="text-center text-red-500 mt-4">Error: {error}</p>;

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      <h1 className="text-xl md:text-3xl font-semibold mt-6 mb-4">
        Mis hamburguesas
      </h1>
      {listaBurger.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">
          No hay hamburguesas creadas todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {listaBurger.map((burger) => (
            <div
              key={burger.id}
              className="w-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
            >
              <div className="flex justify-center items-center bg-gradient-to-b from-white to-orange-100 overflow-hidden">
                <img
                  className="w-full h-48 md:h-56 object-contain transition-transform duration-300 hover:scale-105"
                  src={burger.img}
                  alt={burger.name}
                />
              </div>

              <div className="h-2 w-full bg-gradient-to-b from-white via-[#d9d9d9]/30 to-gris-boton"></div>

              <div className="bg-gris-boton p-4 flex flex-col justify-between flex-1">
                <h3 className="text-base md:text-lg font-semibold text-white text-center mb-2 tracking-wider truncate">
                  {burger.name ?? burger.custom_name ?? "(Sin nombre)"}
                </h3>

                <div className="flex justify-between items-center">
                  <p className="font-semibold text-orange-500 text-sm">
                    ${burger.price ?? burger.total_price ?? 0}
                  </p>
                  <button
                    onClick={() => handleVerDetalleBurger(burger.id)}
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
    </div>
  );
}
