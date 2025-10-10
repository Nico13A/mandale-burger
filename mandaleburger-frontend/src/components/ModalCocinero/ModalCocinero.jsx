import { useEffect, useState } from "react";

const ModalCocinero = ({ abierto, onClose, cocineroDia }) => {
    const [mostrar, setMostrar] = useState(abierto);

    useEffect(() => {
        if (abierto) setMostrar(true);
        else {
            const timeout = setTimeout(() => setMostrar(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [abierto]);

    useEffect(() => {
        document.body.style.overflow = abierto ? "hidden" : "";
    }, [abierto]);

    if (!mostrar) return null;

    const cocinero = cocineroDia?.cocinero;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
            aria-modal
            role="dialog"
        >
            <div
                className={`w-full max-w-xs md:max-w-lg rounded-2xl bg-white text-gris-boton shadow-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 ${abierto ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
            >
                {cocinero ? (
                    <>
                        <h2 className="text-lg md:text-2xl font-bold mb-4">
                            ¿Quién es el cocinero de hoy?
                        </h2>

                        <div className="w-40 h-40 md:w-50 md:h-50 mb-4 rounded-full overflow-hidden ring-4 ring-gris-boton shadow-lg">
                            <img
                                src={
                                    cocinero?.profile?.image
                                        ? `${import.meta.env.VITE_API_URL}${cocinero.profile.image}`
                                        : "/images/default-cocinero.jpg"
                                }
                                alt="Cocinero"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h3 className="text-xl font-medium capitalize">
                            {cocinero?.first_name} {cocinero?.last_name}
                        </h3>

                        {cocinero?.profile?.formacion && (
                            <p className="mt-2">
                                <span className="font-medium text-naranja-boton">
                                    Formación:
                                </span>{" "}
                                {cocinero.profile.formacion}
                            </p>
                        )}
                    </>
                ) : (
                    <h2 className="text-xl font-semibold text-red-300">
                        No hay cocinero del día cargado
                    </h2>
                )}

                <button
                    onClick={onClose}
                    className={`cursor-pointer mt-6 px-4 py-2 rounded-2xl shadow-md transition ${cocinero ? "bg-naranja-boton text-white hover:bg-naranja-boton-hover" : "bg-gris-boton text-white hover:bg-gris-boton-hover"}`}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default ModalCocinero;
