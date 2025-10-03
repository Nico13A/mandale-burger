import { useEffect, useState, useMemo } from "react";
import { useCocineros } from "../../hooks/useCocineros";
import { useCocineroDelDia } from "../../hooks/useCocineroDelDia";
import { getCocineroDelDiaActual } from "../../services/cocineroDia";
import { useNavigate } from "react-router-dom";
import { PlusIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/Loading/Loading";
import CocineroActions from "../../components/CocineroActions/CocineroActions";

const CocinerosList = () => {
  const {
    cocinerosActivos,
    cocinerosInactivos,
    loadingList,
    error,
    handleDeactivate: deactivateCocinero,
    handleActivate: activateCocinero,
  } = useCocineros();

  const { asignarCocineroDelDia } = useCocineroDelDia();
  const [cocineroDelDiaId, setCocineroDelDiaId] = useState(null);
  const [loadingId, setLoadingId] = useState({ id: null, action: null });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCocineroDelDia = async () => {
      try {
        const data = await getCocineroDelDiaActual();
        setCocineroDelDiaId(data.cocinero.id);
      } catch {
        setCocineroDelDiaId(null);
      }
    };
    fetchCocineroDelDia();
  }, []);

  const handleAsignar = async (id) => {
    setLoadingId({ id, action: "asignar" });
    try {
      await asignarCocineroDelDia(id);
      setCocineroDelDiaId(id);
    } catch {
      console.error("No se pudo asignar el cocinero del día.");
    } finally {
      setLoadingId({ id: null, action: null });
    }
  };

  const handleDeactivate = async (id) => {
    setLoadingId({ id, action: "eliminar" });
    try {
      await deactivateCocinero(id);
    } finally {
      setLoadingId({ id: null, action: null });
    }
  };

  const handleActivate = async (id) => {
    setLoadingId({ id, action: "activar" });
    try {
      await activateCocinero(id);
    } finally {
      setLoadingId({ id: null, action: null });
    }
  };

  // ---------------- Filtrado ----------------
  const cocinerosActivosFiltrados = useMemo(() => {
    if (!searchTerm) return cocinerosActivos;
    const palabras = searchTerm.toLowerCase().split(" ").filter(Boolean);
    return cocinerosActivos.filter((c) =>
      palabras.every(
        (palabra) =>
          c.first_name.toLowerCase().includes(palabra) ||
          c.last_name.toLowerCase().includes(palabra)
      )
    );
  }, [searchTerm, cocinerosActivos]);

  const cocinerosInactivosFiltrados = useMemo(() => {
    if (!searchTerm) return cocinerosInactivos;
    const palabras = searchTerm.toLowerCase().split(" ").filter(Boolean);
    return cocinerosInactivos.filter((c) =>
      palabras.every(palabra => c.first_name.toLowerCase().includes(palabra) || c.last_name.toLowerCase().includes(palabra))
    );
  }, [searchTerm, cocinerosInactivos]);


  // ---------------- Render filas ----------------
  const renderCocineroRow = (c, isActive = true) => (
    <tr
      key={c.id}
      className={`border-b last:border-b-0 hover:bg-orange-100 odd:bg-white even:bg-orange-50 transition-colors duration-200`}
    >
      <td className="py-2 px-4 bg-gris-boton text-white text-center w-16 min-w-[64px]">{c.id}</td>
      <td className="py-2 px-4 flex items-center space-x-2">
        <span>{c.first_name}</span>
        {cocineroDelDiaId === c.id && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Cocinero del Día
          </span>
        )}
      </td>
      <td className="py-2 px-4">{c.last_name}</td>
      <td className="py-2 px-4">{c.username}</td>
      <td className="py-2 px-4 text-center">
        <CocineroActions
          cocinero={c}
          isActive={isActive}
          cocineroDelDiaId={cocineroDelDiaId}
          loadingId={loadingId}
          handleDeactivate={handleDeactivate}
          handleActivate={handleActivate}
          handleAsignar={handleAsignar}
          navigate={navigate}
        />
      </td>
    </tr>
  );

  const renderCocineroCard = (c, isActive = true) => (
    <div
      key={c.id}
      className={`bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 space-y-2 ${cocineroDelDiaId === c.id ? "bg-yellow-100" : ""
        }`}
    >
      {c.profile?.image ? (
        <img
          src={c.profile.image}
          alt={`${c.first_name} ${c.last_name}`}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-2" />
      )}

      <div className="flex items-center space-x-2">
        <p className="font-semibold">
          {c.first_name} {c.last_name}
        </p>
        {cocineroDelDiaId === c.id && (
          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Cocinero del Día
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">@{c.username}</p>

      <CocineroActions
        cocinero={c}
        isActive={isActive}
        cocineroDelDiaId={cocineroDelDiaId}
        loadingId={loadingId}
        handleDeactivate={handleDeactivate}
        handleActivate={handleActivate}
        handleAsignar={handleAsignar}
        navigate={navigate}
      />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 pb-25 md:pb-0">
      <div className="flex justify-between items-center space-x-2 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Cocineros</h1>
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            className="hidden md:block px-4 py-2 w-64 md:w-72 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-botoborder-gris-boton focus:border-gris-boton transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => navigate("/admin/cocineros/nuevo")}
            className="flex items-center px-4 py-2 text-white rounded-2xl bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Agregar
          </button>
        </div>
      </div>

      {/* Para no romper en mobile */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        className="md:hidden px-4 py-2 w-full border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-botoborder-gris-boton focus:border-gris-boton transition-all duration-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loadingList && <Loading />}
      {error && <p className="text-red-500">{error}</p>}

      {!loadingList && cocinerosActivosFiltrados.length > 0 && (
        <section className="w-full">
          <h2 className="font-medium text-lg md:text-2xl mt-6 mb-2 text-orange-400 flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-orange-400" />
            <span>Lista de activos</span>
          </h2>
          <div className="hidden overflow-x-auto md:block md:rounded-lg md:shadow-md">
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
                {cocinerosActivosFiltrados.map((c) => renderCocineroRow(c))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {cocinerosActivosFiltrados.map((c) => renderCocineroCard(c))}
          </div>
        </section>
      )}

      {!loadingList && cocinerosInactivosFiltrados.length > 0 && (
        <section className="w-full">
          <h2 className="font-medium text-lg md:text-2xl mt-6 mb-2 text-red-400 flex items-center space-x-2">
            <XCircleIcon className="w-5 h-5 text-red-400" />
            <span>Lista de inactivos</span>
          </h2>
          <div className="hidden overflow-x-auto md:block md:rounded-lg md:shadow-md">
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
                {cocinerosInactivosFiltrados.map((c) => renderCocineroRow(c, false))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {cocinerosInactivosFiltrados.map((c) => renderCocineroCard(c, false))}
          </div>
        </section>
      )}

      {!loadingList &&
        cocinerosActivosFiltrados.length === 0 &&
        cocinerosInactivosFiltrados.length === 0 && (
          <p>No hay cocineros registrados.</p>
        )}
    </div>
  );
};

export default CocinerosList;
