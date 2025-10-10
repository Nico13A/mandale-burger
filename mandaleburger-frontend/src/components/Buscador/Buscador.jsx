import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const Buscador = ({ value, onChange }) => {
    const handleClear = () => onChange("");
    return (
        <div className="relative mt-6 mb-3">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {value ? (
                    <button onClick={handleClear} className="focus:outline-none cursor-pointer">
                        <XMarkIcon className="h-5 w-5 text-gray-300" />
                    </button>
                ) : (
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
                )}
            </div>
            <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-sm md:text-base w-full pl-3 pr-10 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-naranja-boton"
            />
        </div>
    );
}

export default Buscador;
