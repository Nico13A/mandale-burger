import { useIngredientes } from "../../hooks/useIngredientes.js";
import { useCreateCustomerBurger } from "../../hooks/useCreateCustomerBurger.js";
import Carrusel from "../../components/Carrusel/Carrusel.jsx";
import RenderLista from "../../components/Carrusel/RenderLista.jsx";
import { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { useCarrito } from "../../context/CarritoContext.jsx";
import Input from "../../components/Input/Input.jsx";
import Loading from "../../components/Loading/Loading.jsx";

export default function ClientArmarBurger() {

  const { agregarItem, loading: loadingCarrito } = useCarrito();

  const { ingredientes, cargando, error } = useIngredientes();
  const { handleCreateCustomerBurger, cargando: creando, error: errorCreacion } = useCreateCustomerBurger();

  const [nombre, setNombre] = useState("");
  // Categorías de ingredientes
  const catPanes = ingredientes.filter(cat => (cat?.name || "").toLowerCase() === "panes");
  const catMed = ingredientes.filter(med => (med?.name || "").toLowerCase() === "medallones");
  const catAderezos = ingredientes.filter(aderezo => (aderezo?.name || "").toLowerCase() === "aderezos");
  const catPaps = ingredientes.filter(pap => (pap?.name || "").toLowerCase() === "papas");
  const catBebidas = ingredientes.filter(bebi => (bebi?.name || "").toLowerCase() === "bebidas");

  // Ingredientes por categoría
  const papas = catPaps[0]?.ingredients ?? []
  const aderezos = catAderezos[0]?.ingredients ?? [];
  const bebidas = catBebidas[0]?.ingredients ?? []

  // Filtrar ingredientes excluyendo panes, aderezos, papas y bebidas para el ModalIngredientes
  const Ingredientes = ingredientes.filter(ing =>
    (ing?.name || "").toLowerCase() !== "panes" &&
    (ing?.name || "").toLowerCase() !== "aderezos" &&
    (ing?.name || "").toLowerCase() !== "papas" &&
    (ing?.name || "").toLowerCase() !== "aderezos veganos" &&
    (ing?.name || "").toLowerCase() !== "bebidas"
  );
  // Ingredientes específicos para carrusel
  const panes = catPanes[0]?.ingredients ?? [];
  const medallones = catMed[0]?.ingredients ?? [];

  // Igredientes lista plana
  const ingListaPlana = () =>
    (ingredientes || []).flatMap(cat => cat?.ingredients || []);

  // Ids de aderezos seleccionados
  const [selAderezos, setSelAderezos] = useState([]);
  const [selPapas, setSelPapas] = useState([]);
  const [selBebidas, setSelBebidas] = useState([]);
  const [ingBu, setIngBu] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [totalPrice, setTotalPrice] = useState("0.00");
  const navigate = useNavigate();
  const carruselRef = useRef(null);

  // Armado final de ingredientes para enviar al backend
  const ingFinal = () => {
    const ingredientesFinales = [];
    ingredientesFinales.push(...ingBu);
    // Armado simple para cada grupo (IDs o objetos {id})
    const ingAd = selAderezos.map(d => ({
      ingredient_id: Number(d?.id ?? d),
      quantity: 1,
    }));
    const ingPap = selPapas.map(d => ({
      ingredient_id: Number(d?.id ?? d),
      quantity: 1,
    }));
    const ingBeb = selBebidas.map(d => ({
      ingredient_id: Number(d?.id ?? d),
      quantity: 1,
    }));

    if (selAderezos.length !== 0) ingredientesFinales.push(...ingAd);
    if (selPapas.length !== 0) ingredientesFinales.push(...ingPap);
    if (selBebidas.length !== 0) ingredientesFinales.push(...ingBeb);

    // Limpieza mínima por si hay NaN o cantidades inválidas
    return ingredientesFinales;
  };

  // Calcula el precio total
  useEffect(() => {
    const ingFin = ingListaPlana();
    const idx = new Map(ingFin.map(i => [Number(i.id), Number(i.price ?? 0)]));
    const list = ingFinal();
    let total = 0;
    for (const it of list) {
      const id = Number(it.ingredient_id ?? it.id);
      const qty = Number(it.quantity ?? 1) || 1;
      const p = idx.get(id) ?? 0;
      total += p * qty;
    }
    setTotalPrice(total.toFixed(2));
  }, [selAderezos, selPapas, selBebidas, ingBu, ingredientes]);


  const validateBurger = () => {
    if (!nombre?.trim()) {
      toast.error("Ingresá un nombre para la burger", {autoClose: 2000});
      return false;
    }
    const list = ingFinal();
    if (!list.length) {
      toast.error("Seleccioná al menos un ingrediente", {autoClose: 2000});
      return false;
    }
    return true;
  };
  // Limpiar localStorage
  const clearKeys = (keys) => {
    keys.forEach(k => { try { localStorage.removeItem(k); } catch { } });
  };
  const items = [
    "Pan",
    "cantIng",
    "cantIngredientes",
    "iCarne",
    "iPan",
    "idSeleccionados",
    "ingSeleccionados",
    "medallonCarrusel",
  ];
  // HandleArmaBurger envia los datos al backend
  const handleArmarBurger = async (e) => {
    e?.preventDefault?.();
    if (!validateBurger()) return;

    try {
      let blob = null;

      if (carruselRef.current) {
        const CUT_PX = 250;
        try {
          const dataUrl = await htmlToImage.toPng(carruselRef.current, {
            pixelRatio: 2,
            backgroundColor: null,
            cacheBust: true,
            filter: (node) => !node.closest?.(".Toastify"),
          });
          blob = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
              const w = img.width;
              const h = img.height;
              const out = document.createElement("canvas");
              out.width = w;
              out.height = Math.max(1, h - CUT_PX);
              const ctx = out.getContext("2d");
              ctx.drawImage(
                img,
                0, 0, w, h - CUT_PX,
                0, 0, w, h - CUT_PX
              );
              out.toBlob((b) => resolve(b), "image/png");
            };
            img.onerror = reject;
            img.src = dataUrl;
          });
        } catch (e) {
          console.warn("html-to-image falló, continúo sin imagen:", e);
          blob = null;
        }
      }

      const fd = new FormData();
      fd.append("custom_name", nombre || "Mi Burger");
      fd.append("description", descripcion || "");
      fd.append("total_price", Number(totalPrice).toFixed(2));
      fd.append("ingredients_data", JSON.stringify(ingFinal()));
      if (blob) fd.append("img", new File([blob], "burger.png", { type: "image/png" }));

      const createdBurger = await handleCreateCustomerBurger(fd);

      try {
        await agregarItem({ customBurgerId: createdBurger.id, quantity: 1 });
        toast.success("¡Burger agregada al carrito!", { autoClose: 2000 });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo agregar la burger al carrito");
      }
      clearKeys(items);
      setNombre(""); setDescripcion("");
      setSelAderezos([]); setSelPapas([]); setSelBebidas([]);
      setIngBu([]); setTotalPrice("0.00");

      navigate("/client/carrito");
    } catch (err) {
      const msg = err?.non_field_errors?.[0] || err?.detail || err?.message || "No se pudo crear la burger";
      toast.error(msg, { autoClose: 2000 });
    }
  };



  const handleCarruselChange = (payload) => {
    if (payload?.ingBu) {
      setIngBu(payload.ingBu);
    }
  };

  if (cargando) return <Loading />;
  if (error) return <div className="text-red-600">Error: {String(error)}</div>;

  return (
    <div className="bg-gray-100 flex justify-center items-start gap-6 py-6">
      <div className="bg-gris-boton p-6 rounded-lg shadow-lg w-1/3 max-w-2xl">
        <Carrusel
          ref={carruselRef}
          panes={panes}
          medallones={medallones}
          ingredientes={Ingredientes}
          onChange={handleCarruselChange}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3 max-w-2xl">
        <form onSubmit={handleArmarBurger} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre-burger" className="font-semibold">Nombre burger</label>
            <Input
              id="nombre-burger"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: La Mandale Clásica"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="descripcion-burger" className="font-semibold">Descripción</label>
            <textarea
              id="descripcion-burger"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-none focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 transition placeholder-gray-400 text-sm md:text-base h-24 resize-none"
              placeholder="Danos una pequeña descripción de tu burger"
            />
          </div>

          <div className="mt-2 flex space-x-2 border border-gray-300 rounded-md px-4 py-3 bg-white shadow-none transition focus-within:ring-2">
            {/* Selección de aderezos */}
            <div className="w-1/3">
              <p className="text-sm font-semibold mb-2">Aderezos</p>
              {!aderezos.length ? (
                <div className="text-xs text-gray-500">No hay aderezos</div>
              ) : (
                <RenderLista
                  items={aderezos}
                  seleccion={selAderezos}
                  setSeleccion={setSelAderezos}
                />
              )}
            </div>

            {/* Papas */}
            <div className="w-1/3">
              <p className="text-sm font-semibold mb-2">Papas</p>
              {!papas.length ? (
                <div className="text-xs text-gray-500">Sin papas</div>
              ) : (
                <RenderLista
                  items={papas}
                  seleccion={selPapas}
                  setSeleccion={setSelPapas}
                />
              )}
            </div>

            {/* Bebidas */}
            <div className="w-1/3">
              <p className="text-sm font-semibold mb-2">Bebidas</p>
              {!bebidas.length ? (
                <div className="text-xs text-gray-500">Sin bebidas</div>
              ) : (
                <RenderLista
                  items={bebidas}
                  seleccion={selBebidas}
                  setSeleccion={setSelBebidas}
                />
              )}
            </div>
          </div>
          <div>
            <div className="w-full flex items-center justify-end gap-2 mt-2 mb-4">
              <p className="text-lg font-semibold whitespace-nowrap" id="label-total-burger">Total</p>
              <div className="border border-gray-300 rounded-md px-4 py-3 bg-white shadow-none transition focus-within:ring-2 text-right font-medium" role="status" aria-labelledby="label-total-burger">
                ${totalPrice}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-naranja-boton hover:bg-naranja-boton-hover disabled:opacity-50"
              disabled={creando || loadingCarrito}
            >
              {creando || loadingCarrito ? <Spinner /> : "Crear hamburguesa"}
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}