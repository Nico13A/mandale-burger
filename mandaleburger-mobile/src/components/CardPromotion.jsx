import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function CardPromotion({ promo, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(promo)} activeOpacity={0.8} >
            <Image
                source={{ uri: promo.img }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.name}>{promo.name}</Text>
            <Text numberOfLines={2} style={styles.description}>{promo.description}</Text>
            <Text style={styles.price}>${promo.price}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.GRIS_BOTON,
        borderRadius: 10,
        padding: 20,
        width: 260,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    name: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: COLORS.TEXTO_GRIS_CLARITO,
        marginBottom: 5,
    },
    price: {
        fontWeight: "600",
        fontSize: 14,
        color: COLORS.NARANJA_BOTON,
    },
});
