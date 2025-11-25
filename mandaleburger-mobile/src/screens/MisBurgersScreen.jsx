import { SafeAreaView } from "react-native-safe-area-context";
import {
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image
} from "react-native";
import { useMenuBurgers } from "../hooks/useMenuBurgers";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";

export default function MisBurgersScreen() {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const route = useRoute();
    const {
        burgers,
        cargando,
        error,
        paginacion,
        obtenerBurgers,
        irAPagina,
        buscarLocal,
    } = useMenuBurgers();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const translateY = useState(new Animated.Value(20))[0];

    useEffect(() => {
        if (!isFocused) {
            navigation.setParams({ busqueda: null });
        }
    }, [isFocused]);

    useEffect(() => {
        if (!isFocused) return;
        const texto = route.params?.busqueda;
        if (!texto || texto.trim() === "") {
            obtenerBurgers();
            return;
        }
        buscarLocal(texto);
    }, [isFocused, route.params?.busqueda]);

    useEffect(() => {
        fadeAnim.setValue(0);
        translateY.setValue(20);
        if (!cargando && burgers.length > 0) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [cargando, burgers]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                {route.params?.busqueda ? "Resultados de búsqueda" : "Burgers de la carta"}
            </Text>

            {cargando ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON} />
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={{ color: "red" }}>Error: {error}</Text>
                </View>
            ) : burgers.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons
                        name="fast-food-outline"
                        size={100}
                        color={COLORS.TEXTO_GRIS_CLARITO}
                        style={{ marginBottom: 20 }}
                    />
                    <Text style={styles.emptyText}>No se encontraron hamburgesas</Text>
                    <Text style={styles.emptySubText}>
                        Probá ajustar tu búsqueda o recargar la página.
                    </Text>
                </View>
            ) : (
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                    }}
                >
                    <ScrollView
                        contentContainerStyle={{
                            paddingTop: 20,
                            paddingHorizontal: 20,
                            flexGrow: 1,
                        }}
                    >
                        <View style={{ flexGrow: 1 }}>
                            {burgers.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => navigation.navigate("DetalleBurger", { id: item.id })}
                                    activeOpacity={0.8}
                                    style={[styles.card, { marginBottom: 14 }]}
                                >
                                    <Image
                                        source={{ uri: item.img }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.burgerName}>{item.name}</Text>
                                    <Text style={styles.burgerDesc}>{item.description || "Sin descripción"}</Text>

                                    <View style={styles.footerRow}>
                                        <Text style={styles.burgerPrice}>${item.price}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* PAGINACIÓN */}
                        {!route.params?.busqueda && (
                            <View style={styles.paginationContainer}>
                                <TouchableOpacity
                                    style={[styles.pageButton, !paginacion.previous && { opacity: 0.4 }]}
                                    disabled={!paginacion.previous}
                                    onPress={() => irAPagina(paginacion.previous)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.pageButtonText}>Anterior</Text>
                                </TouchableOpacity>

                                <Text style={styles.pageNumberText}>
                                    Página {paginacion.currentPage || 1} de {Math.ceil(paginacion.count / 10)}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.pageButton, !paginacion.next && { opacity: 0.4 }]}
                                    disabled={!paginacion.next}
                                    onPress={() => irAPagina(paginacion.next)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.pageButtonText}>Siguiente</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

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
    /* --- CARD --- */
    card: {
        backgroundColor: COLORS.GRIS_BOTON,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    burgerName: {
        fontSize: 18,
        fontWeight: "700",
        color: "white",
    },
    burgerDesc: {
        color: COLORS.TEXTO_GRIS_CLARITO,
        fontSize: 14,
        marginTop: 6,
    },
    footerRow: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    burgerPrice: {
        color: COLORS.NARANJA_BOTON,
        fontSize: 20,
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
    /* --- PAGINATION --- */
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 90,
        gap: 10,
    },
    pageButton: {
        backgroundColor: COLORS.NARANJA_BOTON,
        padding: 12,
        borderRadius: 30,
    },
    pageButtonText: {
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
    },
    pageNumberText: {
        color: COLORS.GRIS_BOTON,
        fontSize: 16,
        fontWeight: "500",
        alignSelf: "center",
    },
    image: {
        width: "60%",
        height: 200,
        marginHorizontal: "auto",
        borderRadius: 10,
        marginBottom: 10,
    },
});

