const CardIngrediente = ({ ing, onEdit, onActivate, onDeactivate }) => {
  return (
    <div className="
      w-full bg-gris-boton text-white rounded-2xl px-4 py-3
      shadow-md hover:shadow-lg transition-all duration-300
      flex items-center gap-4
    ">
      {/* Imagen */}
      {ing.img && (
        <img
          src={ing.img_url || ing.img}
          alt={ing.name}
          className="w-12 h-12 object-cover rounded-md shrink-0"
        />
      )}

      {/* Título + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="text-base md:text-lg font-extrabold truncate">
            {ing.name}
          </h3>
          <span className="text-xs text-gray-200/80 truncate">
            {ing.category?.name ?? "Sin categoría"}
          </span>
        </div>

        {/* Subinfo en una línea */}
        <div className="mt-1 text-sm md:text-base flex flex-wrap items-center gap-3">
          <span>Stock: <span className="font-semibold">{ing.stock ?? 0}</span></span>
          <span>Precio: <span className="font-semibold">${ing.price ?? 0}</span></span>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-2xl ${ing.is_vegan ? "bg-green-600" : "bg-gray-600"}`}>
              {ing.is_vegan ? "Vegano" : "No vegano"}
            </span>
            <span className={`px-2 py-0.5 rounded-2xl ${ing.is_gluten_free ? "bg-emerald-600" : "bg-gray-600"}`}>
              {ing.is_gluten_free ? "Sin gluten" : "Con gluten"}
            </span>
            {typeof ing.is_active === "boolean" && (
              <span className={`px-2 py-0.5 rounded-2xl ${ing.is_active ? "bg-blue-600" : "bg-gray-500"}`}>
                {ing.is_active ? "Activo" : "Inactivo"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Acciones a la derecha */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(ing.id)}
          className="px-3 py-1 rounded-2xl bg-blue-500 hover:bg-blue-600"
        >
          Editar
        </button>

        {typeof ing.is_active === "boolean" && (
          ing.is_active ? (
            <button
              onClick={() => onDeactivate?.(ing.id)}
              className="px-3 py-1 rounded-2xl bg-red-500 hover:bg-red-600"
            >
              Desactivar
            </button>
          ) : (
            <button
              onClick={() => onActivate?.(ing.id)}
              className="px-3 py-1 rounded-2xl bg-green-500 hover:bg-green-600"
            >
              Activar
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default CardIngrediente;