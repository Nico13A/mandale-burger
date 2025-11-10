import { useState } from "react";
import { Text, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRegister } from "../hooks/useRegister";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { COLORS } from "../constants/colors";
import BackButton from "../components/BackButton";

export default function RegisterScreen({ navigation }) {
    const { handleRegister, loading } = useRegister();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });
    const [errors, setErrors] = useState({});

    const [isLoginPressed, setIsLoginPressed] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "El usuario es obligatorio.";
        if (!formData.email) newErrors.email = "El email es obligatorio.";
        if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
        if (!formData.first_name) newErrors.first_name = "El nombre es obligatorio.";
        if (!formData.last_name) newErrors.last_name = "El apellido es obligatorio.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            await handleRegister(formData);
        } catch (err) {
            if (err.password) {
                err.password = err.password.map((msg) =>
                    msg.includes("This password is too short")
                        ? "Esta contraseña es demasiado corta. Debe contener al menos 8 caracteres."
                        : msg
                );
            }
            if (err.username && err.username.includes("A user with that username already exists.")) {
                err.username = "Ya existe un usuario con ese nombre.";
            }
            if (err.email && err.email.includes("user with this email address already exists.")) {
                err.email = "Ya existe un usuario con esa dirección de email.";
            }
            setErrors(err);
        }
    };

    const renderSingleError = (field) => {
        const errorValue = errors[field];
        if (!errorValue) return null;
        const message = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        return <Text style={styles.errorText}>{message}</Text>;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Crear cuenta</Text>

                    {/* Usuario */}
                    <CustomInput
                        placeholder="Ingrese su usuario"
                        value={formData.username}
                        onChangeText={(value) => handleChange("username", value)}
                        editable={!loading}
                    />
                    {renderSingleError('username')}

                    {/* Email */}
                    <CustomInput
                        placeholder="Ingrese su email"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(value) => handleChange("email", value)}
                        editable={!loading}
                    />
                    {renderSingleError('email')}

                    {/* Contraseña */}
                    <CustomInput
                        placeholder="Ingrese su contraseña"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(value) => handleChange("password", value)}
                    />
                    {errors.password &&
                        (Array.isArray(errors.password) ? (
                            errors.password.map((msg, i) => (
                                <Text key={i} style={styles.errorText}>{msg}</Text>
                            ))
                        ) : (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ))}

                    {/* Nombre */}
                    <CustomInput
                        placeholder="Ingrese su nombre"
                        value={formData.first_name}
                        onChangeText={(value) => handleChange("first_name", value)}
                        editable={!loading}
                    />
                    {renderSingleError('first_name')}

                    {/* Apellido */}
                    <CustomInput
                        placeholder="Ingrese su apellido"
                        value={formData.last_name}
                        onChangeText={(value) => handleChange("last_name", value)}
                    />
                    {renderSingleError('last_name')}

                    {/* Botón principal */}
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Registrarse"
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={loading}
                            style={{ backgroundColor: COLORS.GRIS_BOTON }}
                        />
                    </View>

                    <Text style={styles.registerPrompt}>
                        ¿Ya tienes cuenta?{" "}
                        <Text
                            style={[
                                styles.registerLink,
                                isLoginPressed && styles.registerLinkPressed,
                            ]}
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate("Login"); 
                                }
                            }}
                            onPressIn={() => setIsLoginPressed(true)}
                            onPressOut={() => setIsLoginPressed(false)}
                        >
                            Inicia sesión
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ------------------------------------------------------------------

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        alignItems: "center",
    },
    formContainer: {
        width: "100%",
        maxWidth: 380,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 20,
    },
    errorText: {
        color: "#ef4444",
        marginBottom: 14,
        fontSize: 14,
        width: "100%",
    },
    buttonContainer: {
        marginTop: 6,
    },
    registerPrompt: {
        textAlign: "center",
        fontSize: 15,
        color: COLORS.GRIS_BOTON_HOVER,
        marginTop: 16,
        marginBottom: 40,
    },
    registerLink: {
        color: COLORS.NARANJA_BOTON,
        fontWeight: "600",
    },
    registerLinkPressed: {
        textDecorationLine: 'underline',
    },
});