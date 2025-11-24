import { useEffect, useState } from "react";
import { getPublicationById } from "../services/post";

export const useObtenerPost = (idPost) =>{
    const [post,setPost] = useState(null);
    const [cargando,setCargando] = useState(false);
    const [error, setError] = useState(null);

    const cargarPost = async () => {
        if (!idPost) return;
        setCargando(true);
        setError(null);
        try{
            const data = await getPublicationById(idPost);
            setPost(data);
        }catch(error){
            setError(error.message);
        }finally{
            setCargando(false);
        }
    }
    useEffect( () => {
        cargarPost();
    },[idPost]);
    return { cargarPost, post , cargando, error };
}