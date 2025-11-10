
export default function RenderLista({ items = [], seleccion = [], setSeleccion }) {
  const onToggle = (id) => {
    const s = String(id);
    setSeleccion((prev) => (prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]));
  };

  return (
    <div className="h-30 overflow-auto">
      {items.map((it) => {
        const id = String(it.id);
        const activo = seleccion.includes(id);
        return (
          <label
            key={id}
            className="flex items-center justify-between rounded-md py-2 pr-2"
          >
            <span className="text-sm text-naranja-boton font-semibold">{it.name}</span>
            <input
              type="checkbox"
              className="accent-orange-200"
              checked={activo}
              onChange={() => onToggle(id)}
            />
          </label>
        );
      })}
    </div>
  );
}
