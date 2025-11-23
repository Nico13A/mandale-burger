const BotonCocineroDia = ({ onClick }) => {
  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={onClick}
        className="px-4 py-2 text-white text-sm md:text-base rounded-full bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer"
      >
        Ver cocinero del día
      </button>
    </div>
  );
}

export default BotonCocineroDia;