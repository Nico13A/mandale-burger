import { useState } from "react"
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const showEyeIcon = secureTextEntry

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused, showEyeIcon && styles.inputWithIcon]}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        cursorColor={COLORS.NARANJA_BOTON}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {showEyeIcon && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          activeOpacity={0.7}
        >
          <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={22} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
    marginBottom: 14,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    fontSize: 16,
    position: "relative",
    zIndex: 1,
  },
  inputFocused: {
    borderColor: COLORS.NARANJA_BOTON,
    shadowColor: COLORS.NARANJA_BOTON,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 1,
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: "50%",                   
    transform: [{ translateY: -11 }],
    zIndex: 100,
  },
})

export default CustomInput