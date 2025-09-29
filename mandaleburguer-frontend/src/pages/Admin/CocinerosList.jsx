import { useEffect, useState } from "react";
import { useCocineros } from "../../hooks/useCocineros";
import { useCocineroDelDia } from "../../hooks/useCocineroDelDia";
import { getCocineroDelDiaActual } from "../../services/cocineroDia";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
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

  const renderCocineroRow = (c, isActive = true) => (
    <tr
      key={c.id}
      className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
        cocineroDelDiaId === c.id ? "bg-yellow-100" : ""
      }`}
    >
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
      className={`bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200 ${
        cocineroDelDiaId === c.id ? "bg-yellow-100" : ""
      }`}
    >
      {c.profile?.image ? (
        <img
          src={c.profile.image}
          alt={`${c.first_name} ${c.last_name}`}
          className="w-16 h-16 rounded-full object-cover mb-2"
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cocineros</h2>
        <button
          onClick={() => navigate("/admin/cocineros/nuevo")}
          className="flex items-center px-4 py-2 text-white rounded bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar
        </button>
      </div>

      {loadingList && <Loading />}
      {error && <p className="text-red-500">{error}</p>}

      {!loadingList && cocinerosActivos.length > 0 && (
        <>
          <h3 className="font-semibold mb-2">Activos</h3>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Apellido</th>
                  <th className="py-2 px-4 text-left">Usuario</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cocinerosActivos.map((c) => renderCocineroRow(c))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {cocinerosActivos.map((c) => renderCocineroCard(c))}
          </div>
        </>
      )}

      {!loadingList && cocinerosInactivos.length > 0 && (
        <>
          <h3 className="font-semibold mt-6 mb-2">Inactivos</h3>
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Apellido</th>
                  <th className="py-2 px-4 text-left">Usuario</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cocinerosInactivos.map((c) => renderCocineroRow(c, false))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col space-y-3">
            {cocinerosInactivos.map((c) => renderCocineroCard(c, false))}
          </div>
        </>
      )}

      {!loadingList && cocinerosActivos.length === 0 && cocinerosInactivos.length === 0 && (
        <p>No hay cocineros registrados.</p>
      )}
    </div>
  );
};

export default CocinerosList;
