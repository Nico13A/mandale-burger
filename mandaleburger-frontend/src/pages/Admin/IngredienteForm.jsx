import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIngredientesCRUD } from "../../hooks/useIngredientesCRUD";
import { getCategories } from "../../services/categorias";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IngredienteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { ingredientes, editarIngrediente, agregarIngrediente } = useIngredientesCRUD();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        stock: "",
        is_vegan: false,
        is_gluten_free: false,
        category: "",
        img: null,
    });

    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategorias(data);
            } catch (err) {
                console.error("No se pudieron cargar las categorías", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (id) {
            const ingrediente = ingredientes.find((ing) => ing.id === parseInt(id));
            if (ingrediente) {
                setFormData({
                    name: ingrediente.name,
                    price: ingrediente.price,
                    stock: ingrediente.stock,
                    is_vegan: ingrediente.is_vegan,
                    is_gluten_free: ingrediente.is_gluten_free,
                    category: ingrediente.category_id,
                    img: ingrediente.img || null,
                    is_active: ingrediente.is_active,
                });
            }
        }
    }, [id, ingredientes]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.price || !formData.stock || !formData.category) {
            setError("Por favor, completa todos los campos obligatorios.");
            return;
        }

        try {
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("price", formData.price);
            payload.append("stock", formData.stock);
            payload.append("category", formData.category);
            payload.append("is_vegan", formData.is_vegan);
            payload.append("is_gluten_free", formData.is_gluten_free);

            if (id) {
                payload.append("is_active", formData.is_active ?? true);
            } else {
                payload.append("is_active", true);
            }

            if (formData.img instanceof File) {
                payload.append("img", formData.img);
            }

            if (id) {
                await editarIngrediente(parseInt(id), payload);
                toast.success("Ingrediente editado correctamente", {
                    onClose: () => navigate("/admin/ingredientes"),
                    autoClose: 2000,
                });
            } else {
                await agregarIngrediente(payload);
                toast.success("Ingrediente creado correctamente", {
                    onClose: () => navigate("/admin/ingredientes"),
                    autoClose: 2000,
                });
            }
        } catch (err) {
            setError("Ocurrió un error al guardar el ingrediente.");
            console.error(err);
        }
    };

    return (
        <div className="mb-25 md:mb-auto w-full max-w-xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md">
            <ToastContainer position="top-right" autoClose={2000} />
            <h1 className="text-2xl font-bold mb-6">{id ? "Editar Ingrediente" : "Nuevo Ingrediente"}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1">Nombre *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-naranja-boton"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Precio *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-naranja-boton"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-semibold mb-1">Stock *</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-naranja-boton"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Categoría *</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-naranja-boton"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_vegan"
                            checked={formData.is_vegan}
                            onChange={handleChange}
                        />
                        <span>Vegano</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="is_gluten_free"
                            checked={formData.is_gluten_free}
                            onChange={handleChange}
                        />
                        <span>Sin gluten</span>
                    </label>
                </div>

                <div>
                    <label className="block font-semibold mb-1">Imagen</label>
                    <input type="file" name="img" className="w-full" onChange={handleChange} />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/ingredientes")}
                        className="cursor-pointer px-4 py-2 bg-gray-300 rounded-2xl hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 bg-naranja-boton text-white rounded-2xl hover:bg-naranja-boton-hover transition-colors"
                    >
                        {id ? "Guardar cambios" : "Crear"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IngredienteForm;
