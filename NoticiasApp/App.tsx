import React, { useEffect, useState, createContext } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoticiasScreen from "./src/screens/NoticiasScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ComentariosScreen from "./src/screens/ComentariosScreen";
import { RootStackParamList, RootTabParamList } from "./src/types/types";
import CrearNoticia from "./src/screens/CrearNoticia";
import { Image, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MisNoticiasScreen } from "./src/screens/MisNoticiasScreen";
import { EditarNoticiaScreen } from "./src/screens/EditarNoticia";
// O también puedes usar otros como FontAwesome, Ionicons, etc.

export const AuthContext = createContext<any>(null);

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#8B0000" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#8B0000",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Noticias") {
            iconName = "article";
          } else if (route.name === "Perfil") {
            iconName = "person";
          } else if (route.name === "Crear Noticia") {
            iconName = "create";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        // Muestra el logo en la esquina superior derecha
        headerRight: () => (
          <Image
            source={require("./assets/logo_app_central.png")} // asegúrate que la imagen exista en esta ruta
            style={{
              width: 35,
              height: 35,
              marginRight: 15,
              resizeMode: "contain",
              borderRadius: 8, // si es cuadrado puede suavizarlo
            }}
          />
        ),
      })}
    >
      <Tab.Screen name="Noticias" component={NoticiasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Crear Noticia" component={CrearNoticia} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isTokenChecked, setIsTokenChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsTokenChecked(true); // Marcamos que ya se ha verificado el token
    };
    checkToken();
  }, []);

  if (!isTokenChecked) {
    return <></>; // Aquí podrías mostrar un componente de carga si lo deseas
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              <Stack.Screen name="MainApp" component={MainApp} />
              <Stack.Screen name="Comentarios" component={ComentariosScreen} />
              <Stack.Screen name="CrearNoticia" component={CrearNoticia} />
              <Stack.Screen name="MisNoticias" component={MisNoticiasScreen} />
              <Stack.Screen name="EditarNoticia" component={EditarNoticiaScreen} />


            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
