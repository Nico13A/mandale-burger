import { useState, useMemo, useEffect, useRef } from "react";

export default function ModalIngredientes({
  isOpen,
  onClose,
  onConfirm,
  ingredientes,
}) {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  const [cantidades, setCantidades] = useState(() => {
    const guardado = localStorage.getItem("cantIngredientes");
    return guardado ? JSON.parse(guardado) : {};
  });

  // Bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Cerrar con tecla escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Persistir cantidades
  useEffect(() => {
    try {
      localStorage.setItem("cantIngredientes", JSON.stringify(cantidades));
      const ids = Object.keys(cantidades).filter((k) => cantidades[k] > 0);
      localStorage.setItem("idSeleccionados", JSON.stringify(ids.map(Number)));
    } catch { }
  }, [cantidades]);

  const visibles = useMemo(() => {
    if (categoriaActiva === "todos") {
      return ingredientes.flatMap((cat) => cat.ingredients || []);
    }
    const categoria = ingredientes.find((cat) => cat.name === categoriaActiva);
    return categoria?.ingredients || [];
  }, [ingredientes, categoriaActiva]);

  const sinPanes = useMemo(
    () => (ingredientes || []).flatMap((c) => c?.ingredients || []),
    [ingredientes]
  );

  const getStock = (id) => {
    const ing = sinPanes.find((i) => i.id === id);
    return ing?.stock ?? 0;
  };

  const inc = (id) =>
    setCantidades((prev) => {
      const max = getStock(id);
      const nextQty = Math.min((prev[id] || 0) + 1, max);
      if (nextQty === (prev[id] || 0)) return prev;
      return { ...prev, [id]: nextQty };
    });

  const dec = (id) =>
    setCantidades((prev) => {
      const next = { ...prev };
      const q = (next[id] || 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const toggleCard = (id) =>
    setCantidades((prev) => {
      const has = (prev[id] || 0) > 0;
      const next = { ...prev };
      if (has) delete next[id];
      else next[id] = 1;
      return next;
    });

  const confirmar = () => {
    const detalles = Object.entries(cantidades)
      .filter(([, q]) => q > 0)
      .map(([id, quantity]) => ({ id: Number(id), quantity }));
    onConfirm?.(detalles);
    onClose?.();
  };

  // Referencia para enfocar al abrir
  const botonInicial = useRef(null);
  useEffect(() => {
    if (isOpen && botonInicial.current) {
      botonInicial.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[144px] bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="bg-[#FFF7EB] w-xl max-w-xl rounded-2xl p-6 shadow-lg max-h-[80vh] overflow-y-auto"
        role="document"
      >
        <h2
          id="titulo-modal"
          className="sr-only"
        >
          Seleccioná tus ingredientes
        </h2>

        {/* Tabs */}
        <div className="flex mb-4 bg-[#FFE7C7] rounded-full justify-between">
          <button
            ref={botonInicial}
            className={`tracking-wide cursor-pointer px-4 py-2 rounded-full capitalize text-sm ${categoriaActiva === "todos"
                ? "bg-naranja-boton text-white font-medium"
                : "text-gris-boton"
              }`}
            onClick={() => setCategoriaActiva("todos")}
          >
            Todos
          </button>
          {ingredientes.map((cat) => (
            <button
              key={cat.id || cat.name}
              className={`tracking-wide cursor-pointer px-4 py-2 rounded-full capitalize text-sm ${categoriaActiva === cat.name
                  ? "bg-naranja-boton text-white font-medium"
                  : "text-gris-boton"
                }`}
              onClick={() => setCategoriaActiva(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Ingredientes con cantidad */}
        <div className="grid grid-rows-3 grid-flow-col gap-4 overflow-x-auto overflow-y-hidden py-2 snap-x snap-mandatory scroll-smooth h-[420px]">
          {visibles.map((ing) => {
            const qty = cantidades[ing.id] || 0;
            const seleccionado = qty > 0;
            return (
              <div
                key={ing.id}
                className={`flex flex-col gap-2 items-center justify-between rounded-xl py-2 px-4 min-w-[110px] sm:min-w-[130px] md:min-w-[160px] transition-all duration-150 snap-start ${seleccionado ? "bg-orange-200" : "bg-orange-50"
                  }`}
              >
                <button
                  onClick={() => toggleCard(ing.id)}
                  className="focus:outline-none"
                  title={seleccionado ? "Quitar" : "Seleccionar"}
                  aria-pressed={seleccionado}
                  aria-label={
                    seleccionado
                      ? `Quitar ${ing.name}`
                      : `Seleccionar ${ing.name}`
                  }
                >
                  <img
                    src={ing.img}
                    alt={ing.name}
                    className="w-16 h-10 object-contain mx-auto"
                  />
                  <span className="block text-xs text-center font-semibold tracking-wide uppercase">
                    {ing.name}
                  </span>
                </button>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dec(ing.id)}
                    className="w-7 h-7 rounded-full bg-white border text-lg leading-7 text-gray-700 disabled:opacity-40 cursor-pointer"
                    disabled={qty <= 0}
                    aria-label={`Disminuir ${ing.name}`}
                  >
                    −
                  </button>
                  <div className="min-w-[28px] text-center font-semibold">
                    {qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => inc(ing.id)}
                    className="w-7 h-7 rounded-full bg-white border text-lg leading-7 text-gray-700 cursor-pointer"
                    aria-label={`Aumentar ${ing.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón confirmar */}
        <button
          onClick={confirmar}
          className="tracking-wide w-full mt-4 cursor-pointer bg-naranja-boton hover:bg-naranja-boton-hover text-white px-4 py-2 rounded-full font-semibold"
        >
          Confirmar ingredientes
        </button>
      </div>
    </div>
  );
}
