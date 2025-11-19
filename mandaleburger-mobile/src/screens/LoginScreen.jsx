import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../hooks/useAuth";

import { COLORS } from "../constants/colors";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";

const logoUrl = require("../assets/Logo.png");

export default function LoginScreen() {
    const navigation = useNavigation();
    const { handleLogin, loading, error } = useLogin();
    const { user } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState(null);

    const [isRegisterPressed, setIsRegisterPressed] = useState(false);

    // Sincronizar error del backend con localError
    useEffect(() => {
        if (error) setLocalError(error);
    }, [error]);

    // Redirigir si el usuario está logueado
    useEffect(() => {
        if (user && !loading) {
            navigation.replace("MainTabs", {screen: "Inicio"});
        }
    }, [user, loading, navigation]);

    const onSubmit = async () => {
        await handleLogin(username, password);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Image
                source={logoUrl}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar sesión</Text>

                <CustomInput
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        if (localError) setLocalError(null);
                    }}
                    placeholder="Ingrese su usuario"
                />

                <CustomInput
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (localError) setLocalError(null);
                    }}
                    placeholder="Ingrese su contraseña"
                    secureTextEntry
                />

                {localError && (
                    <Text style={styles.errorText}>{localError}</Text>
                )}

                <Button
                    title="Ingresar"
                    onPress={onSubmit}
                    loading={loading}
                />

                <Text
                    style={styles.forgotPasswordText}
                    onPress={() => navigation.navigate("ForgotPassword")}
                >
                    ¿Olvidaste tu contraseña?
                </Text>

                <Text style={styles.registerPrompt}>
                    ¿No tienes una cuenta?{" "}
                    <Text
                        style={[styles.registerLink, isRegisterPressed && styles.registerLinkPressed]}
                        onPress={() => navigation.navigate("Register")}
                        onPressIn={() => setIsRegisterPressed(true)}
                        onPressOut={() => setIsRegisterPressed(false)}
                    >
                        Regístrate aquí
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

// ------------------------------------------------------------------

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        alignItems: "center",
        padding: 24,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 60,
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
        textAlign: "center",
        marginBottom: 14,
        fontSize: 14,
    },
    forgotPasswordText: {
        color: "#6b7280",
        textAlign: "right",
        marginBottom: 16,
        fontSize: 14,
    },
    registerPrompt: {
        textAlign: "center",
        fontSize: 15,
        color: COLORS.GRIS_BOTON_HOVER,
    },
    registerLink: {
        color: COLORS.NARANJA_BOTON,
        fontWeight: "600",
    },
    registerLinkPressed: {
        textDecorationLine: "underline",
    },
});

