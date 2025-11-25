import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import CardPlan from "../components/CardPlan";
import { useCocineroDia } from "../hooks/useCocineroDia";
import { useEffect, useState } from "react";
import CocineroModal from "../components/CocineroModal";
import { usePlanes } from "../hooks/usePlanes";
import { useSuscripcion } from "../hooks/useSuscripcion";
import { usePagarPlan } from "../hooks/usePagarPlan";
import { mostrarToast } from "../utils/mostrarToast";
import { usePromociones } from "../hooks/usePromociones";
import CardPromotion from "../components/CardPromotion";
import { useNavigation } from "@react-navigation/native";
import { useListPosts } from "../hooks/useListPosts";
import CardPost from "../components/CardPost";
import Campanita from "../components/Campanita";

export default function HomeScreen() {

    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);
    const { cocinero, cargando, error, cargar } = useCocineroDia();
    const { planes, cargarPlanes } = usePlanes();
    const { suscripcion, cargarSuscripcionActiva } = useSuscripcion();
    const { pagarPlan } = usePagarPlan();
    const { promociones } = usePromociones();
    const { posts, cargando: cargandoPost, error: errorPost } = useListPosts();
    const [busqueda, setBusqueda] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            await cargarPlanes();
            await cargarSuscripcionActiva();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") {
                cargarSuscripcionActiva();
            }
        });
        return () => subscription.remove();
    }, []);


    const handleVerCocinero = async () => {
        setVisible(true);
        await cargar();
    }

    const handlePagarSuscripcion = async (planId) => {
        if (suscripcion) {
            mostrarToast("error", "Atención", "Ya tenes un plan activo");
            return;
        }
        try {
            await pagarPlan(planId);
        } catch (error) {
            console.error(error);
            mostrarToast("error", "Error", "No se pudo iniciar el pago");
        }
    }

    const handleBuscar = () => {
        const texto = busqueda.trim();
        if (!texto) return;
        navigation.navigate("Burgers", { busqueda: texto });
        setBusqueda(""); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.blackBox}>
                    <View style={styles.headerRow}>
                        <Campanita />
                    </View>
                    <TextInput
                        placeholder="Ingrese la hamburguesa que busca..."
                        placeholderTextColor="#ccc"
                        style={styles.input}
                        value={busqueda}
                        onChangeText={setBusqueda}
                        onSubmitEditing={handleBuscar}
                    />
                </View>

                <TouchableOpacity style={styles.cocineroBtn} onPress={handleVerCocinero} activeOpacity={0.8}>
                    <Text style={styles.cocineroBtnText}>Ver cocinero del día</Text>
                </TouchableOpacity>

                {planes.length > 0 && (
                    <>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "700",
                            marginLeft: 20,
                            marginBottom: 10,
                            color: COLORS.GRIS_BOTON_HOVER
                        }}>
                            Nuestros planes
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, gap: 14 }}
                        >
                            {planes.map((plan) => (
                                <CardPlan
                                    key={plan.id}
                                    plan={plan}
                                    suscripcionActiva={suscripcion?.plan?.id === plan.id}
                                    onSelect={(id) => handlePagarSuscripcion(id)}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}

                {promociones && promociones.length > 0 && (
                    <>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: "700",
                            marginLeft: 20,
                            marginVertical: 10,
                            color: COLORS.GRIS_BOTON_HOVER
                        }}>
                            Promociones
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, gap: 14 }}
                        >
                            {promociones.map((promo) => (
                                <CardPromotion
                                    key={promo.id}
                                    promo={promo}
                                    onPress={(p) => navigation.navigate("PromocionDetalle", { promo: p })}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}
                {posts && posts.length > 0 && !cargandoPost && !errorPost && (
                    <>
                        <View style={styles.publicadasHeader}>
                            <Text style={styles.publicada}>Burgers publicadas</Text>

                            <TouchableOpacity onPress={() => navigation.navigate("Posts")}>
                                <Text style={styles.link}>Ver más</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, gap: 14 }}
                        >
                            {posts.slice(0, 5).map((post) => (
                                <CardPost
                                    key={post.id}
                                    post={post}
                                    onPress={() => navigation.navigate("PostDetail", { id: post.id })}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}


            </ScrollView>

            <CocineroModal
                visible={visible}
                onClose={() => setVisible(false)}
                cocinero={cocinero}
                cargando={cargando}
                error={error}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.BACKGROUND,
        flex: 1,
    },
    publicadasHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 10,
    },

    publicada: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.GRIS_BOTON_HOVER,
    },

    link: {
        fontSize: 14,
        color: COLORS.NARANJA_BOTON,
        textDecorationLine: "underline",
        fontWeight: "500",
    },
    scrollContent: {
        paddingBottom: 90,
    },

    blackBox: {
        width: "100%",
        backgroundColor: COLORS.GRIS_BOTON,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20,
        gap: 20
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    input: {
        backgroundColor: "#000",
        color: "#fff",
        padding: 14,
        borderRadius: 8,
        fontSize: 16,
    },

    cocineroBtn: {
        backgroundColor: COLORS.NARANJA_BOTON_HOVER,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        alignSelf: "flex-end",
        marginHorizontal: 20,
        marginBottom: 10,
    },

    cocineroBtnText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#374151',
    },

    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
});
