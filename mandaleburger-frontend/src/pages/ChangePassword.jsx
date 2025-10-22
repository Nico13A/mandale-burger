import { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Spinner from "../components/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { changePassword, loading } = useChangePassword();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
    });

    const [errors, setErrors] = useState({});

    const handleBack = () => {
        if (user?.groups.includes("AppAdmin")) {
            navigate("/admin/profile");
        } else if (user?.groups.includes("Cook")) {
            navigate("/cook");
        } else {
            navigate("/client");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(formData);
            toast.success("Contraseña cambiada correctamente", {
                autoClose: 1500,
                onClose: () => navigate("/profile"),
            });
        } catch (err) {
            const adaptedErrors = {};
            if (err.current_password) {
                adaptedErrors.current_password = err.current_password;
            }
            if (err.new_password) {
                adaptedErrors.new_password = err.new_password.map((msg) =>
                    msg.includes("This password is too short")
                        ? "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."
                        : msg
                );
            }
            setErrors(adaptedErrors);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100 text-gris-boton flex items-center justify-center p-6">

            {/* Botón volver */}
            <button
                type="button"
                onClick={handleBack}
                className="absolute top-6 left-6 flex items-center cursor-pointer text-gris-boton hover:text-gris-boton-hover font-medium px-2 py-1 text-sm md:text-base"
            >
                <ArrowLeftIcon className="w-6 h-6 mr-2 text-naranja-boton hover:text-naranja-boton-hover" />
                Volver
            </button>

            {/* Formulario */}
            <div className="w-full max-w-md mt-6 p-5">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Cambiar contraseña</h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    {/* Contraseña actual */}
                    <div>
                        <label className="text-sm text-naranja-boton-hover mb-1 block">
                            Contraseña actual
                        </label>
                        <Input
                            name="current_password"
                            type="password"
                            value={formData.current_password}
                            onChange={handleChange}
                            placeholder="Ingrese su contraseña actual"
                            disabled={loading}
                        />
                        {errors.current_password && (
                            <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>
                        )}
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <label className="text-sm text-naranja-boton-hover mb-1 block">
                            Nueva contraseña
                        </label>
                        <Input
                            name="new_password"
                            type="password"
                            value={formData.new_password}
                            onChange={handleChange}
                            placeholder="Ingrese la nueva contraseña"
                            disabled={loading}
                        />
                        {errors.new_password && (
                            Array.isArray(errors.new_password) ? (
                                errors.new_password.length > 1 ? (
                                    <ul className="text-red-500 text-sm list-disc ml-5 mt-1">
                                        {errors.new_password.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.new_password[0]}
                                    </p>
                                )
                            ) : <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : "Cambiar contraseña"}
                    </Button>
                </form>
            </div>

            <ToastContainer />
        </div>
    );
};

export default ChangePassword;


