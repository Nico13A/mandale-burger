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

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const { cocineroActual } = useCocineroDelDia();

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

  return (
    <div className="pb-25 mx-auto md:pb-0 md:min-w-3xl md:max-w-3xl lg:min-w-4xl xl:min-w-6xl xl:max-w-6xl">
      <Buscador value={search} onChange={setSearch} />

      <BotonesFiltros
        opciones={["Hamburguesa Vegana", "Sin TACC", "Clásicas", "Con Queso"]}
        onSelect={setSelectedFilter}
      />

      <BotonCocineroDia onClick={handleVerCocinero} />

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

      <ModalCocinero
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cocineroDia={cocineroActual}
      />
    </div>
  );
};

export default ClientDashboard;

