import { useMemo, forwardRef } from "react";

const CardBurger = forwardRef(function CardBurger({ pan, carne, capas }, ref) {

  // ===== Lógica movida acá =====
  const getTipo     = (ing) => (ing?.category?.name || "").toLowerCase();
  const esMedallon  = (ing) => /medall/.test(getTipo(ing));
  const esLechuga   = (ing) => (ing?.name || "").toLowerCase().includes("lechuga");
  const esAgregado  = (ing) => /agregado|extra|salsa/.test(getTipo(ing));

  const prioridad = (ing) =>
    esLechuga(ing) ? 0 :
    esMedallon(ing) ? 3 :
    esAgregado(ing) ? 2 : 1;

  const OFFSETS_ORDEN = [
    { nombre: /lechuga/i,                  offset: -25 },
    { nombre: /tomate/i,                   offset: -45 },
    { nombre: /mozzarella|cheddar|Quesos/i, offset: -50 },
    { nombre: /bacon|jam[oó]n/i,           offset: -60 },
    { nombre: /huevo/i,                    offset: -67 },
    { nombre: /palta|pepino/i,             offset: -55 },
    { tipo: /medall/i,                     offset: -47 },
    { tipo: /Quesos/i,                     offset: -60 },
  ];

  const getOffset = (ing, idx) => {
    const nombre = (ing?.name || "").toLowerCase();
    const tipo = getTipo(ing);
    const regla = OFFSETS_ORDEN.find(r =>
      (r.nombre && r.nombre.test(nombre)) || (r.tipo && r.tipo.test(tipo))
    );
    if (regla) return regla.offset;
    return idx === 0 ? -16 : -50;
  };

  const capasOrdenadas = useMemo(() => {
    const ordered = [...capas].sort((a, b) => prioridad(a) - prioridad(b));
    return ordered.map((ing, idx) => ({
      ...ing,
      _key: ing._uid ?? `capa-${ing.id}-${idx}`,
      _z: 49 - idx,
      _mt: getOffset(ing, idx),
    }));
  }, [capas]);

  return (
    <div className="w-full rounded overflow-hidden">
      <div className="w-full flex justify-center">
        <div ref={ref} className="relative w-[320px]"> 

          {/* pan superior */}
          <div className="text-center relative top-3 h-40 z-50">
            <img
              crossOrigin="anonymous"
              src={pan?.imagen}
              alt={pan?.nombre}
              style={{ clipPath: 'inset(0 0 42% 0)' }}
              className="scale-[0.90] w-full h-auto object-contain translate-y-2"
            />
          </div>

          {/* capas superpuestas */}
          <div className="py-2 relative -top-5">
            <div className="mt-2 flex flex-col items-center gap-2">
              {capasOrdenadas.map((ing, i) => (
                <div key={ing._key ?? `capa-${ing.id}-${i}`} style={{ marginTop: ing._mt, zIndex: ing._z }}>
                  {ing.img ? (
                    <img
                      crossOrigin="anonymous"
                      src={ing.img}
                      alt={ing.name}
                      className="w-full h-auto object-contain block pointer-events-none select-none"
                      style={{ zIndex: ing._z }}
                    />
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-white">
                      {ing.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* carne */}
          <div className="relative flex items-center justify-between -top-10 z-[1]">
            <div className="-mt-6 w-full text-center">
              {carne ? (
                <img
                  crossOrigin="anonymous"
                  src={carne}
                  alt="Medallón"
                  className="w-full h-auto mx-auto object-contain pointer-events-none select-none"
                />
              ) : (
                <div className="text-sm text-gray-500">Sin medallones</div>
              )}
            </div>
          </div>

          {/* pan inferior */}
          <div className="text-center relative -top-50 h-40">
            <img
              crossOrigin="anonymous"
              src={pan?.imagen}
              alt={pan?.nombre}
              style={{ clipPath: 'inset(62% 0 0 0)' }}
              className=" scale-[0.80] w-full h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </div>
  );
});
export default CardBurger;
