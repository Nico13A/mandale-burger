import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";

import Buscador from "../../components/Buscador/Buscador";
import BotonesFiltros from "../../components/BotonesFiltros/BotonesFiltros";
import BotonCocineroDia from "../../components/BotonCocineroDia/BotonCocineroDia";
import SwiperSection from "../../components/SwiperSection/SwiperSection";
import ModalCocinero from "../../components/ModalCocinero/ModalCocinero";
import CardPlan from "../../components/CardPlan/CardPlan";
import Spinner from "../../components/Spinner/Spinner";

import useSwiperControls from "../../hooks/useSwiperControls";
import { useCocineroDelDia } from "../../hooks/useCocineroDelDia";
import { usePlanesDeSuscripcion } from "../../hooks/usePlanesDeSuscripcion";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMercadoPago } from "../../hooks/useMercadoPago";

const ClientDashboard = () => {
  const {
    suscripcionActual,
    setSuscripcionActual,
  } = useOutletContext();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const { cocineroActual } = useCocineroDelDia();
  const { planes, cargando: cargandoPlanes, error: errorPlanes } = usePlanesDeSuscripcion();

  const { pagarPlan, cargando: cargandoPago, error: errorPago } = useMercadoPago();

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

  const handleVerCocinero = () => {
    setModalAbierto(true);
  };

  const handleSeleccionPlan = async (planId) => {
    if (!suscripcionActual || !suscripcionActual?.plan?.id) {
      try {
        await pagarPlan(planId);
      } catch (err) {
        toast.error(err.message || "Error al iniciar el pago");
      }
      return;
    }

    if (suscripcionActual?.plan?.id === planId) {
      toast.info("Ya tenés este plan activo. No podés pagar de nuevo.");
    } else {
      toast.info("Ya tenés otra suscripción activa. No podés elegir otro plan.");
    }
  };

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Buscador value={search} onChange={setSearch} />
      <BotonesFiltros
        opciones={["Hamburguesa Vegana", "Sin TACC", "Clásicas", "Con Queso"]}
        onSelect={setSelectedFilter}
      />
      <BotonCocineroDia onClick={handleVerCocinero} />

      <SwiperSection
        title="Promociones"
        items={hamburguesas}
        prevRef={prevRefPromos}
        nextRef={nextRefPromos}
        isBeginning={isBeginningPromos}
        isEnd={isEndPromos}
        onSwiper={onSwiperPromos}
      />

      <SwiperSection
        title="Lo más vendido"
        items={hamburguesas}
        prevRef={prevRefTop}
        nextRef={nextRefTop}
        isBeginning={isBeginningTop}
        isEnd={isEndTop}
        onSwiper={onSwiperTop}
      />

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-2">Planes de Suscripción</h2>
        {cargandoPlanes && (
          <div className="flex justify-center py-4">
            <Spinner size="w-10 h-10" color="border-orange-500" />
          </div>
        )}
        {errorPlanes && <p className="text-red-500">{errorPlanes}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {planes.map((plan) => (
            <CardPlan
              key={plan.id}
              plan={plan}
              suscripcionActiva={suscripcionActual?.plan?.id === plan.id}
              onSelect={() => handleSeleccionPlan(plan.id)}
            />
          ))}
        </div>
      </section>

      <ModalCocinero
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cocineroDia={cocineroActual}
      />
    </div>
  );
};

export default ClientDashboard;

