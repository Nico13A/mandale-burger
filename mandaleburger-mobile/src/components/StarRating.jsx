import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function StarRating({ value = 0, max = 5, onChange, size = 20 }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange && onChange(star)}
          activeOpacity={0.7}
        >
          <Text
            style={{
              fontSize: size, // ✔ tamaño dinámico
              color: star <= value ? "#facc15" : COLORS.TEXTO_GRIS_CLARITO,
              marginRight: 4,
            }}
          >
            {star <= value ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 15,
  },
});
