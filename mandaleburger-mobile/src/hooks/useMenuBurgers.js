import { useState, useEffect } from "react";
import { getMenuBurgers, getMenuBurgerById, getAllMenuBurgers } from "../services/menuburger";

export const useMenuBurgers = () => {
    const [burgers, setBurgers] = useState([]);
    const [allBurgers, setAllBurgers] = useState([]);   
    const [detalleBurger, setDetalleBurger] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const [paginacion, setPaginacion] = useState({
        next: null,
        previous: null,
        count: 0,
    });

    const [ultimoParams, setUltimoParams] = useState({});

    useEffect(() => {
        const cargarTodo = async () => {
            try {
                const data = await getAllMenuBurgers();
                setAllBurgers(data);
            } catch (err) {
                console.error("Error al cargar todas las burgers", err);
            }
        };
        cargarTodo();
    }, []);

    const buscarLocal = (texto) => {
        if (!texto || texto.trim() === "") {
            return;
        }  
        setUltimoParams({});
        setCargando(false);
        const q = texto.toLowerCase();
        const filtradas = allBurgers.filter(b => b.name.toLowerCase().includes(q));
        setBurgers(filtradas);
        setPaginacion({
            next: null,
            previous: null,
            count: filtradas.length,
        });
    };

    const obtenerBurgers = async (params = {}) => {
        setCargando(true);
        setError(null);
        try {
            const { page, ...filtros } = params;
            setUltimoParams(filtros);
            const data = await getMenuBurgers(params);
            setBurgers(data.results);
            setPaginacion({
                next: data.next,
                previous: data.previous,
                count: data.count,
                currentPage: page || 1
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const irAPagina = (url) => {
        if (!url) return;
        const match = url.match(/page=(\d+)/);
        const page = match ? Number(match[1]) : 1;
        obtenerBurgers({ ...ultimoParams, page });
    };

    const obtenerDetalleBurger = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const data = await getMenuBurgerById(id);
            setDetalleBurger(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    return {
        burgers,
        detalleBurger,
        cargando,
        error,
        paginacion,
        obtenerBurgers,
        irAPagina,
        obtenerDetalleBurger,
        buscarLocal,
    };
};