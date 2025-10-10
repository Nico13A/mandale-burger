import { useEffect, useState, useMemo } from "react";
import { useCocineros } from "../../hooks/useCocineros";
import { useCocineroDelDia } from "../../hooks/useCocineroDelDia";
import { getCocineroDelDiaActual } from "../../services/cocineroDia";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/Loading/Loading";
import CocineroActions from "../../components/CocineroActions/CocineroActions";
import DropdownLista from "../../components/DropdownLista/DropdownLista";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

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
  const [tipoLista, setTipoLista] = useState("activos");
  const navigate = useNavigate();

  // ------------------ Fetch cocinero del día ----------------
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

  // ------------------ Handlers ----------------
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

  const handleTipoListaChange = (value) => {
    setTipoLista(value);
    setSearchTerm("");
  };

  // ------------------ Filtrado ----------------
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
      palabras.every(
        (palabra) =>
          c.first_name.toLowerCase().includes(palabra) ||
          c.last_name.toLowerCase().includes(palabra)
      )
    );
  }, [searchTerm, cocinerosInactivos]);

  // ------------------ Render filas y cards ----------------
  const renderCocineroRow = (c, isActive = true) => (
    <tr
      key={c.id}
      className="border-b last:border-b-0 hover:bg-orange-100 odd:bg-white even:bg-orange-50 transition-colors duration-200"
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
        <p className="font-semibold">{c.first_name} {c.last_name}</p>
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

  // ------------------ Lista filtrada ----------------
  const listaFiltrada =
    tipoLista === "activos" ? cocinerosActivosFiltrados : cocinerosInactivosFiltrados;
  const ListaIcon = tipoLista === "activos" ? CheckCircleIcon : XCircleIcon;
  const listaColor = tipoLista === "activos" ? "text-orange-400" : "text-red-400";

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 pb-25 md:pb-0">
      <div className="flex justify-between items-center space-x-2 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Cocineros</h1>
        <div className="flex space-x-2 items-center">
          {/* Desktop search */}
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
          {/* Dropdown desktop */}
          <div className="hidden md:block">
            <DropdownLista
              options={[
                { value: "activos", label: "Activos" },
                { value: "inactivos", label: "Inactivos" },
              ]}
              value={tipoLista}
              onChange={handleTipoListaChange}
              className="w-36"
            />
          </div>
        </div>
      </div>

      {/* Mobile search + dropdown */}
      <div className="md:hidden flex flex-col space-y-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          className="px-4 py-2 w-full border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-botoborder-gris-boton focus:border-gris-boton transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DropdownLista
          options={[
            { value: "activos", label: "Activos" },
            { value: "inactivos", label: "Inactivos" },
          ]}
          value={tipoLista}
          onChange={handleTipoListaChange}
          className="w-full"
        />
      </div>

      {loadingList && <Loading />}
      {error && <p className="text-red-500">{error}</p>}

      {/* Lista */}
      {!loadingList && listaFiltrada.length > 0 && (
        <section className="w-full">
          <h2 className={`font-medium text-lg md:text-2xl mt-6 mb-2 flex items-center space-x-2 ${listaColor}`}>
            <ListaIcon className="w-5 h-5" />
            <span>Lista de {tipoLista}</span>
          </h2>

          {/* Desktop */}
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
                {listaFiltrada.map((c) => renderCocineroRow(c, tipoLista === "activos"))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col space-y-3">
            {listaFiltrada.map((c) => renderCocineroCard(c, tipoLista === "activos"))}
          </div>
        </section>
      )}

      {!loadingList && listaFiltrada.length === 0 && (
        <p>No hay cocineros registrados.</p>
      )}
    </div>
  );
};

export default CocinerosList;


