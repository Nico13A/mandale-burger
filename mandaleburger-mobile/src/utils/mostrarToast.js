import Toast from "react-native-toast-message";

export const mostrarToast = (type, title, message) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
};
