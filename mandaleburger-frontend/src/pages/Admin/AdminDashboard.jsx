import { useState } from "react";
import { usePlanesDeSuscripcion } from "../../hooks/usePlanesDeSuscripcion";
import { usePlanAdmin } from "../../hooks/usePlanAdmin";
import CardPlanAdmin from "../../components/CardPlan/CardPlanAdmin";
import CreatePlanModal from "../../components/ModalPlan/CreatePlanModal";
import EditPlanModal from "../../components/ModalPlan/EditPlanModal";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { planes, cargando: cargandoPlanes, error, recargar } = usePlanesDeSuscripcion();
  const { crearPlan, editarPlan, activarPlan, desactivarPlan } = usePlanAdmin();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // ----------------------------
  // Editar plan
  // ----------------------------
  const handleEdit = (planId) => {
    const plan = planes.find(p => p.id === planId);
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleSave = async (planId, data) => {
    try {
      await editarPlan(planId, data);
      setEditModalOpen(false);
      recargar();
    } catch (err) {
      throw err;
    }
  };

  // ----------------------------
  // Crear plan
  // ----------------------------
  const handleCreate = async (data) => {
    try {
      await crearPlan(data);
      setCreateModalOpen(false);
      recargar();
    } catch (err) {
      throw err;
    }
  };

  // ----------------------------
  // Activar / Desactivar plan
  // ----------------------------
  const handleDeactivate = async (planId) => {
    try {
      await desactivarPlan(planId);
      recargar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (planId) => {
    try {
      await activarPlan(planId);
      recargar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoToPromotion = () => {
    navigate("/admin/promociones/nuevo");
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 pb-25 md:pb-0">
      <h1 className="text-4xl font-bold mb-6 text-gris-boton">
        Panel de Administrador
      </h1>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2 bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer text-white rounded-2xl font-semibold transition"
        >
          Crear plan
        </button>
        <button
          onClick={handleGoToPromotion}
          className="px-5 py-2 bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer text-white rounded-2xl font-semibold transition"
        >
          Crear promoción
        </button>
      </div>

      {/* Estado de carga y errores */}
      {cargandoPlanes && <Loading />}
      {error && <p className="text-red-500">{error}</p>}

      {/* Grilla de planes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {planes.map(plan => (
          <CardPlanAdmin
            key={plan.id}
            plan={plan}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
          />
        ))}
      </div>

      {/* Modales */}
      <EditPlanModal
        plan={selectedPlan}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSave}
      />
      <CreatePlanModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
};

export default AdminDashboard;

