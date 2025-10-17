import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIngredientes } from "../../hooks/useIngredientes";
import { useObtenerPromo } from "../../hooks/useObtenerPromo";
import { usePromocionAdmin } from "../../hooks/usePromocionAdmin";
import { usePlanesDeSuscripcion } from "../../hooks/usePlanesDeSuscripcion";
import { useActualizarPlanPromo } from "../../hooks/useActualizarPlanPromo";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import Loading from "../../components/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const AdminPromocionEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks
  const { promo, cargando: cargandoPromo, error: errorPromo } = useObtenerPromo(id);
  const { editarPromo, cargando: cargandoEdicion } = usePromocionAdmin();
  const { planes, cargando: cargandoPlanes, error: errorPlanes } = usePlanesDeSuscripcion();
  const { actualizarPlan, cargando: cargandoPlan } = useActualizarPlanPromo();
  const { ingredientes: categorias, cargando: cargandoIng, error: errorIng } = useIngredientes();

  console.log(promo);
  

  // Estados
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    img: null,
    plan: "", 
  });

  const [seleccionados, setSeleccionados] = useState({});
  const [errors, setErrors] = useState({});
  const [openCategories, setOpenCategories] = useState({});

  // Precargar datos de la promoción
  useEffect(() => {
    if (!promo) return;

    setFormData({
      name: promo.name,
      description: promo.description,
      price: promo.price,
      img: null,
      plan: promo.plan_id ? parseInt(promo.plan_id) : "",
    });

    // Precargar cantidades de ingredientes
    const precargados = {};
    promo.ingredients?.forEach((ingPromo) => {
      categorias.forEach((cat) => {
        cat.ingredients.forEach((ingCat) => {
          if (ingCat.name === ingPromo.ingredient) {
            precargados[ingCat.id] = ingPromo.quantity;
          }
        });
      });
    });
    setSeleccionados(precargados);
  }, [promo, categorias]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      setFormData((prev) => ({ ...prev, img: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCantidad = (id, value) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: value > 0 ? parseInt(value) : undefined,
    }));
  };

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.price) newErrors.price = "El precio es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ingredients_data = Object.entries(seleccionados)
      .filter(([_, quantity]) => quantity && quantity > 0)
      .map(([ingredient_id, quantity]) => ({
        ingredient_id: parseInt(ingredient_id),
        quantity,
      }));

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("price", parseFloat(formData.price));
    if (formData.img) dataToSend.append("img", formData.img);
    dataToSend.append("ingredients_data", JSON.stringify(ingredients_data));

    try {
      await editarPromo(promo.id, dataToSend);

      await actualizarPlan({
        promotion_id: promo.id,
        subscription_id: formData.plan || null,
      });

      toast.success("Promoción actualizada con éxito", {
        autoClose: 2000,
        onClose: () => navigate("/admin"),
      });
    } catch (err) {
      toast.error("Error al actualizar la promoción", { autoClose: 3000 });
      console.error(err);
    }
  };

  // Loader / errores
  if (cargandoIng || cargandoPromo || cargandoPlanes) {
    return (
      <div className="w-full flex justify-center items-center mt-6">
        <Loading />
      </div>
    );
  }
  if (errorIng) return <p className="text-red-500">{errorIng}</p>;
  if (errorPlanes) return <p className="text-red-500">{errorPlanes}</p>;
  if (errorPromo) return <p className="text-red-500">{errorPromo}</p>;
  if (!promo) return <p>Promoción no encontrada</p>;

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

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Editar promoción</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="text-sm text-naranja-boton-hover mb-1 block">Nombre</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la promoción"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="text-sm text-naranja-boton-hover mb-1 block">Descripción</label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción de la promoción"
          />
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="price" className="text-sm text-naranja-boton-hover mb-1 block">Precio</label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Precio"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>

        {/* Imagen */}
        <div>
          <label htmlFor="img" className="text-sm text-naranja-boton-hover mb-1 block">Imagen</label>
          {promo.img && !formData.img && (
            <img src={promo.img} alt="Imagen actual" className="w-32 h-32 object-cover mb-2 rounded" />
          )}
          <Input
            id="img"
            name="img"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Ingredientes */}
        <div>
          <h4 className="font-semibold mb-2">Ingredientes por categoría</h4>
          {categorias.map((cat) => (
            <div key={cat.id} className="mb-2 border rounded">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex justify-between items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 font-medium text-left"
              >
                <span>{cat.name}</span>
                {openCategories[cat.id] ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-600 cursor-pointer" />
                )}
              </button>
              {openCategories[cat.id] && (
                <div className="px-4 py-2">
                  {cat.ingredients.map((ing) => (
                    <div key={ing.id} className="flex items-center gap-2 mb-1">
                      <label htmlFor={`ingredient-${ing.id}`} className="flex-1">{ing.name}</label>
                      <Input
                        id={`ingredient-${ing.id}`}
                        type="number"
                        min="0"
                        value={seleccionados[ing.id] ?? ""}
                        onChange={(e) => handleCantidad(ing.id, e.target.value)}
                        className="max-w-20"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selector de plan */}
        <div className="mb-4">
          <label className="text-sm text-naranja-boton-hover mb-1 block">
            Plan de suscripción (opcional)
          </label>
          <div className="flex flex-col gap-2">
            {planes.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md cursor-pointer ${formData.plan === plan.id ? "bg-orange-100" : "bg-gray-100 hover:bg-orange-100"}`}
              >
                <span>{plan.name}</span>
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={formData.plan === plan.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan: parseInt(e.target.value) }))}
                  className="accent-naranja-boton-hover" 
                />
              </label>
            ))}
            <label className="flex items-center justify-between px-4 py-3 border rounded cursor-pointer bg-gray-100 border-gray-300 hover:bg-orange-100">
              <span>Ningún plan</span>
              <input
                type="radio"
                name="plan"
                value=""
                checked={formData.plan === ""}
                onChange={() => setFormData(prev => ({ ...prev, plan: "" }))}
                className="accent-naranja-boton-hover"
              />
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={cargandoEdicion || cargandoPlan}
        >
          {(cargandoEdicion || cargandoPlan) ? <Spinner /> : "Actualizar promoción"}
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AdminPromocionEditForm;

