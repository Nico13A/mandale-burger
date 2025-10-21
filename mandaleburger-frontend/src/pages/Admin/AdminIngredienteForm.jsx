import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import Loading from "../../components/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";


import { useIngredientes } from "../../hooks/useIngredientes";            
import { useObtenerIngrediente } from "../../hooks/useObtenerIngrediente"; 
import { useCrearIngrediente } from "../../hooks/useCrearIngrediente";     
import { useEditarIngrediente } from "../../hooks/useEditarIngrediente";   

const AdminIngredienteForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const CATEGORY_FIELD = "category"; 
  const isEdit = useMemo(() => mode === "edit" || !!id, [mode, id]);

  // categorías (mismo hook que usás en promos; suele devolver [{id, name, ingredients:[...]}])
  const { ingredientes: categorias, cargando: cargandoCats, error: errorCats } = useIngredientes();
  // Normalizar el array que venga del hook a [{ id, name }]
  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categorias)) return [];

    if (categorias.length > 0 && categorias[0]?.ingredients) {
      return categorias.map(c => ({ id: c.id, name: c.name }));
    }
    const map = new Map();
    for (const ing of categorias) {
      const cat = ing.category || ing.category_obj || null;
      if (cat?.id) map.set(cat.id, { id: cat.id, name: cat.name });
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categorias]);

  useEffect(() => {
  console.log("FORM ACTIVO v5");  // <- cambia el número si volvés a probar
}, []);

  // cargar ingrediente al editar
  const { ingrediente, cargando: cargandoItem, error: errorItem } = useObtenerIngrediente(isEdit ? id : null);

  // acciones crear/editar
  const { crearIngrediente, cargando } = useCrearIngrediente();
  const { editarIngrediente, cargando: cargandoEditar } = useEditarIngrediente();

  // estado del form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: 0,
    is_vegan: false,
    is_gluten_free: false,
    category_id: "",
    img: null, // archivo
  });
  const [errors, setErrors] = useState({});

  // precarga en modo edición
  useEffect(() => {
    if (!isEdit || !ingrediente) return;
    setFormData({
      name: ingrediente.name ?? "",
      price: ingrediente.price ?? "",
      stock: ingrediente.stock ?? 0,
      is_vegan: !!ingrediente.is_vegan,
      is_gluten_free: !!ingrediente.is_gluten_free,
      // asumiendo que el serializer anida category: { id, name }
      category_id: ingrediente.category?.id ?? "",
      img: null, // no cargamos archivo actual
    });
  }, [isEdit, ingrediente]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    if (type === "file") {
      setFormData((prev) => ({ ...prev, img: files?.[0] ?? null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name?.trim()) e.name = "El nombre es obligatorio";
    if (formData.price === "" || isNaN(Number(formData.price))) e.price = "El precio debe ser un número";
    if (formData.stock !== "" && Number(formData.stock) < 0) e.stock = "El stock no puede ser negativo";
    if (!formData.category_id) e.category_id = "Selecciona una categoría";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildPayload = () => {
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("price", parseFloat(formData.price));
  fd.append("stock", parseInt(formData.stock ?? 0, 10));
  fd.append("is_vegan", String(formData.is_vegan));        
  fd.append("is_gluten_free", String(formData.is_gluten_free));
  fd.append(CATEGORY_FIELD, formData.category_id);        
  if (formData.img) fd.append("img", formData.img);
  return fd;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = buildPayload();
      if (isEdit) {
         await editarIngrediente(id, payload);
        toast.success("Ingrediente actualizado con éxito", {
          autoClose: 2000,
          onClose: () => navigate("/admin/ingredientes"),
        });
      } else {
        await crearIngrediente(payload);
        toast.success("Ingrediente creado con éxito", { autoClose: 2000 });
        // limpiar form
        setFormData({
          name: "",
          price: "",
          stock: 0,
          is_vegan: false,
          is_gluten_free: false,
          category_id: "",
          img: null,
        });
      }
    } catch (err) {
      toast.error(err?.message || "Error al guardar el ingrediente", { autoClose: 3000 });
      console.error(err);
    }
  };

  // loaders / errores
  if (cargandoCats || (isEdit && cargandoItem)) {
    return (
      <div className="w-full flex justify-center items-center mt-6">
        <Loading />
      </div>
    );
  }
  if (errorCats) return <p className="text-red-500">{errorCats}</p>;
  if (isEdit && errorItem) return <p className="text-red-500">{errorItem}</p>;

  return (
    <div className="w-full max-w-md mx-auto mt-6 pb-25">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer text-gris-boton hover:text-gris-boton-hover font-medium py-1 text-sm mb-2 md:hidden"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2 text-naranja-boton hover:text-naranja-boton-hover" />
        Volver
      </button>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {isEdit ? "Editar ingrediente" : "Crear ingrediente"}
      </h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Nombre</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Lechuga"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Descripción (opcional) — si tu modelo no tiene, podés quitarlo */}
        {/* 
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Descripción</label>
          <Input
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            placeholder="Descripción del ingrediente"
          />
        </div>
        */}

        {/* Precio */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Precio</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ej: 120.00"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Stock</label>
          <Input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Ej: 50"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full rounded-lg p-2 border border-gray-300"
          >
            <option value="">Selecciona una categoría</option>
            {categoryOptions.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_vegan"
              checked={formData.is_vegan}
              onChange={handleChange}
            />
            <span>Vegano</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_gluten_free"
              checked={formData.is_gluten_free}
              onChange={handleChange}
            />
            <span>Sin gluten</span>
          </label>
        </div>

        {/* Imagen */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Imagen</label>
          <Input
            name="img"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {/* Si querés mostrar la imagen actual en edición:
          {isEdit && ingrediente?.img && !formData.img && (
            <img src={ingrediente.img} alt="Imagen actual" className="w-28 h-28 object-cover rounded mt-2" />
          )} */}
        </div>

        <Button
          type="submit"
          className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={cargando || cargandoEditar}
        >
          {(cargando || cargandoEditar) ? <Spinner /> : (isEdit ? "Actualizar ingrediente" : "Crear ingrediente")}
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AdminIngredienteForm;
