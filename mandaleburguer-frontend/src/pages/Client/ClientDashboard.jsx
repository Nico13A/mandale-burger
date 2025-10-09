import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import Buscador from "../../components/Buscador/Buscador";
import BotonesFiltros from "../../components/BotonesFiltros/BotonesFiltros";
import BotonCocineroDia from "../../components/BotonCocineroDia/BotonCocineroDia";
import SwiperSection from "../../components/SwiperSection/SwiperSection";
import useSwiperControls from "../../hooks/useSwiperControls";

import ModalCocinero from "../../components/ModalCocinero/ModalCocinero";
import { useCocineroDelDia } from "../../hooks/useCocineroDelDia";
import { usePlanesDeSuscripcion } from "../../hooks/usePlanesDeSuscripcion";
import CardPlan from "../../components/CardPlan/CardPlan";
import { useSuscripcionUsuario } from "../../hooks/useSuscripcionUsuario";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const { cocineroActual } = useCocineroDelDia();
  const { planes, cargando: cargandoPlanes, error: errorPlanes } = usePlanesDeSuscripcion();
  const { suscripcion, cargando: cargandoSuscripcion, crearSuscripcion } = useSuscripcionUsuario();

  const prevRefPromos = useRef(null);
  const nextRefPromos = useRef(null);
  const prevRefTop = useRef(null);
  const nextRefTop = useRef(null);

  const { isBeginning: isBeginningPromos, isEnd: isEndPromos, onSwiperInit: onSwiperPromos } = useSwiperControls();
  const { isBeginning: isBeginningTop, isEnd: isEndTop, onSwiperInit: onSwiperTop } = useSwiperControls();

  const hamburguesas = [
    { id: 1, nombre: "Hamburguesa Vegana" },
    { id: 2, nombre: "Hamburguesa Clásica" },
    { id: 3, nombre: "Hamburguesa Sin TACC" },
    { id: 4, nombre: "Hamburguesa con Queso" },
    { id: 5, nombre: "Hamburguesa BBQ" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleVerCocinero = () => {
    setModalAbierto(true);
  };

  const handleSeleccionPlan = async (planId) => {
    try {
      await crearSuscripcion(planId);
      toast.success("Suscripción creada con éxito");
    } catch (err) {
      const mensaje = err?.non_field_errors?.[0] || "Error al suscribirse";
      toast.error(mensaje);
    }
  };

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Buscador */}
      <Buscador value={search} onChange={setSearch} />

      {/* Filtros */}
      <BotonesFiltros
        opciones={["Hamburguesa Vegana", "Sin TACC", "Clásicas", "Con Queso"]}
        onSelect={setSelectedFilter}
      />

      {/* Botón Cocinero del Día */}
      <BotonCocineroDia onClick={handleVerCocinero} />

      {/* Bienvenida y Logout */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold mb-2">Bienvenido {user.username}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Sección Promociones */}
      <SwiperSection
        title="Promociones"
        items={hamburguesas}
        prevRef={prevRefPromos}
        nextRef={nextRefPromos}
        isBeginning={isBeginningPromos}
        isEnd={isEndPromos}
        onSwiper={onSwiperPromos}
      />

      {/* Sección Lo más vendido */}
      <SwiperSection
        title="Lo más vendido"
        items={hamburguesas}
        prevRef={prevRefTop}
        nextRef={nextRefTop}
        isBeginning={isBeginningTop}
        isEnd={isEndTop}
        onSwiper={onSwiperTop}
      />

      {/* Sección Planes de suscripción */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-2">Planes de Suscripción</h2>

        {(cargandoPlanes || cargandoSuscripcion) && <p className="text-gray-500">Cargando planes...</p>}
        {errorPlanes && <p className="text-red-500">{errorPlanes}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {planes.map((plan) => (
            <CardPlan
              key={plan.id}
              plan={plan}
              suscripcionActiva={suscripcion?.plan?.id === plan.id}
              onSelect={handleSeleccionPlan}
            />
          ))}
        </div>
      </section>

      {/* Modal Cocinero del Día */}
      <ModalCocinero
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cocineroDia={cocineroActual}
      />
    </div>
  );
};

export default ClientDashboard;



