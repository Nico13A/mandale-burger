const CardPlanAdmin = ({ plan, onEdit, onActivate, onDeactivate }) => {
  return (
    <div className="w-full md:h-[385px] bg-gris-boton text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Título */}
      <h3 className="text-lg md:text-xl font-extrabold mb-2">{plan.name}</h3>
      
      {/* Línea decorativa */}
      <div className="h-1 w-16 bg-naranja-boton mb-4 rounded-full"></div>

      {/* Descripción */}
      <p className="text-sm md:text-base mb-6 flex-grow">{plan.description}</p>

      {/* Precio */}
      <span className="text-sm md:text-lg font-semibold mb-4">${plan.price}/mes</span>

      {/* Botones de acción (Admin) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onEdit(plan.id)}
          className="cursor-pointer px-3 py-1 bg-blue-500 rounded-2xl hover:bg-blue-600 transition"
        >
          Editar
        </button>
        {plan.is_active ? (
          <button
            onClick={() => onDeactivate(plan.id)}
            className="cursor-pointer px-3 py-1 bg-red-500 rounded-2xl hover:bg-red-600 transition"
          >
            Desactivar
          </button>
        ) : (
          <button
            onClick={() => onActivate(plan.id)}
            className="cursor-pointer px-3 py-1 bg-green-500 rounded-2xl hover:bg-green-600 transition"
          >
            Activar
          </button>
        )}
      </div>
    </div>
  );
};

export default CardPlanAdmin;


