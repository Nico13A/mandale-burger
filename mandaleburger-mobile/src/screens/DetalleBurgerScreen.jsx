import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/colors";
import { useMenuBurgers } from "../hooks/useMenuBurgers";
import Button from "../components/Button";
import { useCarrito } from "../context/CarritoContext";
import { mostrarToast } from "../utils/mostrarToast";
import { useEffect } from "react";

export default function DetalleBurgerScreen({ route }) {
    const { id } = route.params;

    const {
        detalleBurger,
        cargando,
        error,
        obtenerDetalleBurger
    } = useMenuBurgers();

    const { agregarItem, loading } = useCarrito();

    useEffect(() => {
        obtenerDetalleBurger(id);
    }, [id]);

    const handleAgregar = async () => {
        try {
            await agregarItem({
                menuBurgerId: detalleBurger.id,
                quantity: 1,
            });
            mostrarToast("success", "Agregado", "La hamburguesa fue agregada al carrito");
        } catch (error) {
            mostrarToast("error", "Error", "No se pudo agregar al carrito");
        }
    };

    if (cargando || !detalleBurger) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON_HOVER} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
            
            {/* Imagen principal */}
            <Image
                source={{ uri: detalleBurger.img }}
                style={styles.heroImage}
                resizeMode="cover"
            />

            {/* Título + descripción */}
            <Text style={styles.name}>{detalleBurger.name}</Text>
            <Text style={styles.description}>{detalleBurger.description}</Text>

            <View style={styles.divider} />

            {/* Precio */}
            <View style={styles.priceWrapper}>
                <Text style={styles.priceLabel}>Precio:</Text>
                <Text style={styles.priceValue}>${detalleBurger.price}</Text>
            </View>

            {/* Ingredientes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredientes:</Text>

                <View style={styles.ingredientsGrid}>
                    {detalleBurger.ingredients.map((ing, idx) => (
                        <View key={idx} style={styles.chip}>
                            <View style={styles.chipRow}>
                                <Text style={styles.chipText}>{ing.ingredient_name}</Text>
                                <Text style={styles.chipQty}>x {ing.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Botón */}
            <Button
                title="Agregar al carrito"
                onPress={handleAgregar}
                loading={loading}
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

    // === ESTILOS IGUALES AL DETALLE PROMOCIÓN ===
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
        marginBottom: 4,
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

    // === CHIPS IGUALES A PROMOCIÓN ===
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
});

