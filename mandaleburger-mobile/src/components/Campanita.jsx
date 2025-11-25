import { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotificaciones } from "../hooks/useNotificaciones";
import { COLORS } from "../constants/colors";

export default function Campanita() {
    const [visible, setVisible] = useState(false);

    const {
        notificaciones,
        cargando,
        marcarComoLeida,
        cargarNotificaciones,
    } = useNotificaciones();

    const sinLeer = notificaciones.filter((n) => !n.read).length;

    const formatFechaHora = (isoString) => {
        const fecha = new Date(isoString);
        return fecha.toLocaleString("es-AR");
    };

    const abrirModal = async () => {
        setVisible(true);
        await cargarNotificaciones();
    };

    return (
        <>
            <TouchableOpacity style={styles.campanaContainer} onPress={abrirModal}>
                <Ionicons
                    name="notifications-outline"
                    size={26}
                    color={sinLeer > 0 ? COLORS.NARANJA_BOTON : "#fff"}
                />

                {sinLeer > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {sinLeer > 9 ? "9+" : sinLeer}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* MODAL */}
            <Modal
                visible={visible}
                animationType="slide"
                transparent
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>

                        {/* HEADER */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Notificaciones</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* CONTENIDO */}
                        <ScrollView style={styles.scroll}>
                            {cargando ? (
                                <View style={styles.center}>
                                    <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON} />
                                </View>
                            ) : notificaciones.length === 0 ? (
                                <View style={styles.center}>
                                    <Ionicons
                                        name="notifications-off-outline"
                                        size={40}
                                        color="#777"
                                    />
                                    <Text style={{ color: "#777", marginTop: 5 }}>
                                        No tenés notificaciones
                                    </Text>
                                </View>
                            ) : (
                                notificaciones.map((n) => (
                                    <View
                                        key={n.id}
                                        style={[
                                            styles.notificacion,
                                            !n.read && { backgroundColor: "#333333" },
                                        ]}
                                    >
                                        <View style={styles.notifHeader}>
                                            <Text style={styles.notifTitulo}>
                                                Orden #{n.order_info.match(/#(\d+)/)[1]}
                                            </Text>
                                            {!n.read && (
                                                <TouchableOpacity onPress={() => marcarComoLeida(n.id)}>
                                                    <Text style={styles.btnLeer}>Marcar como leída</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        <Text style={styles.notifMensaje}>{n.message}</Text>
                                        <Text style={styles.notifFecha}>
                                            {formatFechaHora(n.created_at)}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    campanaContainer: {
        padding: 6,
    },
    badge: {
        position: "absolute",
        right: -3,
        top: -3,
        backgroundColor: COLORS.NARANJA_BOTON,
        width: 18,
        height: 18,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalBox: {
        backgroundColor: COLORS.GRIS_BOTON_HOVER,
        maxHeight: "75%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: COLORS.TEXTO_GRIS_CLARITO,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    scroll: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    notificacion: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.TEXTO_GRIS_CLARITO,
        borderRadius: 14,
    },
    notifHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    notifTitulo: {
        fontWeight: "600",
        color: COLORS.NARANJA_BOTON_HOVER,
    },
    notifMensaje: {
        marginTop: 8,
        color: "#fff",
    },
    notifFecha: {
        marginTop: 2,
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 12,
    },
    btnLeer: {
        color: COLORS.NARANJA_BOTON,
        fontSize: 12,
    },
    center: {
        alignItems: "center",
        paddingVertical: 40,
    },
});
