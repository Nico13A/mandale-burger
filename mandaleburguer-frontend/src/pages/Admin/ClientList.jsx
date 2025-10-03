import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../../hooks/useClientes";
import ListSection from "../../components/ListSection/ListSection";
import RowActions from "../../components/RowActions/RowActions";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/Loading/Loading";

const ClientList = () => {
  const {
    clientesActivos,
    clientesInactivos,
    loadingList,
    loadingAction,
    error,
    handleActivate,
    handleDeactivate
  } = useClientes();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ---------------- Render filas ----------------
  const renderRowCliente = (c) => (
    <tr
      key={c.id}
      className="border-b last:border-b-0 hover:bg-orange-100 odd:bg-white even:bg-orange-50 transition-colors duration-200"
    >
      <td className="py-2 px-4 bg-gris-boton text-white text-center w-16 min-w-[64px]">{c.id}</td>
      <td className="py-2 px-4">{c.first_name}</td>
      <td className="py-2 px-4">{c.last_name}</td>
      <td className="py-2 px-4">{c.username}</td>
      <td className="py-2 px-4 text-center">
        <RowActions
          item={c}
          isActive={c.is_active}
          loadingId={loadingAction}
          navigate={navigate}
          editPath="/admin/clientes/editar"
          handleDelete={handleDeactivate}
          handleActivate={handleActivate}
        />
      </td>
    </tr>
  );

  // ---------------- Render cards (mobile) ----------------
  const renderCardCliente = (c) => (
    <div
      key={c.id}
      className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <p className="font-semibold">{c.first_name} {c.last_name}</p>
      <p className="text-gray-500 text-sm">@{c.username}</p>
      <div className="mt-2">
        <RowActions
          item={c}
          isActive={c.is_active}
          loadingId={loadingAction}
          navigate={navigate}
          editPath="/admin/clientes/editar"
          handleDelete={handleDeactivate}
          handleActivate={handleActivate}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 pb-25 md:pb-0">
      <div className="flex justify-between items-center space-x-2 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido"
            className="hidden md:block px-4 py-2 w-64 md:w-72 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-botoborder-gris-boton focus:border-gris-boton transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Input mobile */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        className="md:hidden px-4 py-2 w-full border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-botoborder-gris-boton focus:border-gris-boton transition-all duration-200 mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loadingList && <Loading />}
      {error && <p className="text-red-500">{error}</p>}

      {!loadingList && (
        <>
          {clientesActivos.length>0 && (
            <ListSection
              title="Lista de activos"
              colorTitle="text-naranja-boton"
              items={clientesActivos}
              renderRow={renderRowCliente}
              renderCard={renderCardCliente}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              Icon={CheckCircleIcon}
              iconColor="text-orange-400"
            />
          )}

          {clientesInactivos.length>0 && (
            <ListSection
              title="Lista de inactivos"
              colorTitle="text-red-400"
              items={clientesInactivos}
              renderRow={renderRowCliente}
              renderCard={renderCardCliente}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              Icon={XCircleIcon}
              iconColor="text-red-500"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ClientList;







