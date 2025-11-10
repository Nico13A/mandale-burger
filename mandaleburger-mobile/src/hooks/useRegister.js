import { useState } from "react";
import { register as apiRegister } from "../services/auth";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export const useRegister = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      await apiRegister(formData);
      Alert.alert("Registro exitoso", "Ya puedes iniciar sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading };
};