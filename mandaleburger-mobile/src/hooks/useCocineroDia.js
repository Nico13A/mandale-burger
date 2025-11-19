import { useState } from "react";
import { getCocineroDelDiaActual } from "../services/cocineroDia";

export const useCocineroDia = () => {
    const [cocinero, setCocinero] = useState(null);

    const [cargando, setCargando] = useState(false);
    
    const [error, setError] = useState(null);

    const cargar = async () => {
        setCargando(true);
        setError(null);
        try {
            const data = await getCocineroDelDiaActual();
            setCocinero(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };
    return { cocinero, cargando, error, cargar };
};

