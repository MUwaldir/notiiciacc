import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import api from "../api/axios";
import CerrarSesionButton from "../components/CerrarSesionButton";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const PerfilScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState<string>("");
  const [imagenPreview, setImagenPreview] = useState<string>("");
  const [imagenArchivo, setImagenArchivo] = useState<any>(null);
  const [editMode, setEditMode] = useState(false); // Estado para determinar si estamos en modo de edición
  const [nombreOriginal, setNombreOriginal] = useState<string>(""); // Para almacenar el nombre original
  const [pulseAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/usuarios/perfil");
        setUser(res.data);
        setNombre(res.data.nombre);
        setImagenPreview(res.data.imagen);
        setNombreOriginal(res.data.nombre); // Guardar el nombre original
      } catch (err) {
        console.error("Error al obtener los datos del usuario", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (editMode) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1); // reset
    }
  }, [editMode]);

  const seleccionarImagen = async () => {
    if (!editMode) return; // Solo permitir seleccionar imagen si estamos en modo de edición

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setImagenPreview(image.uri);
      setImagenArchivo({
        uri: image.uri,
        type: "image/jpeg",
        name: image.fileName || `foto_${Date.now()}.jpg`,
      });
    }
  };

  const actualizarPerfil = async () => {
    if (!user?._id) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }
    // Verifica si hay cambios reales
    const huboCambioEnNombre = nombre !== nombreOriginal;
    const huboCambioEnImagen = !!imagenArchivo;

    if (!huboCambioEnNombre && !huboCambioEnImagen) {
      Alert.alert("Sin cambios", "No se detectaron cambios para actualizar.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    if (imagenArchivo) {
      formData.append("imagen", imagenArchivo as any);
    }

    try {
      const res = await api.put(`/usuarios/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data);
      setNombre(res.data.nombre);
      setImagenPreview(res.data.imagen);
      setNombreOriginal(res.data.nombre); // <-- actualiza el valor original
      setImagenArchivo(null); // <-- limpia el archivo temporal
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setEditMode(false);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Error al actualizar perfil";
      Alert.alert("Error", msg.toString());
    }
  };

  const cancelarEdicion = () => {
    setNombre(nombreOriginal); // Restaurar el nombre original
    setImagenPreview(user?.imagen); // Restaurar la imagen original
    setEditMode(false); // Salir del modo de edición sin guardar cambios
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {editMode && (
          <Text
            style={{ color: "#8B0000", fontWeight: "600", marginBottom: 10 }}
          >
            Modo edición activado
          </Text>
        )}
        <TouchableOpacity onPress={seleccionarImagen}>
          <Animated.View
            style={[
              styles.avatarContainer,
              editMode && {
                transform: [{ scale: pulseAnim }],
                shadowColor: "#8B0000",
                shadowOpacity: 0.6,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          >
            <Image
              source={
                imagenPreview
                  ? { uri: imagenPreview }
                  : require("../../assets/avatar-de-usuario.png")
              }
              style={styles.avatar}
            />
          </Animated.View>
        </TouchableOpacity>

        {editMode ? (
          <TextInput
            style={[styles.input, editMode && styles.inputEditable]}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            editable={editMode}
          />
        ) : (
          <Text style={styles.name}>{user?.nombre}</Text>
        )}

        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={editMode ? actualizarPerfil : () => setEditMode(true)} // Si estamos en modo de edición, guardar cambios
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {editMode ? "Guardar cambios" : "Editar perfil"}
            </Text>
          </TouchableOpacity>

          {editMode && (
            <TouchableOpacity
              onPress={cancelarEdicion} // Cancelar edición
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CerrarSesionButton />

      <TouchableOpacity
        onPress={() => navigation.navigate("MisNoticias" as never)}
        style={styles.newsButton}
      >
        <Text style={styles.newsButtonText}>Mis Noticias</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fdfdfd",
    paddingVertical: 50,
    alignItems: "center",
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    width: "85%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: "#eee",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
    textAlign: "center",
  },
  inputEditable: {
    backgroundColor: "#f9f9f9",
    borderColor: "#8B0000",
    borderWidth: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row", // Asegúrate de que los elementos se alineen en fila
    justifyContent: "center", // Centra el contenido horizontalmente
    alignItems: "center", // Centra el contenido verticalmente
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ccc", // Color diferente para el botón de cancelar
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  newsButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  newsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  
});

export default PerfilScreen;
