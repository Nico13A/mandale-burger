import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIngredientesCRUD } from "../../hooks/useIngredientesCRUD";

const Ingredientes = () => {
  const { ingredientes, eliminarIngrediente, activarIngrediente } = useIngredientesCRUD();
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
  const navigate = useNavigate();

  // ------------------ Handlers ------------------
  const handleDesactivar = async (id) => {
    try {
      await eliminarIngrediente(id);
    } catch (err) {
      toast.error(`${err.message || "Error desconocido."}`);
    }
  };

  const handleActivar = (id) => {
    activarIngrediente(id);
  };

  // ------------------ Filtrado por categoría ------------------
  useEffect(() => {
    if (categoriaFiltro === "Todas") {
      setIngredientesFiltrados(ingredientes);
    } else {
      setIngredientesFiltrados(
        ingredientes.filter((ing) => ing.category_name === categoriaFiltro)
      );
    }
  }, [ingredientes, categoriaFiltro]);

  const categorias = [
    "Todas",
    ...new Set(ingredientes.map((ing) => ing.category_name).filter(Boolean)),
  ];

  // ------------------ Render ------------------
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 pb-25 md:pb-0">
      {/* ToastContainer */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Encabezado */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-gris-boton flex-shrink-0">
          Ingredientes
        </h1>

        {/* Select y botón */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <select
            className="w-1/2 md:w-auto cursor-pointer px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-naranja-boton focus:border-naranja-boton transition-all duration-200"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 bg-naranja-boton text-white rounded-2xl hover:bg-naranja-boton-hover transition-colors w-full sm:w-auto"
            onClick={() => navigate("/admin/ingredientes/nuevo")}
          >
            Nuevo ingrediente
          </button>
        </div>
      </div>


      {/* Cards */}
      <div className="space-y-4">
        {ingredientesFiltrados.map((ing) => (
          <div
            key={ing.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-gris-boton text-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              {ing.img && (
                <img
                  src={ing.img}
                  alt={ing.name}
                  className="w-16 h-16 object-cover rounded-xl border border-gray-400"
                />
              )}
              <div>
                <p className="font-semibold text-white flex items-center">
                  {ing.name}
                  {!ing.is_active && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-600 rounded-full">
                      Desactivado
                    </span>
                  )}
                </p>
                <p className="text-gray-300 text-sm">{ing.category_name}</p>
                <p className="text-gray-200 text-sm">
                  ${ing.price} - Stock: {ing.stock}
                </p>
                <p className="text-gray-300 text-sm">
                  {ing.is_vegan && "Vegano"} {ing.is_gluten_free && "Sin gluten"}
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end sm:justify-center mt-4 sm:mt-0 space-x-2">
              <button
                className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors duration-200"
                onClick={() => navigate(`/admin/ingredientes/${ing.id}`)}
              >
                Editar
              </button>

              {ing.is_active ? (
                <button
                  className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleDesactivar(ing.id)}
                >
                  Desactivar
                </button>
              ) : (
                <button
                  className="cursor-pointer px-3 py-1 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors duration-200"
                  onClick={() => handleActivar(ing.id)}
                >
                  Activar
                </button>
              )}
            </div>
          </div>
        ))}

        {ingredientesFiltrados.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            No hay ingredientes disponibles en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
};

export default Ingredientes;

