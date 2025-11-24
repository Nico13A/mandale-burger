import { Text, Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function CardPost({ post, onPress }) {
  const burger = post?.burger || {};
  const name = burger.name || burger.custom_name || "Burger publicada";
  const img = burger.img;
  const price = burger.price;

  const rating = post?.average_score;
  const commentsCount = post?.comments_count;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress && onPress(post)}
      activeOpacity={0.8}
    >
      {img && (
        <Image
          source={{ uri: img }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {post?.description && (
        <Text numberOfLines={2} style={styles.description}>
          {post.description}
        </Text>
      )}

      <View style={styles.footerRow}>
        {typeof price !== "undefined" && (
          <Text style={styles.price}>${price}</Text>
        )}

        <View style={styles.metaRow}>
          {typeof rating !== "undefined" && (
            <Text style={styles.rating}>
              ⭐ {Number(rating).toFixed(1)}
            </Text>
          )}

          {typeof commentsCount !== "undefined" && (
            <View style={styles.comments}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={14}
                color={COLORS.TEXTO_GRIS_CLARITO}
              />
              <Text style={styles.commentsText}>{commentsCount}</Text>
            </View>
          )}
        </View>
      </View>
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
  footerRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    color: "#facc15",
    fontSize: 12,
    fontWeight: "600",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentsText: {
    color: COLORS.TEXTO_GRIS_CLARITO,
    fontSize: 12,
  },
});
