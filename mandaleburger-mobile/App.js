import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import Toast from 'react-native-toast-message';

// Screens públicas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

import TabNavigator from './src/navigation/TabNavigator';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PromocionDetalleScreen from './src/screens/PromocionDetalleScreen';

import "./global.css";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/colors';
import { CarritoProvider } from './src/context/CarritoContext';

const Stack = createStackNavigator();

function MyStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name="EditarPerfil"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: "Editar perfil",
              headerStyle: { backgroundColor: COLORS.GRIS_BOTON },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontSize: 18,
              }
            }}
          />
          <Stack.Screen
            name="PromocionDetalle"
            component={PromocionDetalleScreen}
            options={{
              headerShown: true,
              title: "Detalle de la promoción",
              headerStyle: { backgroundColor: COLORS.GRIS_BOTON },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontSize: 18,
              }
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style='light' backgroundColor={COLORS.GRIS_BOTON} />
      <AuthProvider>
        <CarritoProvider>
          <NavigationContainer>
            <MyStack />
          </NavigationContainer>
          <Toast position="top" topOffset={60} visibilityTime={2000} />
        </CarritoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

