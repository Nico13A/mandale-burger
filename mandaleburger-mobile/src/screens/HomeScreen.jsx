import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth"; 
import Button from "../components/Button"; 

export default function HomeScreen() {
    const { user, logout } = useAuth(); 
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                ¡Bienvenido/a, {user?.username || 'Usuario'}!
            </Text>
            <Text style={styles.subtitle}>
                Esta es la pantalla principal.
            </Text>

            <View style={{ marginTop: 50, width: '80%' }}>
                <Button
                    title="Cerrar Sesión"
                    onPress={logout}
                />
            </View>
        </SafeAreaView>
    );
}

// ------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#374151',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
});