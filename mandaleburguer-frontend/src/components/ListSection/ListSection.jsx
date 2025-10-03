import { useMemo } from "react";

const ListSection = ({
  title,
  colorTitle = "text-black",
  items = [],
  renderRow,
  renderCard,
  searchTerm,
  setSearchTerm,
  Icon,
  iconColor = 'text-orange-400'
}) => {

  const itemsFiltrados = useMemo(() => {
    if (!searchTerm) return items;
    const palabras = searchTerm.toLowerCase().split(" ").filter(Boolean);
    return items.filter((item) =>
      palabras.every(
        (palabra) =>
          item.first_name.toLowerCase().includes(palabra) ||
          item.last_name.toLowerCase().includes(palabra)
      )
    );
  }, [items, searchTerm]);

  return (
    <section className="w-full mt-6">
        <h2 className={`font-medium text-lg md:text-2xl mb-2 flex items-center space-x-2 ${colorTitle}`}>
            {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
            <span>{title}</span>
        </h2>

      <div className="hidden md:block overflow-x-auto md:rounded-lg md:shadow-md">
        <table className="min-w-full bg-white table-auto">
          <thead className="bg-gris-boton text-white text-sm tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center w-16 min-w-[64px]">ID</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Apellido</th>
              <th className="py-3 px-4 text-left">Usuario</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {itemsFiltrados.map(renderRow)}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col space-y-3">
        {itemsFiltrados.map(renderCard)}
      </div>
    </section>
  );
};

export default ListSection;
