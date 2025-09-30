import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const CocineroActions = ({
  cocinero,
  isActive,
  cocineroDelDiaId,
  loadingId,
  handleDeactivate,
  handleActivate,
  handleAsignar,
  navigate,
}) => (
  <div className="flex justify-end space-x-3 mt-4 md:mt-0">
    {/* Botón Editar */}
    <button
      onClick={() => navigate(`/admin/cocineros/editar/${cocinero.id}`)}
      className="text-gris-boton hover:text-gris-boton-hover flex items-center cursor-pointer"
    >
      <PencilIcon className="w-5 h-5 mr-1" /> Editar
    </button>

    {isActive ? (
      <>
        {/* Botón Eliminar */}
        <button
          onClick={() => handleDeactivate(cocinero.id)}
          className="text-red-400 hover:text-red-500 flex items-center cursor-pointer"
          disabled={loadingId.id === cocinero.id && loadingId.action === "eliminar"}
        >
          {loadingId.id === cocinero.id && loadingId.action === "eliminar" ? (
            <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full" />
          ) : (
            <TrashIcon className="w-5 h-5 mr-1" />
          )}
          Eliminar
        </button>

        {/* Botón Asignar si no es cocinero del día */}
        {cocinero.id !== cocineroDelDiaId && (
          <button
            onClick={() => handleAsignar(cocinero.id)}
            className="text-yellow-500 hover:text-yellow-600 flex items-center cursor-pointer"
            disabled={loadingId.id === cocinero.id && loadingId.action === "asignar"}
          >
            {loadingId.id === cocinero.id && loadingId.action === "asignar" ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full" />
            ) : (
              "Asignar"
            )}
          </button>
        )}
      </>
    ) : (
      // Botón Activar para inactivos
      <button
        onClick={() => handleActivate(cocinero.id)}
        className="text-green-600 hover:text-green-700 flex items-center cursor-pointer"
        disabled={loadingId.id === cocinero.id && loadingId.action === "activar"}
      >
        {loadingId.id === cocinero.id && loadingId.action === "activar" ? (
          <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full" />
        ) : (
          "Activar"
        )}
      </button>
    )}
  </div>
);

export default CocineroActions;
