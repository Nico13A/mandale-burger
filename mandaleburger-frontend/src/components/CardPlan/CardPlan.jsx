const CardPlan = ({ plan, onSelect, suscripcionActiva }) => {
  return (
    <div className="w-full md:h-[385px] bg-gris-boton text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <h3 className="text-lg md:text-xl font-extrabold mb-2">{plan.name}</h3>

      <div className="h-1 w-16 bg-naranja-boton mb-4 rounded-full"></div>

      <p className="text-sm md:text-base mb-6 flex-grow">{plan.description}</p>

      <div className="flex flex-wrap justify-between items-center">
        <span className="text-sm md:text-lg font-semibold">${plan.price}/mes</span>
        <button
          onClick={() => onSelect(plan.id)}
          disabled={suscripcionActiva}
          className={`px-4 py-2 font-medium rounded-2xl transition-colors
            ${suscripcionActiva
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-naranja-boton hover:bg-naranja-boton-hover text-white cursor-pointer"}`}
        >
          {suscripcionActiva ? "Plan activo" : "Elegir este plan"}
        </button>
      </div>
    </div>
  );
};

export default CardPlan;




