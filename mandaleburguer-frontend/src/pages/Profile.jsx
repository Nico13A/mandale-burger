import { useState, useEffect } from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import Spinner from "../components/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { updateProfile, loading, errors } = useUserProfile();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    formacion: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        formacion: user.profile?.formacion || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = { ...formData };
    if (!user.groups.includes("Cook")) {
      delete dataToSend.formacion;
    }

    try {
      await updateProfile(dataToSend);
      await refreshUser();

      toast.success("Perfil actualizado correctamente", {
        autoClose: 1000,
        onClose: () => navigate("/"),
      });
    } catch (err) {
        console.error("Error al actualizar perfil: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6 pb-25">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mi perfil</h1>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* Usuario */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Usuario</label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingrese el usuario"
            disabled
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Email</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese el email"
            disabled={loading || isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Nombre</label>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            disabled={loading || isSubmitting}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label className="text-sm text-naranja-boton-hover mb-1 block">Apellido</label>
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Ingrese el apellido"
            disabled={loading || isSubmitting}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
        </div>

        {/* Formación (solo para Cook) */}
        {user?.groups.includes("Cook") && (
          <div>
            <label className="text-sm text-naranja-boton-hover mb-1 block">Formación</label>
            <Input
              name="formacion"
              value={formData.formacion}
              onChange={handleChange}
              placeholder="Ingrese la formación"
              disabled={loading || isSubmitting}
            />
            {errors.formacion && <p className="text-red-500 text-sm">{errors.formacion}</p>}
          </div>
        )}

        {/* Botón de envío */}
        <Button
          type="submit"
          className="bg-gris-boton hover:bg-gris-boton-hover shadow-md flex items-center justify-center disabled:opacity-50"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? <Spinner /> : "Actualizar perfil"}
        </Button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Profile;








