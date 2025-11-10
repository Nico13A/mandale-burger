/*
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForgotPassword } from "../hooks/useForgotPassword";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { COLORS } from "../constants/colors";
import BackButton from "../components/BackButton";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [localError, setLocalError] = useState("");
    const { handleForgotPassword, loading, error, success } = useForgotPassword();

    const handleSubmit = async () => {
        if (!email.trim()) {
            setLocalError("Por favor ingresa tu email.");
            return;
        }
        setLocalError("");
        await handleForgotPassword(email);
    };

    return (
        <View style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <Text style={styles.title}>Recuperar contraseña</Text>

                <CustomInput
                    placeholder="Ingrese su email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

     
                {(localError || error) && <Text style={styles.errorText}>{localError || error}</Text>}
                {success && <Text style={styles.successText}>{success}</Text>}

                <Button
                    title="Enviar email"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                />
            </View>
        </View>
    );
}

// ------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    content: {
        width: "100%",
        maxWidth: 380,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: COLORS.GRIS_BOTON || "#374151",
        marginBottom: 24,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 14,
        marginBottom: 14,
        textAlign: "center",
    },
    successText: {
        color: "#22c55e",
        fontSize: 14,
        marginBottom: 8,
        textAlign: "center",
    },
});
*/


import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForgotPassword } from "../hooks/useForgotPassword";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import { COLORS } from "../constants/colors";
import BackButton from "../components/BackButton";

export default function ForgotPasswordScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [localError, setLocalError] = useState("");
    const { handleForgotPassword, loading, error, success } = useForgotPassword();

    // Sincronizar error del backend con localError
    useEffect(() => {
        if (error) setLocalError(error);
    }, [error]);

    const handleSubmit = async () => {
        if (!email.trim()) {
            setLocalError("Por favor ingresa tu email.");
            return;
        }
        setLocalError("");
        await handleForgotPassword(email);
    };

    return (
        <View style={styles.container}>
            <BackButton />
            <View style={styles.content}>
                <Text style={styles.title}>Recuperar contraseña</Text>

                <CustomInput
                    placeholder="Ingrese su email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (localError) setLocalError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Mostrar error o success */}
                {localError && <Text style={styles.errorText}>{localError}</Text>}
                {success && <Text style={styles.successText}>{success}</Text>}

                <Button
                    title="Enviar email"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    content: {
        width: "100%",
        maxWidth: 380,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        color: COLORS.GRIS_BOTON || "#374151",
        marginBottom: 24,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 14,
        marginBottom: 14,
        textAlign: "center",
    },
    successText: {
        color: "#22c55e",
        fontSize: 14,
        marginBottom: 8,
        textAlign: "center",
    },
});
