import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "../api/axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export const EditarNoticiaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [noticia, setNoticia] = useState({
    titulo: "",
    contenido: "",
    tipo: "",
    ubicacion: "",
    imagenes: [],
  });

  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [previewNuevas, setPreviewNuevas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para gestionar la carga

  useEffect(() => {
    const obtenerNoticia = async () => {
      try {
        const res = await axios.get(`/noticias/${id}`);
        setNoticia(res.data);
      } catch (err) {
        console.error("Error al obtener la noticia", err);
      }
    };

    obtenerNoticia();
  }, [id]);

  const handleInputChange = (field, value) => {
    setNoticia({ ...noticia, [field]: value });
  };

  const totalImagenes = () => noticia.imagenes.length + imagenesNuevas.length;

  const eliminarImagen = (url) => {
    Alert.alert("Confirmar", "¿Eliminar esta imagen?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: () => {
          const nuevas = noticia.imagenes.filter((img) => img !== url);
          setNoticia({ ...noticia, imagenes: nuevas });
        },
      },
    ]);
  };

  const eliminarPreview = (index) => {
    const nuevasPrev = [...previewNuevas];
    const nuevasImgs = [...imagenesNuevas];
    nuevasPrev.splice(index, 1);
    nuevasImgs.splice(index, 1);
    setPreviewNuevas(nuevasPrev);
    setImagenesNuevas(nuevasImgs);
  };

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted" || cameraStatus.status !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Necesitamos permisos para acceder a tu cámara y galería para que puedas tomar o seleccionar imágenes.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert("Agregar imagen", "Elige una opción", [
      {
        text: "Cámara",
        onPress: async () => {
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
          });

          if (!result.canceled) {
            const imagen = result.assets ? result.assets[0] : result;
            setImagenesNuevas((prev) => [...prev, imagen]);
            setPreviewNuevas((prev) => [...prev, imagen.uri]);
            setError("");
          }
        },
      },
      {
        text: "Galería",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5,
            quality: 1,
          });

          if (!result.canceled) {
            const nuevas = result.assets || [result];
            const nuevasFiltradas = nuevas.slice(0, 5 - totalImagenes());
            setImagenesNuevas((prev) => [...prev, ...nuevasFiltradas]);
            setPreviewNuevas((prev) => [
              ...prev,
              ...nuevasFiltradas.map((img) => img.uri),
            ]);
            setError("");
          }
        },
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const getFileName = (uri) => {
    return uri.split("/").pop();
  };

  const getMimeType = (uri) => {
    const ext = uri.split(".").pop().toLowerCase();
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "bmp":
        return "image/bmp";
      default:
        return "image/jpeg";
    }
  };

  const handleSubmit = async () => {
    if (totalImagenes() > 5) {
      setError("Máximo 5 imágenes por noticia.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", noticia.titulo);
    formData.append("contenido", noticia.contenido);
    formData.append("tipo", noticia.tipo);
    formData.append("ubicacion", noticia.ubicacion);

    noticia.imagenes.forEach((img) => {
      formData.append("imagenesExistentes", img);
    });

    imagenesNuevas.forEach((img) => {
      const mimeType = getMimeType(img.uri);
      formData.append("imagenes", {
        uri: img.uri,
        name: img.fileName || getFileName(img.uri),
        type: mimeType,
      });
    });

    try {
      setLoading(true); // Inicia el estado de carga
      await axios.put(`/noticias/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast.show({ type: "success", text1: "Noticia actualizada" });
      setLoading(false); // Detiene el estado de carga
      navigation.navigate("MainApp");
    } catch (err) {
      Toast.show({ type: "error", text1: "Error al actualizar" });
      setLoading(false); // Detiene el estado de carga en caso de error
      console.error(err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Noticia</Text>

      <Text>Título</Text>
      <TextInput
        value={noticia.titulo}
        onChangeText={(text) => handleInputChange("titulo", text)}
        style={styles.input}
      />

      <Text>Contenido</Text>
      <TextInput
        value={noticia.contenido}
        onChangeText={(text) => handleInputChange("contenido", text)}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Text>Tipo de Noticia</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={noticia.tipo}
          onValueChange={(itemValue) => handleInputChange("tipo", itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione tipo de noticia" value="" />
          <Picker.Item label="🚑 Accidente" value="accidente" />
          <Picker.Item label="🚧 Bloqueo" value="bloqueo" />
          <Picker.Item label="🌤️ Clima" value="clima" />
          <Picker.Item label="🏗️ Obras" value="obras" />
          <Picker.Item label="❓ Otro" value="otro" />
        </Picker>
      </View>

      <Text>Ubicación</Text>
      <TextInput
        value={noticia.ubicacion}
        onChangeText={(text) => handleInputChange("ubicacion", text)}
        style={styles.input}
      />

      <Text style={styles.label}>
        Imágenes actuales ({noticia.imagenes.length})
      </Text>
      {noticia.imagenes.map((url, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri: url }} style={styles.image} />
          <TouchableOpacity
            onPress={() => eliminarImagen(url)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Nuevas imágenes seleccionadas</Text>
      {previewNuevas.map((uri, index) => (
        <View key={index} style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.image} />
          <TouchableOpacity
            onPress={() => eliminarPreview(index)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Button title="Seleccionar imágenes" onPress={seleccionarImagen} />

      <View style={{ marginTop: 20, marginBottom: 30 }}>
        <Button title="Guardar cambios" onPress={handleSubmit} />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Actualizando...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16,marginTop:20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 6,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    padding: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
