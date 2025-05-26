import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import qs from "qs";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../App";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

// Al inicio del archivo
WebBrowser.maybeCompleteAuthSession();
const LoginScreen = ({ navigation }: any) => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const emailLowerCase = email.toLowerCase();
    try {
      const res = await api.post(
        "/auth/login",
        qs.stringify({ email: emailLowerCase, password }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log(res.data);

      await AsyncStorage.setItem("token", res.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas");
    }
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "<IOS_CLIENT_ID>",
    androidClientId: "<ANDROID_CLIENT_ID>",
    expoClientId: "<EXPO_CLIENT_ID>",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication!;
      loginWithGoogle(id_token);
    } else if (response?.type === "error") {
      Alert.alert("Error", "Autenticación de Google fallida");
    }
  }, [response]);

  const loginWithGoogle = async (idToken: string) => {
    try {
      const res = await api.post("/auth/google", { idToken });
      await AsyncStorage.setItem("token", res.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Falló el login con Google. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/logo_app_central.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Bienvenido a Noticias</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => promptAsync()}
        style={styles.googleButton}
      >
        <View style={styles.googleContent}>
          <Image
            source={require("../../assets/icons8-logo-de-google-48.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Entrar con Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  
  logo: {
    width: "80%",
    height: 120,
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
    width: "100%",
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
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
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  googleContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  googleButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
