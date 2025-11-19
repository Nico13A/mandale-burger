import * as ImagePicker from "expo-image-picker";
import { updateProfileImage } from "../services/user";
import { useState } from "react";

export const useImagenPerfil = () => {
    const [cargando, setCargando] = useState(false);

    const seleccionarImagen = async () => {
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!resultado.canceled) {
            const uriArchivo = resultado.assets[0].uri;
            const archivo = {
                uri: uriArchivo,
                name: "perfil.jpg",
                type: "image/jpeg",
            };
            setCargando(true);
            try {
                const datos = await updateProfileImage(archivo);
                return datos.image;
            } catch (err) {
                console.log("Error al actualizar la imagen de perfil", err);
                return null;
            } finally {
                setCargando(false);
            }
        }
        return null;
    };

    return { cargando, seleccionarImagen };
};
