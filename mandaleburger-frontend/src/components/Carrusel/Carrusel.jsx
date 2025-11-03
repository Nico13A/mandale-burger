import { useState, useMemo, useEffect, forwardRef  } from "react";
import CardBurger from "../CardBurger/CardBurger.jsx";
import ModalIngredientes from "../ModalIngrediente/ModalIngrediente.jsx";

const Carrusel = forwardRef(function Carrusel({ 
  panes, medallones , ingredientes, onChange },ref) {
  // --- carrusel PAN ---
  const [panActual, setPanActual] = useState([])
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
  const [carneActual, setCarneActual] = useState(0)
  const [iCarne, setICarne] = useState(() => {
    const guardado = localStorage.getItem("iCarne");
    return guardado ? JSON.parse(guardado) : 0;
  });
  const lenCarne = medallones?.length ?? 0;
  const prevCarne = () => setICarne(i => (lenCarne ? (i - 1 + lenCarne) % lenCarne : 0));
  const nextCarne = () => setICarne(i => (lenCarne ? (i + 1) % lenCarne : 0));
  
  useEffect(() => {
    const actualmed = medallones?.[iCarne];
    if (actualmed) {
      localStorage.setItem("medallonCarrusel", JSON.stringify(actualmed));
      setCarneActual(actualmed);
    }
  }, [iCarne,medallones]);


  useEffect(() => {
  const medallonActual = medallones[iCarne];
  if (medallonActual) {
    localStorage.setItem("medallonCarrusel", JSON.stringify(medallonActual));
    localStorage.setItem("iCarne", JSON.stringify(iCarne));
  }
}, [iCarne, medallones]);

  // --- selección de ingredientes (capas) ---
  const [capas, setCapas] = useState(() => {
    const ingSelect = localStorage.getItem("ingSeleccionados");
    return ingSelect ? JSON.parse(ingSelect) : [];
  });
  
  const [open, setOpen] = useState(false);

  //pone todos los ingredientes en una sola lista en el array sinPanes
  const sinPanes = useMemo(
    () => (ingredientes || []).flatMap(c => c?.ingredients || []),
    [ingredientes]
  );
  
  const handleOpenAgregar = () => {
    setCapas([]);      
    setOpen(true);
  };

  // paso todos los ids y cantidades para armar la burger
  const [ingBurger, setIngBurger] = useState(() => {
    const ingSelect = localStorage.getItem("cantIng");
    return ingSelect ? JSON.parse(ingSelect) : [];
  });
 //en cualquier cambio actualiza el array de ingredientes de la burger
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


  
  //uso el array sinPanes para buscar los ingredientes seleccionados por id
  
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
    // Armar capas duplicando por cantidad

    const seleccionados = detalles.flatMap(({ id, quantity }) => {
    const base = sinPanes.find(i => String(i.id) === String(id));
    if (!base) return [];

    // si CardBurger espera la propiedad `imagen` en vez de `img`, agregala:
    const capa = { ...base, imagen: base.img };
    return Array.from({ length: Math.max(0, quantity) }, () => capa);
  });
    localStorage.setItem("ingSeleccionados", JSON.stringify(seleccionados));
    setCapas(seleccionados);
    setOpen(false);
  };
  
  return (
    //<div className="p-4 space-y-4">
    <div className="p-4 space-y-4 bg-transparent rounded-lg shadow border">
      <div className="w-full rounded overflow-hidden">
        <div className="flex items-center justify-between p-2">
        <button
          onClick={prevPan}
          className="px-3 py-1 rounded border text-white border-white
                    hover:bg-white/10 active:bg-white/20
                    focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          ←
        </button>

        <h3 className="font-semibold text-white">
          {panActual?.nombre ?? panActual?.name ?? "—"}
        </h3>

        <button
          onClick={nextPan}
          className="px-3 py-1 rounded border text-white border-white
                    hover:bg白/10 active:bg-white/20
                    focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          →
        </button>
      </div>

        <div className="flex justify-center py-4">
          <div className="bg-transparent">
            <CardBurger
              ref={ref}
              pan={panActual ? { imagen: panActual.img } : null}
              carne={carneActual.img}
              capas={capas}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pb-3 -mt-10 text-white">
          <button
            onClick={prevCarne}
            disabled={!lenCarne}
            className="px-3 py-1 rounded border border-white text-white
                      hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40
                      disabled:opacity-40 disabled:border-white/40 disabled:text-white/40"
            aria-label="Anterior"
          >
            ←
          </button>

          <div className="font-semibold">
            {medallones[iCarne]?.name ? `Medallón ${medallones[iCarne].name}` : "Sin medallones"}
          </div>

          <button
            onClick={nextCarne}
            disabled={!lenCarne}
            className="px-3 py-1 rounded border border-white text-white
                      hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40
                      disabled:opacity-40 disabled:border-white/40 disabled:text-white/40"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      </div>

      <div className="w-full max-w-[320px] mx-auto">
        <button
          onClick={handleOpenAgregar}
          className="block w-full max-w-[280px] mx-auto px-4 py-2 rounded
                    bg-naranja-boton hover:bg-naranja-boton-hover
                    text-white text-center shadow
                    transition-colors focus:outline-none focus:ring-2 focus:ring-naranja-boton/40
                    disabled:opacity-50"
        >
          Agregar ingrediente
        </button>
      </div>

      <ModalIngredientes
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirmIngredientes}
        ingredientes={ingredientes}
      />
    </div>
  );
} );export default Carrusel;
