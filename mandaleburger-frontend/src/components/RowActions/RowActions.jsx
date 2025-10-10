import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const RowActions = ({
  item,
  isActive,
  loadingId = { id: null, action: "" },
  navigate,
  editPath,
  handleDelete,
  handleActivate
}) => (
  <div className="flex justify-end md:justify-center space-x-3">
    {/* Botón Editar */}
    <button
      onClick={() => navigate(`${editPath}/${item.id.toString()}`)} 
      className="text-gris-boton hover:text-gris-boton-hover flex items-center cursor-pointer"
    >
      <PencilIcon className="w-5 h-5 mr-1" /> Editar
    </button>

    {/* Botón Eliminar o Activar */}
    <button
      onClick={() => (isActive ? handleDelete(item.id) : handleActivate(item.id))}
      className={`flex items-center cursor-pointer ${
        isActive ? "text-red-400 hover:text-red-500" : "text-green-600 hover:text-green-700"
      }`}
      disabled={
        loadingId?.id === item.id &&
        loadingId?.action === (isActive ? "eliminar" : "activar")
      }
    >
      {loadingId?.id === item.id &&
      loadingId?.action === (isActive ? "eliminar" : "activar") ? (
        <span className="animate-spin inline-block w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full" />
      ) : isActive ? (
        <TrashIcon className="w-5 h-5 mr-1" />
      ) : null}
      {isActive ? "Eliminar" : "Activar"}
    </button>
  </div>
);

export default RowActions;



