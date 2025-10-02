import { useState, useMemo } from "react";
import { useClientes } from "../../hooks/useClientes";

const ClientList = () => {
  const { clientesActivos, clientesInactivos, loading, error } = useClientes();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado
  const clientesActivosFiltrados = useMemo(() => {
    if (!searchTerm) return clientesActivos;
    const palabras = searchTerm.toLowerCase().split(" ").filter(Boolean);
    return clientesActivos.filter((c) =>
      palabras.every(
        (palabra) =>
          c.first_name.toLowerCase().includes(palabra) ||
          c.last_name.toLowerCase().includes(palabra)
      )
    );
  }, [searchTerm, clientesActivos]);

  const clientesInactivosFiltrados = useMemo(() => {
    if (!searchTerm) return clientesInactivos;
    const palabras = searchTerm.toLowerCase().split(" ").filter(Boolean);
    return clientesInactivos.filter((c) =>
      palabras.every(
        (palabra) =>
          c.first_name.toLowerCase().includes(palabra) ||
          c.last_name.toLowerCase().includes(palabra)
      )
    );
  }, [searchTerm, clientesInactivos]);

  // Render fila para tabla
  const renderClienteRow = (c) => (
    <tr key={c.id} className="border-b last:border-b-0 hover:bg-gray-100 odd:bg-white even:bg-gray-50">
      <td className="py-2 px-4">{c.id}</td>
      <td className="py-2 px-4">{c.first_name}</td>
      <td className="py-2 px-4">{c.last_name}</td>
      <td className="py-2 px-4">{c.username}</td>
      <td className="py-2 px-4">{c.email}</td>
    </tr>
  );

  // Render card para mobile
  const renderClienteCard = (c) => (
    <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 space-y-1">
      <p className="font-semibold">{c.first_name} {c.last_name}</p>
      <p className="text-gray-500 text-sm">@{c.username}</p>
      <p className="text-gray-500 text-sm">{c.email}</p>
    </div>
  );

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p className="text-red-500">Error al cargar clientes: {error}</p>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 pb-25 md:pb-0">
      <div className="flex justify-between items-center space-x-2 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          className="px-4 py-2 w-64 md:w-72 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clientes activos */}
      {clientesActivosFiltrados.length > 0 && (
        <section className="w-full">
          <h2 className="font-medium text-lg md:text-2xl mt-6 mb-2 text-green-500">Clientes Activos</h2>

          <div className="hidden md:block overflow-x-auto md:rounded-lg md:shadow-md">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-gray-700 text-white text-sm tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Apellido</th>
                  <th className="py-3 px-4 text-left">Usuario</th>
                  <th className="py-3 px-4 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {clientesActivosFiltrados.map(renderClienteRow)}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {clientesActivosFiltrados.map(renderClienteCard)}
          </div>
        </section>
      )}

      {/* Clientes inactivos */}
      {clientesInactivosFiltrados.length > 0 && (
        <section className="w-full">
          <h2 className="font-medium text-lg md:text-2xl mt-6 mb-2 text-red-500">Clientes Inactivos</h2>

          <div className="hidden md:block overflow-x-auto md:rounded-lg md:shadow-md">
            <table className="min-w-full bg-white table-auto">
              <thead className="bg-gray-700 text-white text-sm tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Apellido</th>
                  <th className="py-3 px-4 text-left">Usuario</th>
                  <th className="py-3 px-4 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {clientesInactivosFiltrados.map(renderClienteRow)}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {clientesInactivosFiltrados.map(renderClienteCard)}
          </div>
        </section>
      )}

      {clientesActivosFiltrados.length === 0 && clientesInactivosFiltrados.length === 0 && (
        <p>No hay clientes registrados.</p>
      )}
    </div>
  );
};

export default ClientList;




