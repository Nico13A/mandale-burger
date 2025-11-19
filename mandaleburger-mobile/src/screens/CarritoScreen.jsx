import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useCarrito } from "../context/CarritoContext";
import { API_URL } from "../config";
import { usePagarPedido } from "../hooks/usePagarPedido";
import { useState } from "react";

const CarritoScreen = () => {
    const { cart, loading, eliminarItem, actualizarCantidad, vaciarCarrito, realizarCheckout } = useCarrito();
    const { pagarPedido } = usePagarPedido();
    const [errorModal, setErrorModal] = useState(null);

    const estaVacio = !cart || cart.items.length === 0;

    const handleIncrementar = (id, cantidad) => {
        actualizarCantidad(id, cantidad + 1);
    }

    const handleDecrementar = (id, cantidad) => {
        if (cantidad > 1) actualizarCantidad(id, cantidad - 1);
    }

    const handlePagar = async () => {
        try {
            const order = await realizarCheckout();
            await pagarPedido(order.order_id);
        } catch (error) {
            try {
                const parsed = JSON.parse(error.message);
                setErrorModal(parsed);
            } catch (e) {
                setErrorModal({
                    msg: "Error inesperado",
                    detalles: [],
                });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Mi carrito</Text>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON_HOVER} />
                </View>
            ) : estaVacio ? (
                <View style={styles.center}>
                    <Ionicons
                        name="cart-outline"
                        size={100}
                        color={COLORS.NARANJA_BOTON}
                        style={{ marginBottom: 20 }}
                    />
                    <Text style={styles.emptyText}>Tu carrito está vacío</Text>
                    <Text style={styles.emptySubText}>
                        Agrega productos y los verás reflejados aquí.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {cart.items.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.row}>
                                {/* Imagen del producto */}
                                {item.promotion?.img || item.custom_burger?.img ? (
                                    <Image
                                        source={{ uri: `${API_URL}${item.promotion?.img ?? item.custom_burger?.img}` }}
                                        style={styles.itemImage}
                                    />
                                ) : null}

                                <View>
                                    <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail" adjustsFontSizeToFit minimumFontScale={0.8}>
                                        {item.promotion?.name ?? item.custom_burger?.custom_name ?? "Producto"}
                                    </Text>
                                    <Text style={styles.itemPrice}>${item.total_price}</Text>
                                </View>
                            </View>

                            <View style={styles.quantityRow}>
                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => handleDecrementar(item.id, item.quantity)}
                                >
                                    <Ionicons name="remove" size={20} color="white" />
                                </TouchableOpacity>

                                <Text style={styles.qtyText}>{item.quantity}</Text>

                                <TouchableOpacity
                                    style={styles.qtyBtn}
                                    onPress={() => handleIncrementar(item.id, item.quantity)}
                                >
                                    <Ionicons name="add" size={20} color="white" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => eliminarItem(item.id)}
                                >
                                    <Ionicons name="trash-outline" size={20} color={COLORS.TEXTO_GRIS_CLARITO} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Resumen del pedido */}
                    <View style={styles.resumenCard}>
                        <Text style={styles.resumenTitulo}>Resumen del pedido</Text>

                        <View style={styles.resumenRow}>
                            <Text style={styles.resumenLabel}>
                                Productos ({cart.items.length})
                            </Text>
                            <Text style={styles.resumenValue}>
                                ${cart.total_price}
                            </Text>
                        </View>

                        <Text style={styles.resumenAviso}>
                            Se le notificará cuando su pedido esté listo.
                        </Text>

                        <View style={styles.resumenTotalRow}>
                            <Text style={styles.resumenTotalText}>Total</Text>
                            <Text style={styles.resumenTotalPrice}>${cart.total_price}</Text>
                        </View>

                        <View style={{ gap: 10, marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.checkoutBtn}
                                onPress={handlePagar}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.checkoutText}>Proceder al pago</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.vaciarBtn}
                                onPress={vaciarCarrito}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.vaciarText}>Vaciar carrito</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            )}

            {/* Modal error */}
            {errorModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{errorModal.msg}</Text>

                        {errorModal.detalles?.length > 0 ? (
                            <ScrollView style={styles.modalDetailsScroll}>
                                {errorModal.detalles.map((d, idx) => (
                                    <Text key={idx} style={styles.modalDetail}>
                                        {d.producto} - {d.ingredient} (faltan {d.faltante})
                                    </Text>
                                ))}
                            </ScrollView>
                        ) : (
                            <Text style={styles.modalDetail}>Sin detalles adicionales.</Text>
                        )}

                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setErrorModal(null)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalBtnText}>Entendido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#fff",
        backgroundColor: COLORS.GRIS_BOTON,
        padding: 20,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        gap: 14,
        paddingBottom: 90
    },
    vaciarBtn: {
        backgroundColor: "#1F2937",
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#374151",
    },
    vaciarText: {
        color: "#9CA3AF",
        fontWeight: "700",
        fontSize: 16,
    },
    card: {
        backgroundColor: COLORS.GRIS_BOTON_HOVER,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1.3,
        borderColor: "#2E2E2E",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    itemImage: {
        width: 100,
        height: 80,
        borderRadius: 12,
        backgroundColor: "#000",
        borderWidth: 2,
        borderColor: "#4A4A4A",
        objectFit: "contain",
        shadowColor: COLORS.TEXTO_GRIS_CLARITO,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 2,
    },
    itemName: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        maxWidth: 200
    },
    itemPrice: {
        color: COLORS.NARANJA_BOTON,
        fontSize: 16,
        fontWeight: "700",
        marginTop: 4,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 10,
        gap: 12,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        minWidth: 20,
        textAlign: "center",
    },
    removeBtn: {
        marginLeft: "auto",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        backgroundColor: "#1F2937",
    },
    checkoutBtn: {
        backgroundColor: COLORS.NARANJA_BOTON,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
    },
    checkoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    emptyText: {
        color: COLORS.GRIS_BOTON_HOVER,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    emptySubText: {
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 14,
        textAlign: "center",
        maxWidth: 300,
    },
    resumenCard: {
        marginTop: 14,
        backgroundColor: COLORS.GRIS_BOTON,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#333",
        gap: 8,
    },
    resumenTitulo: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },
    resumenRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resumenLabel: {
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 14,
    },
    resumenValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    resumenAviso: {
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 12,
        marginTop: 4,
    },
    resumenTotalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#444",
        borderStyle: "dashed",
        paddingTop: 12,
        marginTop: 10,
    },
    resumenTotalText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    resumenTotalPrice: {
        color: COLORS.NARANJA_BOTON,
        fontSize: 22,
        fontWeight: "800",
    },




    /* Estilado del modal */
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        zIndex: 999,
    },
    modalContent: {
        width: "90%",
        backgroundColor: COLORS.GRIS_BOTON,
        paddingHorizontal: 20,
        paddingVertical: 40,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.NARANJA_BOTON_HOVER,
        shadowColor: COLORS.NARANJA_BOTON_HOVER,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.NARANJA_BOTON_HOVER,
        marginBottom: 12,
        textAlign: "center",
        letterSpacing: 0.3
    },
    modalDetailsScroll: {
        maxHeight: 300,
        marginBottom: 10,
    },
    modalDetail: {
        color: "#fff",
        fontSize: 14,
        marginVertical: 4,
        lineHeight: 20,
    },
    modalBtn: {
        marginTop: 20,
        backgroundColor: COLORS.NARANJA_BOTON,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    modalBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default CarritoScreen;

