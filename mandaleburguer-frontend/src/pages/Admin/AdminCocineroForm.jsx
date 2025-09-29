import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCocineros } from "../../hooks/useCocineros";
import Input from "../../components/Input/Input";
import InputDisabled from "../../components/InputDisabled/InputDisabled";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const AdminCocineroForm = ({isEdit = false}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleCreate, handleUpdate, cocinerosActivos, cocinerosInactivos, loadingAction } =
    useCocineros();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    image: null,
    formacion: "", 
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (isEdit && id) {
      const todos = [...cocinerosActivos, ...cocinerosInactivos];
  
      if (todos.length === 0) return;
  
      const cocinero = todos.find((c) => c.id === parseInt(id));
  
      if (!cocinero) {
        navigate("/admin/cocineros", { replace: true });
        return;
      }
  
      setFormData({
        username: cocinero.username,
        email: cocinero.email,
        password: "",
        first_name: cocinero.first_name,
        last_name: cocinero.last_name,
        image: null,
        formacion: cocinero.profile?.formacion || "", 
      });
    }
  }, [isEdit, id, cocinerosActivos, cocinerosInactivos, navigate]);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "El usuario es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!isEdit && !formData.password)
      newErrors.password = "La contraseña es obligatoria";
    if (!formData.first_name) newErrors.first_name = "El nombre es obligatorio";
    if (!formData.last_name) newErrors.last_name = "El apellido es obligatorio";
    if (!formData.formacion) newErrors.formacion = "La formación es obligatoria"; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) dataToSend.append(key, value);
    });
  
    try {
      if (isEdit) {
        await handleUpdate(id, dataToSend);
        toast.success("Cocinero actualizado correctamente", {
          autoClose: 3000,
          onClose: () => navigate("/admin/cocineros"),
        });
      } else {
        await handleCreate(dataToSend);
        toast.success("Cocinero creado correctamente", {
          autoClose: 3000,
          onClose: () => navigate("/admin/cocineros"),
        });
      }
    } catch (err) {
      if (err.password) {
        err.password = err.password.map((msg) =>
          msg.includes("This password is too short")
            ? "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."
            : msg
        );
      }
      setErrors(err);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-6 pb-25">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center cursor-pointer text-gris-boton hover:text-gris-boton-hover font-medium px-2 py-1 text-sm mb-2 md:hidden"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2 text-naranja-boton hover:text-naranja-boton-hover" />
        Volver
      </button>
  
      <h2 className="text-2xl md:text-3xl font-bold text-gris-boton mb-6">
        {isEdit ? "Editar cocinero" : "Registrar cocinero"}
      </h2>
  
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Usuario</label>
          <InputDisabled
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingrese el nombre de usuario"
            readOnly={isEdit}
            disabled={loadingAction}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
  
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese el email"
            disabled={loadingAction}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
  
        {!isEdit && (
          <div>
            <label className="text-sm text-naranja-boton-hover mb-1 block">Contraseña</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese la contraseña"
              disabled={loadingAction}
            />
            {errors.password &&
              (Array.isArray(errors.password) ? (
                <ul className="text-red-500 text-sm list-disc ml-5">
                  {errors.password.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-500 text-sm">{errors.password}</p>
              ))}
          </div>
        )}
  
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Nombre</label>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            disabled={loadingAction}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </div>
  
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Apellido</label>
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Ingrese el apellido"
            disabled={loadingAction}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </div>
  
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Formación</label>
          <Input
            name="formacion"
            value={formData.formacion}
            onChange={handleChange}
            placeholder="Ingrese la formación del cocinero"
            disabled={loadingAction}
          />
          {errors.formacion && <p className="text-red-500 text-sm">{errors.formacion}</p>}
        </div>
  
        {!isEdit && (
          <div>
            <label className="text-sm text-naranja-boton-hover mb-1 block">Imagen</label>
            <Input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              disabled={loadingAction}
            />
          </div>
        )}
  
        <Button
          type="submit"
          className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={loadingAction}
        >
          {loadingAction ? <Spinner /> : isEdit ? "Actualizar cocinero" : "Registrar cocinero"}
        </Button>
      </form>
  
      <ToastContainer />
    </div>
  );
}

export default AdminCocineroForm;

