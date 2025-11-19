import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useImagenPerfil } from "../hooks/useImagenPerfil";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const { suscripcion, cargarSuscripcionActiva, cargando } = useSuscripcion();

    useEffect(() => {
        if (user) {
            cargarSuscripcionActiva();
        }
    }, [user]);

    const { cargando: cargandoImagen, seleccionarImagen } = useImagenPerfil();

    const [imagenPerfil, setImagenPerfil] = useState(
        user?.profile?.image
            ? `${process.env.EXPO_PUBLIC_API_URL}${user.profile.image}`
            : null
    );

    const handleActualizarImagen = async () => {
        const nuevaImagen = await seleccionarImagen();
        if (nuevaImagen) setImagenPerfil(nuevaImagen);
    };

    const handleCerrarSesion = () => {
        logout();
    };

    const handleEditarPerfil = () => {
        navigation.navigate("EditarPerfil");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi perfil</Text>
            </View>

            {/* Datos del usuario */}
            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={imagenPerfil ? { uri: imagenPerfil } : require("../assets/ImagenNoEncontrada.png")}
                        style={styles.avatar}
                    />
                    {cargandoImagen && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color="#fff" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editIcon} onPress={handleActualizarImagen}>
                        <MaterialIcons name="edit" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>
                    {user?.first_name} {user?.last_name}
                </Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            {/* Sección de suscripción */}
            <View style={styles.subscriptionContainer}>
                {cargando ? (
                    <ActivityIndicator size="small" color={COLORS.GRIS_BOTON} />
                ) : suscripcion ? (
                    <>
                        <Text style={styles.subscriptionTitle}>Tu plan actual</Text>
                        <View style={styles.planCard}>
                            <View style={styles.planHeader}>
                                <MaterialIcons name="workspace-premium" size={24} color="#FFF" />
                                <Text style={styles.planName}>{suscripcion.plan.name}</Text>
                            </View>

                            <Text style={styles.planDescription}>{suscripcion.plan.description}</Text>

                            <View style={styles.planInfo}>
                                <MaterialIcons name="event" size={18} color="#fff" />
                                <Text style={styles.planInfoText}>
                                    Inicio: <Text style={styles.planInfoValue}>{new Date(suscripcion.start_date).toLocaleDateString("es-AR")}</Text>
                                </Text>
                            </View>

                            <View style={styles.planInfo}>
                                <MaterialIcons name="event-busy" size={18} color="#fff" />
                                <Text style={styles.planInfoText}>
                                    Vence: <Text style={styles.planInfoValue}>{new Date(suscripcion.end_date).toLocaleDateString("es-AR")}</Text>
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noPlanText}>
                        No tenés ninguna suscripción activa actualmente.
                    </Text>
                )}
            </View>

            {/* Botones */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.editButton} onPress={handleEditarPerfil}>
                    <MaterialIcons name="edit" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.editButtonText}>Editar perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
                    <MaterialIcons name="logout" size={20} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    header: {
        backgroundColor: COLORS.GRIS_BOTON,
        padding: 20
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "600",
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 60,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 10,
        backgroundColor: "#E5E7EB",
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.GRIS_BOTON,
    },
    email: {
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 14,
        marginTop: 2,
    },
    subscriptionContainer: {
        marginTop: 40,
        paddingHorizontal: 20,
    },
    subscriptionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.GRIS_BOTON,
        marginBottom: 10,
    },
    planCard: {
        backgroundColor: COLORS.GRIS_BOTON,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.NARANJA_BOTON,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    planHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    planName: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.NARANJA_BOTON,
    },
    planDescription: {
        fontSize: 14,
        color: COLORS.TEXTO_GRIS_CLARITO,
        marginBottom: 10,
        marginLeft: 2,
    },
    planInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 6,
    },
    planInfoText: {
        fontSize: 14,
        color: "#fff",
    },
    planInfoValue: {
        color: COLORS.NARANJA_BOTON,
    },
    noPlanText: {
        textAlign: "center",
        color: COLORS.GRIS_BOTON_HOVER,
        fontSize: 14,
    },
    actions: {
        marginTop: 40,
        paddingHorizontal: 20,
        gap: 14,
    },
    editButton: {
        backgroundColor: COLORS.NARANJA_BOTON,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        elevation: 2,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        backgroundColor: COLORS.GRIS_BOTON,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        elevation: 2,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    avatarContainer: {
        position: "relative",
        width: 110,
        height: 110,
        marginBottom: 10,
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.NARANJA_BOTON,
        borderRadius: 20,
        padding: 6,
        elevation: 3,
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
    },
});

