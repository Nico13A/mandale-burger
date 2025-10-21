import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import CardIngrediente from "../../components/CardIngrediente/CardIngrediente";
import Loading from "../../components/Loading/Loading";
import { getIngredients, activateIngredient, deactivateIngredient } from "../../services/ingredientes";

function AdminIngredientesIndex() {
  const nav = useNavigate();

  // guardamos TODO sin filtros
  const [allIngredientes, setAllIngredientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // filtros (UI)
  const [q, setQ] = useState("");
  const [qTyping, setQTyping] = useState("");
  const [category, setCategory] = useState("");

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setQ(qTyping), 350);
    return () => clearTimeout(t);
  }, [qTyping]);

  // cargar SOLO una vez, sin filtros
  const cargar = async () => {
    try {
      setCargando(true);
      setError("");
      const data = await getIngredients(); 
      setAllIngredientes(data);
    } catch (e) {
      setError(e.message || "Error al cargar ingredientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // derivamos categorías desde la lista completa
  const categorias = useMemo(() => {
    const map = new Map();
    for (const ing of allIngredientes) {
      const cat = ing.category || ing.category_obj || null;
      if (cat?.id) map.set(cat.id, { id: cat.id, name: cat.name });
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allIngredientes]);

  // filtramos en memoria
  const ingredientesFiltrados = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    return allIngredientes.filter((ing) => {
      const matchQ =
        !qNorm ||
        ing.name?.toLowerCase().includes(qNorm) ||
        ing.description?.toLowerCase().includes(qNorm);
      const matchCat =
        !category || String(ing.category?.id) === String(category);
      return matchQ && matchCat;
    });
  }, [allIngredientes, q, category]);

  const handleActivate = async (id) => {
    try {
      await activateIngredient(id);
      await cargar(); 
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateIngredient(id);
      await cargar(); 
    } catch (e) {
      setError(e.message);
    }
  };

  if (cargando) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">Ingredientes</h1>
        <button
          onClick={() => nav("/admin/ingredientes/nuevo")}
          className="px-5 py-2 bg-naranja-boton hover:bg-naranja-boton-hover cursor-pointer text-white rounded-2xl font-semibold transition"
        >
          Crear ingrediente
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <input
          value={qTyping}
          onChange={(e) => setQTyping(e.target.value)}
          placeholder="Buscar por nombre o descripción…"
          className="w-full md:flex-1 px-3 py-2 rounded-xl border outline-none focus:ring"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-64 px-3 py-2 rounded-xl border bg-white"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={() => { setQTyping(""); setQ(""); setCategory(""); }}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          Limpiar
        </button>
      </div>

      {/* Lista vertical */}
      <div className="flex flex-col gap-3">
        {ingredientesFiltrados.length === 0 ? (
          <div className="text-sm text-gray-500">Sin resultados.</div>
        ) : (
          ingredientesFiltrados.map((ing) => (
            <CardIngrediente
              key={ing.id}
              ing={ing}
              onEdit={(id) => nav(`/admin/ingredientes/editar/${id}`)}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminIngredientesIndex;
