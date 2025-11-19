import { Modal, View, Text, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function CocineroModal({ visible, onClose, cocinero, cargando, error }) {

    const data = cocinero?.cocinero;
    const perfil = data?.profile;
    const imagen = perfil?.image ? { uri: `${process.env.EXPO_PUBLIC_API_URL}${perfil.image}` } : require("../assets/ImagenNoEncontrada.png");

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: COLORS.GRIS_BOTON_HOVER,
                        padding: 20,
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        elevation: 10
                    }}
                >

                    {/* BOTÓN DE CIERRE */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            backgroundColor: "rgba(255,255,255,0.15)",
                            padding: 6,
                            borderRadius: 20,
                        }}
                    >
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>

                    {/* LOADING */}
                    {cargando && (
                        <View style={{ alignItems: "center", paddingVertical: 20 }}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}

                    {/* ERROR */}
                    {error && (
                        <Text style={{ color: "red", textAlign: "center" }}>
                            {error}
                        </Text>
                    )}

                    {/* NO HAY COCINERO */}
                    {!cargando && !error && !data && (
                        <View style={{paddingVertical: 20, height: 100, justifyContent: "flex-end"}}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: "#F08080",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                No hay cocinero del día asignado
                            </Text>
                        </View>
                    )}

                    {/* CONTENIDO */}
                    {!cargando && !error && data && (
                        <>
                            {/* IMAGEN */}
                            <Image
                                source={imagen}
                                style={{
                                    width: 160,
                                    height: 160,
                                    borderRadius: 80,
                                    alignSelf: "center",
                                    marginTop: 10,
                                    marginBottom: 15,
                                    borderWidth: 3,
                                    borderColor: "rgba(255,255,255,0.2)"
                                }}
                            />

                            {/* NOMBRE */}
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                    color: "#fff",
                                    textAlign: "center",
                                }}
                            >
                                {data.first_name} {data.last_name}
                            </Text>

                            {/* FORMACIÓN */}
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.TEXTO_GRIS_CLARITO,
                                    textAlign: "center",
                                    marginTop: 6,
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>Formación: </Text>
                                {perfil?.formacion || "Sin información disponible"}
                            </Text>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}