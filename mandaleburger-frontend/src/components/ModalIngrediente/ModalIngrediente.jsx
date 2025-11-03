import { useState, useMemo, useEffect } from "react";

export default function ModalIngredientes({
  isOpen,
  onClose,
  onConfirm,
  ingredientes,
}) {
  
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  // cantidades por id: { [id]: number }
  const [cantidades, setCantidades] = useState(() => {
  const guardado = localStorage.getItem("cantIngredientes");
  return guardado ? JSON.parse(guardado) : {};
});

  // persistir cantidades
  useEffect(() => {
    try {
      localStorage.setItem("cantIngredientes", JSON.stringify(cantidades));
      // opcional: también guardo sólo los ids seleccionados (>=1) para compat
      const ids = Object.keys(cantidades).filter((k) => cantidades[k] > 0);
      localStorage.setItem("idSeleccionados", JSON.stringify(ids.map(Number)));
    } catch {}
  }, [cantidades]);

  const visibles = useMemo(() => {
    if (categoriaActiva === "todos") {
      return ingredientes.flatMap((cat) => cat.ingredients || []);
    }
    const categoria = ingredientes.find((cat) => cat.name === categoriaActiva);
    return categoria?.ingredients || [];
  }, [ingredientes, categoriaActiva]);

  const sinPanes = useMemo(
  () => (ingredientes || []).flatMap(c => c?.ingredients || []),
  [ingredientes]
);
  //controlo el stock de cada ingrediente
  const getStock = (id) => {
  const ing = sinPanes.find(i => i.id ===id);
  
  return ing?.stock ?? 0;
};
  // sumar o restar cantidad
  const inc = (id) =>
    setCantidades((prev) => {
      const max = getStock(id);
      const nextQty = Math.min((prev[id] || 0) + 1, max);
      // si ya está en el máximo, no cambia
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

  // click en card: si no está, lo pone en 1; si está, lo quita (a 0)
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#FFF7EB] w-[90%] max-w-md rounded-2xl p-5 shadow-lg">
        {/* Tabs */}
        <div className="flex gap-2 flex-nowrap whitespace-nowrap mb-4 bg-[#FFE7C7] rounded-full px-2 py-1 overflow-x-auto">
          <button
            className={`shrink-0 px-3 py-1.5 rounded-full capitalize text-sm ${
              categoriaActiva === "todos"
                ? "bg-white text-black font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setCategoriaActiva("todos")}
          >
            Todos
          </button>
          {ingredientes.map((cat) => (
            <button
              key={cat.id || cat.name}
              className={`shrink-0 px-3 py-1.5 rounded-full capitalize text-sm ${
                categoriaActiva === cat.name
                  ? "bg-white text-black font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setCategoriaActiva(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Ingredientes con cantidad */}
        <div className="grid grid-rows-3 grid-flow-col gap-3 h-80 overflow-x-auto overflow-y-hidden pr-2">
          {visibles.map((ing) => {
            const qty = cantidades[ing.id] || 0;
            const seleccionado = qty > 0;
            return (
              <div
                key={ing.id}
                className={`flex flex-col items-center rounded-xl min-w-[110px] ${
                  seleccionado ? "bg-orange-200" : "bg-orange-50"
                }`}
              >
                <button
                  onClick={() => toggleCard(ing.id)}
                  className="focus:outline-none"
                  title={seleccionado ? "Quitar" : "Seleccionar"}
                >
                  <img
                    src={ing.img}
                    alt={ing.name}
                    className="w-10 h-10 object-contain mx-auto"
                  />
                  <span className="block text-xs mt-1 text-center">
                    {ing.name}
                  </span>
                </button>

                {/* Controles de cantidad */}
                <div className="mt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dec(ing.id)}
                    className="w-7 h-7 rounded-full bg-white border text-lg leading-7 text-gray-700 disabled:opacity-40"
                    disabled={qty <= 0}
                    aria-label="Disminuir"
                  >
                    −
                  </button>
                  <div className="min-w-[28px] text-center font-semibold">
                    {qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => inc(ing.id)}
                    className="w-7 h-7 rounded-full bg-white border text-lg leading-7 text-gray-700"
                    aria-label="Aumentar"
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
          className="w-full mt-4 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-full font-bold"
        >
          Confirmar ingredientes
        </button>
      </div>
    </div>
  );
}