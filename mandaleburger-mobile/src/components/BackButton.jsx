import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";

export default function BackButton({ style }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[style]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
        >
            <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.NARANJA_BOTON}
            />
        </TouchableOpacity>
    );
}



