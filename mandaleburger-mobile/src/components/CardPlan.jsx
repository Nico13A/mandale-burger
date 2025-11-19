import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const CardPlan = ({ plan, suscripcionActiva, onSelect }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{plan.name}</Text>

            <View style={styles.line} />

            <Text style={styles.description}>{plan.description}</Text>

            <View style={styles.bottomRow}>
                <Text style={styles.price}>${plan.price}/mes</Text>

                <TouchableOpacity
                    style={[
                        styles.button,
                        suscripcionActiva && styles.buttonDisabled
                    ]}
                    onPress={() => onSelect(plan.id)}
                    disabled={suscripcionActiva}
                >
                    <Text style={styles.buttonText}>
                        {suscripcionActiva ? "Plan activo" : "Elegir este plan"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "auto",
        backgroundColor: COLORS.GRIS_BOTON,
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    line: {
        width: 60,
        height: 4,
        backgroundColor: COLORS.NARANJA_BOTON,
        borderRadius: 10,
        marginVertical: 10,
    },
    description: {
        fontSize: 14,
        color: COLORS.TEXTO_GRIS_CLARITO,
        flexGrow: 1,
        marginBottom: 30,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 60
    },
    price: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "600",
    },
    button: {
        backgroundColor: COLORS.NARANJA_BOTON,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        backgroundColor: "#666",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});

export default CardPlan;
