import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../App";

const RegisterScreen = ({ navigation }: any) => {
  // const { setIsLoggedIn } = useContext(AuthContext);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    // Convertimos el correo a minúsculas antes de enviarlo
    const emailLowerCase = email.toLowerCase();
    try {
      const res = await api.post("/usuarios/registro", {
        nombre,
        email: emailLowerCase,
        password,
      });
      Alert.alert("Registro exitoso", "Ahora inicia sesión con tus datos");
      navigation.navigate("Login");
      // setIsLoggedIn(true);
      // Redirigir o realizar otra acción en caso de éxito
    } catch (error: any) {
      console.log(error); // Esto te ayudará a ver el error completo

      // Verifica si el error es del tipo esperado
      const msg =
        error?.response?.data?.message || "Error al registrar usuario"; // Aquí obtenemos el mensaje del backend
      Alert.alert("Registro fallido", msg.toString()); // Muestra el error en una alerta
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={register} style={styles.button}>
        <Text style={styles.buttonText}>Crear Cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    color: "#8B0000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#8B0000",
    textAlign: "center",
  },
});

export default RegisterScreen;
