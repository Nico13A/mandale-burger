import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { usePromocionDetalle } from "../hooks/usePromocionDetalle";
import { formatearIngrediente } from "../utils/formatearIngrediente";
import { useCarrito } from "../context/CarritoContext";
import Button from "../components/Button";
import { mostrarToast } from "../utils/mostrarToast";

export default function PromocionDetalleScreen({ route }) {
    const { promo } = route.params;
    const { promocion, cargando, error } = usePromocionDetalle(promo?.id);
    const { agregarItem, loading } = useCarrito();

    const handleAgregar = async () => {
        try {
            await agregarItem({
                promotionId: promocion.id,
                quantity: 1,
            });
            mostrarToast("success", "Agregado", "La promoción fue agregada al carrito");
        } catch (error) {
            console.error("Error al agregar:", error);
            mostrarToast("error", "Error", "No se pudo agregar al carrito");
        }
    }

    if (cargando) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON_HOVER} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    if (!promocion) return null;

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
            <Image
                source={{ uri: promocion.img }}
                style={styles.heroImage}
                resizeMode="cover"
            />
            <Text style={styles.name}>{promocion.name}</Text>
            <Text style={styles.description}>{promocion.description}</Text>

            <View style={styles.divider} />

            {/* Precio */}
            <View style={styles.priceWrapper}>
                <Text style={styles.priceLabel}>Precio:</Text>
                <Text style={styles.priceValue}>${promocion.price}</Text>
            </View>

            {/* Ingredientes en chips */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredientes:</Text>

                <View style={styles.ingredientsGrid}>
                    {promocion.ingredients.map((ing) => (
                        <View key={ing.id} style={styles.chip}>
                            <View style={styles.chipRow}>
                                <Text style={styles.chipText}>{formatearIngrediente(ing.ingredient)}</Text>
                                <Text style={styles.chipQty}>x {ing.quantity}</Text>
                            </View>
                        </View>

                    ))}
                </View>
            </View>
            <Button
                title="Agregar al carrito"
                onPress={handleAgregar}
                loading={loading}
                disabled={false}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.BACKGROUND,
    },
    scroll: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    inner: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    heroImage: {
        width: "100%",
        height: 300,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
        color: "#000",
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(0,0,0,0.08)",
        marginVertical: 10,
    },
    priceWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginRight: 6,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.NARANJA_BOTON_HOVER,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    ingredientsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    chip: {
        width: "48%",
        backgroundColor: "rgba(255,140,0,0.12)",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 100,
        marginBottom: 10,
        justifyContent: "center",
    },
    chipRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    chipText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#333",
        flexShrink: 1,
    },
    chipQty: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.NARANJA_BOTON,
    },
    button: {
        backgroundColor: COLORS.NARANJA_BOTON,
        paddingVertical: 12,
        borderRadius: 100,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
