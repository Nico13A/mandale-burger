import { useState, useEffect } from "react";
import {
    getIngredientsCRUD,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    activateIngredient as apiActivateIngredient, 
} from "../services/ingredientes";

export const useIngredientesCRUD = () => {
    const [ingredientes, setIngredientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarIngredientes = async () => {
        setCargando(true);
        try {
            const data = await getIngredientsCRUD();
            setIngredientes(data);
        } catch (err) {
            setError(err.message || "No se pudieron cargar los ingredientes");
        } finally {
            setCargando(false);
        }
    };

    const agregarIngrediente = async (ingredientData) => {
        try {
            const nuevo = await createIngredient(ingredientData);
            setIngredientes((prev) => [...prev, nuevo]);
            return nuevo;
        } catch (err) {
            throw err;
        }
    };

    const editarIngrediente = async (id, ingredientData) => {
        try {
            const actualizado = await updateIngredient(id, ingredientData);
            setIngredientes((prev) =>
                prev.map((ing) => (ing.id === id ? actualizado : ing))
            );
            return actualizado;
        } catch (err) {
            throw err;
        }
    };

    const eliminarIngrediente = async (id) => {
        try {
            await deleteIngredient(id);
            setIngredientes((prev) =>
                prev.map((i) => (i.id === id ? { ...i, is_active: false } : i))
            );
        } catch (err) {
            throw err;
        }
    };

    const activarIngrediente = async (id) => {
        try {
            const actualizado = await apiActivateIngredient(id);
            setIngredientes((prev) =>
                prev.map((i) => (i.id === id ? actualizado : i))
            );
            return actualizado;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        cargarIngredientes();
    }, []);

    return {
        ingredientes,
        cargando,
        error,
        cargarIngredientes,
        agregarIngrediente,
        editarIngrediente,
        eliminarIngrediente,
        activarIngrediente,
    };
};
