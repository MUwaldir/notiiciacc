import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "../api/axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Picker } from "@react-native-picker/picker";

type Props = NativeStackScreenProps<RootStackParamList, "CrearNoticia">;

const CrearNoticia: React.FC<Props> = ({ navigation }) => {
  const [titulo, setTitulo] = useState<string>("");
  const [contenido, setContenido] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [ubicacion, setUbicacion] = useState<string>("");
  const [imagenes, setImagenes] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false); // 👈 Estado para el spinner

  // Función para seleccionar imágenes desde la galería
  const seleccionarImagen = async (source: "galeria" | "camara") => {
    let result;
    if (source === "camara") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    }

    if (!result.canceled) {
      const nuevas = result.assets;
      const total = imagenes.length + nuevas.length;

      if (total > 5) {
        Alert.alert("Máximo 5 imágenes permitidas");
        return;
      }

      setImagenes([...imagenes, ...nuevas]);
    }
  };

  const eliminarImagen = (index: number) => {
    const actualizadas = imagenes.filter((_, i) => i !== index);
    setImagenes(actualizadas);
  };

  const getFileName = (uri) => {
    return uri.split("/").pop();
  };

  const getMimeType = (uri) => {
    const ext = uri.split(".").pop().toLowerCase(); // Obtener la extensión del archivo
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
      // Agregar más extensiones si es necesario
      default:
        return "image/jpeg"; // Valor por defecto
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !contenido.trim()) {
      Alert.alert("Todos los items son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("contenido", contenido);
    formData.append("tipo", tipo);
    formData.append("ubicacion", ubicacion);

    imagenes.forEach((img, index) => {
      const mimeType = getMimeType(img.uri); // Obtén el tipo MIME correcto
      formData.append("imagenes", {
        uri: img.uri,
        name: img.fileName || getFileName(img.uri),
        type: mimeType,
        // type: img.type || "image/jpeg",
      });
    });

    setLoading(true); // 👈 Inicia carga
    try {
      await axios.post("/noticias", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Noticia publicada correctamente");
      setTitulo("");
      setContenido("");
      setImagenes([]);
      navigation.goBack();
    } catch (err) {
      console.error("Error al publicar noticia", err);
      Alert.alert("Error al publicar la noticia");
    } finally {
      setLoading(false); // 👈 Finaliza carga
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Noticia</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Contenido"
        value={contenido}
        onChangeText={setContenido}
        multiline
        numberOfLines={6}
      />

      <Text>Tipo de Noticia</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipo}
          onValueChange={setTipo}
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
        value={ubicacion}
        onChangeText={setUbicacion}
        style={styles.input}
      />

      <View style={styles.imageOptions}>
        <TouchableOpacity
          style={styles.imageSelectButton}
          onPress={() => seleccionarImagen("galeria")}
        >
          <Text style={styles.imageSelectText}>Seleccionar desde galería</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageSelectButton}
          onPress={() => seleccionarImagen("camara")}
        >
          <Text style={styles.imageSelectText}>Tomar foto con cámara</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageGrid}>
        {imagenes.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => eliminarImagen(index)}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#b91c1c" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Publicar Noticia</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default CrearNoticia;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#b91c1c",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  imageSelectButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  imageSelectText: {
    fontSize: 16,
    color: "#333",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 20,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 6,
    borderRadius: 12,
  },
  removeText: {
    color: "white",
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#b91c1c",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 20,
  },
});
