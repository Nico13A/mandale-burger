import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PedidosScreen from "../screens/PedidosScreen";
import MisBurgersScreen from "../screens/MisBurgersScreen";
import CarritoScreen from "../screens/CarritoScreen";

import { COLORS } from "../constants/colors";
import { useCarrito } from "../context/CarritoContext";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const insets = useSafeAreaInsets();
    const { cart } = useCarrito();
    const totalItems = cart?.items?.length || 0;

    return (
        <Tab.Navigator
            initialRouteName="Inicio"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: COLORS.NARANJA_BOTON,
                tabBarInactiveTintColor: COLORS.GRIS_BOTON,
                tabBarStyle: {
                    backgroundColor: "#fff",
                    position: "absolute",
                    bottom: insets.bottom + 10,
                    marginHorizontal: 20,
                    borderTopWidth: 0,
                    borderRadius: 50,
                    height: 70,
                    paddingBottom: 6,
                    paddingTop: 6,
                    elevation: 2,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "500",
                },
                tabBarIcon: ({ color }) => {
                    let iconName;
                    switch (route.name) {
                        case "Inicio":
                            iconName = "home";
                            break;
                        case "Burgers":
                            iconName = "fast-food";
                            break;
                        case "Carrito":
                            iconName = "cart";
                            break;
                        case "Pedidos":
                            iconName = "receipt";
                            break;
                        case "Perfil":
                            iconName = "person";
                            break;
                    }
                    return (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name={iconName} size={24} color={color} />
                            {route.name === "Carrito" && totalItems > 0 && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: -6,
                                        right: -12,
                                        backgroundColor: COLORS.NARANJA_BOTON_HOVER,
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        paddingHorizontal: 0,
                                        paddingVertical: 0,
                                    }}
                                >
                                    <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name="Burgers" component={MisBurgersScreen} />
            <Tab.Screen name="Carrito" component={CarritoScreen} options={{ tabBarLabel: "" }} />
            <Tab.Screen name="Pedidos" component={PedidosScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}


