import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors'; 

const Button = ({ title, onPress, loading = false, disabled = false, style }) => {
    const buttonColor = COLORS.NARANJA_BOTON; 

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.loginButton, { backgroundColor: buttonColor }, style]}
            disabled={loading || disabled}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    loginButton: {
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        height: 54.8,
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});

export default Button;