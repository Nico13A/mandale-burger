import { useCocineros } from "../../hooks/useCocineros";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/Loading/Loading";

export default function CocinerosList() {
    const { cocineros, loading, error } = useCocineros();
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
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

            {loading && <Loading />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && cocineros.length === 0 && <p>No hay cocineros registrados.</p>}

            {!loading && !error && cocineros.length > 0 && (
                <>
                    {/* Desktop */}
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
                                {cocineros.map(c => (
                                    <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                        <td className="py-2 px-4">{c.first_name}</td>
                                        <td className="py-2 px-4">{c.last_name}</td>
                                        <td className="py-2 px-4">{c.username}</td>
                                        <td className="py-2 px-4 text-center flex justify-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/cocineros/editar/${c.id}`)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => console.log("Eliminar", c.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex flex-col space-y-3">
                        {cocineros.map(c => (
                            <div key={c.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200">
                                <p className="font-semibold">{c.first_name} {c.last_name}</p>
                                <p className="text-gray-500 text-sm">@{c.username}</p>
                                <div className="flex justify-end space-x-3 mt-2">
                                    <button
                                        onClick={() => navigate(`/admin/cocineros/editar/${c.id}`)}
                                        className="text-blue-500 hover:text-blue-700 flex items-center"
                                    >
                                        <PencilIcon className="w-5 h-5 mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => console.log("Eliminar", c.id)}
                                        className="text-red-500 hover:text-red-700 flex items-center"
                                    >
                                        <TrashIcon className="w-5 h-5 mr-1" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
