import { useState, useEffect } from "react";
import { useObtenerPost } from "../hooks/useObtenerPost";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import StarRating from "../components/StarRating";
import { usePublicationRating } from "../hooks/useCalificar";
import { createPublicationComment } from "../services/post";
import { useCarrito } from "../context/CarritoContext";
import { mostrarToast } from "../utils/mostrarToast";

export default function DetailPostScreen() {
    const route = useRoute();
    const { id } = route.params; 
    const {post,cargando,error}= useObtenerPost(id);
    const { rate } = usePublicationRating();
    const { agregarItem, loading } = useCarrito();
    const [rating, setRating] = useState(0);
    const [comentarios, setComentarios]=useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");

    useEffect(() => {
    if (!post) return;

    if (post.user_score != null) {
        setRating(post.user_score);
    }
    setComentarios(post.comments || []);
    }, [post]);

    if (cargando) {
        return (
        <SafeAreaView style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.NARANJA_BOTON_HOVER} />
        </SafeAreaView>
        );
    }

    if (error) {
        return (
        <SafeAreaView style={styles.center}>
            <Text style={{ color: "red" }}>Error: {error}</Text>
        </SafeAreaView>
        );
    }

    if (!post) {
        return (
        <SafeAreaView style={styles.center}>
            <Text style={{ color: "#fff" }}>No se encontró la publicación</Text>
        </SafeAreaView>
        );
    }
    
    const handleAgregar = async () => {
        try {
            await agregarItem({
                customBurgerId: post.custom_burger_id,
                quantity: 1,
            });
            mostrarToast("success", "Agregado", "La Burguer fue agregada al carrito");
        } catch (error) {
            console.error("Error al agregar:", error);
            mostrarToast("error", "Error", "No se pudo agregar al carrito");
        }
    }

    const handleCalificar = async (newScore) => {
    try {
        setRating(newScore);
        await rate(id, newScore);
        mostrarToast("success", "Calificaste la Burger", "");
    } catch (err) {
        console.error("Error al calificar:", err);
        mostrarToast("error", "Error", "No se pudo calificar la burguer");
    }
    };
    const handleComentar = async () => {
    if (!nuevoComentario.trim()) return;

    try {
        const nuevo = await createPublicationComment(id, nuevoComentario);
        setComentarios((prev) => [...prev, nuevo]);
        setNuevoComentario("");
        
    } catch (err) {
        console.error("Error al crear comentario:", err);
        mostrarToast("error", "Error", "No se pudo agregar el comentario".err);
    }
    };

    const imagen = post.image_url?.replace(
        "http://localhost:8000",
        process.env.EXPO_PUBLIC_API_URL
        );
    const title = post.title;
    const descripcion= post.description;
   
    


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
            <View>
                <Text style={styles.title}>{title}</Text>
                {imagen  && (
                    <Image
                    source={{ uri: imagen }}
                    style={styles.image }
                    resizeMode="contain"
                    />
                )}
                <View style={styles.starsContainer}>
                    <StarRating
                    value={rating}
                    onChange={handleCalificar}
                    size={50} 
                    />
                </View>
                <Text style={styles.calificacion}>{(post.average_score ?? 0).toFixed(2)} / 5</Text>
                <Text style={styles.title2}>Descripción:</Text>
                <Text style={styles.descripcion}>
                {descripcion}
                </Text>
                <TouchableOpacity style={styles.commentButton} onPress={handleAgregar}>
                    <Text style={styles.commentButtonText}>Agregar al carrito</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.commentsTitle}>Comentarios</Text>
            <View style={styles.contComentarios}>
                {comentarios.length === 0 ? (
                    <Text style={styles.noComments}>
                    Aún no hay comentarios. ¡Sé el primero en opinar!
                    </Text>
                ) : (
                    <ScrollView
                    style={styles.commentsScroll}
                    nestedScrollEnabled={true}
                    >
                    {comentarios.map((coment) => {
                        const fecha = new Date(coment.comment_date).toLocaleString("es-AR", {
                        day: "2-digit",   
                        month: "2-digit", 
                        year: "2-digit",   
                        hour: "2-digit",   
                        minute: "2-digit", 
                        hour12: false,     
                        });
                        return (
                        <View key={coment.id} style={styles.commentCard}>
                            <View style={styles.commentHeader}>
                            <Text style={styles.commentUser}>{coment.user_display}</Text>
                            <Text style={styles.commentDate}>{fecha}</Text>
                            </View>
                            <Text style={styles.commentText}>{coment.comment_text}</Text>
                        </View>
                        );
                    })}
                    </ScrollView>
                )}
                <View style={styles.commentForm}>
                    <TextInput
                        style={styles.textarea}
                        value={nuevoComentario}
                        onChangeText={setNuevoComentario}
                        placeholder="Escribí tu comentario..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity style={styles.commentButton} onPress={handleComentar}>
                        <Text style={styles.commentButtonText}>Comentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    padding: 20,
  },
  commentsScroll: {
  maxHeight: 320,
},
  commentForm: {
  marginTop: 5,
  gap: 8,
},
textarea: {
  minHeight: 80,
  borderColor: "grey",
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 8,
  color: "#000",
  backgroundColor: "rgba(255,255,255,0.9)",
  textAlignVertical: "top",
},
commentButton: {
  backgroundColor: COLORS.NARANJA_BOTON_HOVER || "#f97316",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 20,
  width:"100%",
  alignSelf: "center",
},
commentButtonText: {
  color: "#fff",
  fontWeight: "700",
  alignSelf: "center",
},
  commentsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 8,
    color: "#1C1C1C",
    marginLeft:10,
  },
  contComentarios: {
    maxHeight:400,
    width: "95%",
    alignSelf: "center",
    backgroundColor: COLORS.GRIS_BOTON, 
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    
  },
  noComments: {
    color: COLORS.TEXTO_GRIS_CLARITO,
    fontStyle: "italic",
    textAlign: "center",
  },
  commentCard: {
  backgroundColor: "white",
  borderRadius: 10,
  borderWidth: 1,     
  borderColor: "grey",
  padding: 6,
  marginBottom: 1,  
  marginBottom:8,      
},
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: "700",
    color: "black",
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
    color: COLORS.TEXTO_GRIS_CLARITO,
  },
  commentText: {
    color: "black",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
  image: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000",
    textAlign: "center", 
  },
  title2: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000", 
    marginLeft:10,
  },
  calificacion: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000", 
    marginLeft:10,
  },
  descripcion: {
    color: COLORS.TEXTO_GRIS_CLARITO,
    fontSize: 14,
    marginBottom: 8,
    marginLeft:10,
  },
  starsContainer: {
    alignItems: "center",
    marginTop: -45, 
  },
});