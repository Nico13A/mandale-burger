import {View,Text,StyleSheet,TouchableOpacity,ScrollView,Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { useListPosts } from "../hooks/useListPosts";
import { useNavigation } from "@react-navigation/native";
import StarRating from "../components/StarRating";

export default function Posts() {
  const {
    cargando,
    error,
    posts,
    handleListarPost,
    paginaActual,
    totalPaginas,
    irPaginaSiguiente,
    irPaginaAnterior,
  } = useListPosts();
    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Burgers publicadas</Text>

      {/* LOADING */}
      {cargando && <Text style={styles.info}>Cargando publicaciones...</Text>}

      {/* ERROR */}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}

      {/* LISTA */}
      <ScrollView contentContainerStyle={styles.list}>
        {posts.map((post) => (
            <TouchableOpacity
            key={post.id}
            style={styles.cardPost}
            onPress={() => navigation.navigate("PostDetail", { id: post.id })}
            >
            <Image
                source={{ uri: post.burger?.img }}
                style={styles.imagen}
                resizeMode="contain"
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>
                {post.title}
                </Text>
                <Text style={{ color: "#ccc" }}>@{post.username}</Text>
                <StarRating value={post.average_score} />
            </View>
            
            </TouchableOpacity>
        ))}
        </ScrollView>

      {/* Paginado */}
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={paginaActual <= 1}
          onPress={irPaginaAnterior}
          style={[
            styles.button,
            paginaActual <= 1 && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.pageInfo}>
          Página {paginaActual} de {totalPaginas}
        </Text>

        <TouchableOpacity
          disabled={paginaActual >= totalPaginas}
          onPress={irPaginaSiguiente}
          style={[
            styles.button,
            paginaActual >= totalPaginas && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
  },
  titulo:{
     fontSize: 16, 
     fontWeight: "700", 
     color: "white" 
  },
  imagen: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
},
cardPost:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:COLORS.GRIS_BOTON,
    padding:10,
    borderRadius: 10,
    marginBottom: 1,
},
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: COLORS.GRIS_BOTON_HOVER,
  },
  list: {
    paddingBottom: 20,
    gap: 16,
  },
  info: {
    color: COLORS.GRIS_BOTON_HOVER,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  pageInfo: {
    color: COLORS.GRIS_BOTON_HOVER,
    fontSize: 14,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.NARANJA_BOTON,
    borderRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
