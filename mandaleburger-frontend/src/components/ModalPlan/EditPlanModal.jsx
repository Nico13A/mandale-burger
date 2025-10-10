import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Input from "../Input/Input";

const EditPlanModal = ({ plan, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        max_monthly_publications: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                price: plan.price,
                description: plan.description,
                max_monthly_publications: plan.max_monthly_publications
            });
            setErrors({});
        }
    }, [plan]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await onSave(plan.id, formData);
            onClose();
        } catch (err) {
            const newErrors = {};
            if (err.non_field_errors) newErrors.general = err.non_field_errors.join(", ");
            if (err.detail) newErrors.general = err.detail;
            ["name", "price", "description", "max_monthly_publications"].forEach((field) => {
                if (err[field]) newErrors[field] = err[field].join(", ");
            });
            setErrors(newErrors);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>

            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg z-10">
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-5 right-5 text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-bold mb-4">Editar Plan</h2>

                {errors.general && <p className="text-red-500 text-sm mb-2">{errors.general}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nombre del plan"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <Input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Precio mensual"
                            required
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>

                    <div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción"
                            className="px-4 py-3 border border-gray-300 rounded-md shadow-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition placeholder-gray-400 text-sm md:text-base w-full"
                            required
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    <div>
                        <Input
                            type="number"
                            name="max_monthly_publications"
                            value={formData.max_monthly_publications}
                            onChange={handleChange}
                            placeholder="Máx publicaciones mensuales"
                            required
                        />
                        {errors.max_monthly_publications && <p className="text-red-500 text-sm">{errors.max_monthly_publications}</p>}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="cursor-pointer px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlanModal;
