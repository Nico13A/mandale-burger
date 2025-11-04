import { useState, useMemo, useEffect, forwardRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardBurger from "../CardBurger/CardBurger.jsx";
import ModalIngredientes from "../ModalIngrediente/ModalIngrediente.jsx";

const Carrusel = forwardRef(function Carrusel({
  panes, medallones, ingredientes, onChange
}, ref) {

  // --- carrusel PAN ---
  const [panActual, setPanActual] = useState([]);
  const [iPan, setIPan] = useState(() => {
    const ip = localStorage.getItem("iPan");
    return ip ? JSON.parse(ip) : 0;
  });

  const lastPan = Math.max(0, (panes?.length ?? 1) - 1);
  const prevPan = () => setIPan(i => (i === 0 ? lastPan : i - 1));
  const nextPan = () => setIPan(i => (i === lastPan ? 0 : i + 1));

  useEffect(() => {
    const actual = panes?.[iPan];
    if (actual) {
      localStorage.setItem("Pan", JSON.stringify(actual));
      localStorage.setItem("iPan", JSON.stringify(iPan));
      setPanActual(actual);
    }
  }, [iPan, panes]);

  // --- carrusel CARNE ---
  const [carneActual, setCarneActual] = useState(0);
  const [iCarne, setICarne] = useState(() => {
    const guardado = localStorage.getItem("iCarne");
    return guardado ? JSON.parse(guardado) : 0;
  });
  const lenCarne = medallones?.length ?? 0;
  const prevCarne = () => setICarne(i => (lenCarne ? (i - 1 + lenCarne) % lenCarne : 0));
  const nextCarne = () => setICarne(i => (lenCarne ? (i + 1) % lenCarne : 0));

  useEffect(() => {
    const medallon = medallones?.[iCarne];
    if (medallon) {
      setCarneActual(medallon);
      localStorage.setItem("medallonCarrusel", JSON.stringify(medallon));
      localStorage.setItem("iCarne", JSON.stringify(iCarne));
    }
  }, [iCarne, medallones]);


  // --- selección de ingredientes (capas) ---
  const [capas, setCapas] = useState(() => {
    const ingSelect = localStorage.getItem("ingSeleccionados");
    return ingSelect ? JSON.parse(ingSelect) : [];
  });
  const [open, setOpen] = useState(false);

  const sinPanes = useMemo(
    () => (ingredientes || []).flatMap(c => c?.ingredients || []),
    [ingredientes]
  );

  const handleOpenAgregar = () => {
    setCapas([]);
    setOpen(true);
  };

  const [ingBurger, setIngBurger] = useState(() => {
    const ingSelect = localStorage.getItem("cantIng");
    return ingSelect ? JSON.parse(ingSelect) : [];
  });

  useEffect(() => {
    const ingBu = [];
    const pid = Number(panActual?.id);
    if (!Number.isNaN(pid)) ingBu.push({ ingredient_id: pid, quantity: 1 });

    let nuevo = [];

    if (ingBurger.length !== 0) {
      let huboMatch = false;

      nuevo = ingBurger.map((ing) => {
        if (Number(ing.ingredient_id) === Number(carneActual?.id)) {
          huboMatch = true;
          return { ...ing, quantity: (Number(ing.quantity) || 0) + 1 };
        }
        return ing;
      });

      if (!huboMatch && carneActual?.id != null) {
        nuevo.push({ ingredient_id: Number(carneActual.id), quantity: 1 });
      }
    } else {
      if (carneActual?.id != null) {
        nuevo = [{ ingredient_id: Number(carneActual.id), quantity: 1 }];
      }
    }

    ingBu.push(...nuevo);
    onChange?.({ ingBu });
  }, [capas, panActual, carneActual]);

  const handleConfirmIngredientes = (detalles) => {
    const cantIng = detalles.map(d => ({
      ingredient_id: Number(d.id),
      quantity: Number(d.quantity) || 0,
    }));
    setIngBurger(cantIng);
    localStorage.setItem("cantIng", JSON.stringify(cantIng));

    const objCant = Object.fromEntries(
      detalles.map(d => [Number(d.id), Number(d.quantity) || 0])
    );
    localStorage.setItem("cantIngredientes", JSON.stringify(objCant));
    localStorage.setItem("idSeleccionados", JSON.stringify(detalles.map(d => d.id)));

    const seleccionados = detalles.flatMap(({ id, quantity }) => {
      const base = sinPanes.find(i => String(i.id) === String(id));
      if (!base) return [];
      const capa = { ...base, imagen: base.img };
      return Array.from({ length: Math.max(0, quantity) }, () => capa);
    });
    localStorage.setItem("ingSeleccionados", JSON.stringify(seleccionados));
    setCapas(seleccionados);
    setOpen(false);
  };

  return (
    <div className="p-3 space-y-6 rounded-xl shadow-lg">
      {/* Carrusel Pan */}
      <div className="w-full rounded-lg overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-700/30 rounded-2xl">
          <button
            onClick={prevPan}
            className="p-3 rounded-full hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <h3 className="font-semibold text-white text-center truncate max-w-[200px]">
            {panActual?.nombre ?? panActual?.name ?? "—"}
          </h3>

          <button
            onClick={nextPan}
            className="p-3 rounded-full hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex justify-center py-6">
          <CardBurger
            ref={ref}
            pan={panActual ? { imagen: panActual.img } : null}
            carne={carneActual.img}
            capas={capas}
          />
        </div>

        {/* Carrusel Carne */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-700/30 rounded-2xl text-white">
          <button
            onClick={prevCarne}
            disabled={!lenCarne}
            className="p-3 rounded-full hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="font-semibold text-center">
            {medallones[iCarne]?.name ? `Medallón ${medallones[iCarne].name}` : "Sin medallones"}
          </div>

          <button
            onClick={nextCarne}
            disabled={!lenCarne}
            className="p-3 rounded-full hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-400
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Botón Agregar Ingredientes */}
      <div>
        <button
          onClick={handleOpenAgregar}
          className="text-white text-lg font-semibold bg-naranja-boton hover:bg-naranja-boton-hover p-4 rounded-2xl cursor-pointer w-full"
        >
          Agregar ingrediente
        </button>
      </div>

      {/* Modal Ingredientes */}
      <ModalIngredientes
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmIngredientes}
        ingredientes={ingredientes}
      />
    </div>
  );
});

export default Carrusel;