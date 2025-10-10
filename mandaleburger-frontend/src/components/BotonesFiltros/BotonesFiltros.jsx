const BotonesFiltros = ({ opciones, onSelect }) => {
  return (
    <div className="flex gap-2 mb-3 overflow-x-auto">
      {opciones.map((filtro) => (
        <button
          key={filtro}
          className="cursor-pointer px-3 py-1 md:py-2 text-xs md:text-sm bg-gris-boton text-white rounded-2xl whitespace-nowrap hover:bg-naranja-boton-hover"
          onClick={() => onSelect(filtro)}
        >
          {filtro}
        </button>
      ))}
    </div>
  );
}

export default BotonesFiltros;
