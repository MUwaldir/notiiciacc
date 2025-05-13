import React, { useContext } from "react";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../App"; // Asegúrate de que la ruta sea correcta
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native"; // Importamos CommonActions

const CerrarSesionButton: React.FC = () => {
  const { setIsLoggedIn } = useContext(AuthContext); // Usamos el AuthContext
  const navigation = useNavigation(); // Usamos el tipo de navegación

  const handleLogout = async (): Promise<void> => {
    try {
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem("token");

      // Actualizar el estado global de autenticación
      setIsLoggedIn(false);

      // Usar CommonActions.reset para restablecer la pila de navegación
      navigation.dispatch(
        CommonActions.reset({
          index: 0, // La pantalla inicial será la de Login
          routes: [{ name: "MainApp" }], // Redirigimos a Login
        })
      );
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return <Button title="Cerrar sesión" onPress={handleLogout} />;
};

export default CerrarSesionButton;
