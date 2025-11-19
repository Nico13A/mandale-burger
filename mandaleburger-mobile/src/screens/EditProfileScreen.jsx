import { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { usePerfil } from "../hooks/usePerfil";
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../constants/colors";
import { mostrarToast } from "../utils/mostrarToast";

export default function EditProfileScreen({ navigation }) {
    const { user, refreshUser } = useAuth();
    const { cargando, actualizarPerfil } = usePerfil();

    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleChange = (campo, valor) => {
        setFormData((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const dataToSend = {
            username: formData.username || user.username,
            first_name: formData.first_name || "",
            last_name: formData.last_name || "",
            email: formData.email || "",
        };
        try {
            const res = await actualizarPerfil(dataToSend);
            if (res) {
                await refreshUser();
                mostrarToast("success", "Éxito", "Perfil actualizado correctamente");
                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            } else {
                mostrarToast("error", "Error", "No se pudo actualizar el perfil.");
            }
        } catch (err) {
            console.log("Error al actualizar perfil:", err);
            mostrarToast("error", "Error", "Ocurrió un problema al actualizar el perfil.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Campo: Usuario (no editable) */}
                <View style={styles.field}>
                    <Text style={styles.label}>Usuario</Text>
                    <CustomInput
                        value={formData.username}
                        editable={false}
                        placeholder="Usuario"
                        style={styles.disabledInput}
                    />
                </View>

                {/* Campo: Nombre */}
                <View style={styles.field}>
                    <Text style={styles.label}>Nombre</Text>
                    <CustomInput
                        placeholder="Ingrese su nombre"
                        value={formData.first_name}
                        onChangeText={(text) => handleChange("first_name", text)}
                        autoCapitalize="words"
                    />
                </View>

                {/* Campo: Apellido */}
                <View style={styles.field}>
                    <Text style={styles.label}>Apellido</Text>
                    <CustomInput
                        placeholder="Ingrese su apellido"
                        value={formData.last_name}
                        onChangeText={(text) => handleChange("last_name", text)}
                        autoCapitalize="words"
                    />
                </View>

                {/* Campo: Email */}
                <View style={styles.field}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <CustomInput
                        placeholder="Ingrese su correo"
                        value={formData.email}
                        onChangeText={(text) => handleChange("email", text)}
                        keyboardType="email-address"
                    />
                </View>

                {/* Botón reutilizable */}
                <Button
                    title="Actualizar perfil"
                    onPress={handleSubmit}
                    loading={cargando || isSubmitting}
                    disabled={cargando || isSubmitting}
                    style={{ marginTop: 14, backgroundColor: COLORS.GRIS_BOTON }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.NARANJA_BOTON,
        marginBottom: 6,
        fontWeight: "500",
    },
    disabledInput: {
        backgroundColor: COLORS.TEXTO_GRIS_CLARITO,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        position: "relative",
        zIndex: 1,
    },
});
