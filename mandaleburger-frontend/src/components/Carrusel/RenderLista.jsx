
export default function RenderLista({ items = [], seleccion = [], setSeleccion }) {
  const onToggle = (id) => {
    const s = String(id);
    setSeleccion((prev) => (prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]));
  };

  return (
    <div className="h-30 overflow-auto pr-1">
      {items.map((it) => {
        const id = String(it.id);
        const activo = seleccion.includes(id);
        return (
          <label
            key={id}
            className="flex items-center justify-between py-1.5 px-2 hover:bg-orange-50 rounded"
          >
            <span className="text-sm">{it.name}</span>
            <input
              type="checkbox"
              className="accent-orange-500"
              checked={activo}
              onChange={() => onToggle(id)}
            />
          </label>
        );
      })}
    </div>
  );
}
