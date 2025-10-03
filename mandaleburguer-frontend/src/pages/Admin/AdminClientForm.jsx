import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClientes } from "../../hooks/useClientes";
import Input from "../../components/Input/Input";
import InputDisabled from "../../components/InputDisabled/InputDisabled";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const AdminClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clientesActivos, clientesInactivos, handleUpdate } = useClientes();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ------------------- Cargar datos del cliente -------------------
  useEffect(() => {
    if (clientesActivos.length + clientesInactivos.length === 0) return;

    const todos = [...clientesActivos, ...clientesInactivos];
    const cliente = todos.find((c) => c.id === parseInt(id));
    if (!cliente) {
      navigate("/admin/clientes", { replace: true });
      return;
    }

    setFormData({
      username: cliente.username,
      email: cliente.email,
      first_name: cliente.first_name,
      last_name: cliente.last_name,
    });
    setErrors({});
  }, [id, clientesActivos, clientesInactivos, navigate]);

  // ------------------- Manejo de inputs -------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ------------------- Validación simple -------------------
  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "El usuario es obligatorio";
    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.first_name) newErrors.first_name = "El nombre es obligatorio";
    if (!formData.last_name) newErrors.last_name = "El apellido es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------- Envío del formulario -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await handleUpdate(id, formData);
      toast.success("Cliente actualizado correctamente", {
        autoClose: 3000,
        onClose: () => navigate("/admin/clientes"),
      });
    } catch (err) {
      if (err && typeof err === "object") {
        setErrors(err);
      } else {
        setErrors({ general: "Ocurrió un error al actualizar el cliente" });
      }
    } finally {
      setLoading(false);
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

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Editar cliente</h1>

      {/* Error general */}
      {errors.general && (
        <p className="text-red-500 text-sm mb-2">{errors.general}</p>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Usuario</label>
          <InputDisabled
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingrese el usuario"
            readOnly
            disabled={loading}
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
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Nombre</label>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            disabled={loading}
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
            disabled={loading}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </div>

        <Button
          type="submit"
          className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Spinner /> : "Actualizar cliente"}
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AdminClientForm;
