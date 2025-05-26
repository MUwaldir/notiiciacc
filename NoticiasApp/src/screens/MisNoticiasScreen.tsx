import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MisNoticiasScreen = () => {
  const [noticias, setNoticias] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMisNoticias = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const response = await axios.get(`/noticias/usuario/`);
        setNoticias(response.data);
      } catch (error) {
        console.error("Error al obtener tus noticias:", error);
      }
    };

    fetchMisNoticias();
  }, []);

  const eliminarNoticia = async (id) => {
    Alert.alert(
      "Eliminar Noticia",
      "¿Estás seguro de que deseas eliminar esta noticia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`/noticias/${id}`);
              setNoticias((prev) => prev.filter((n) => n._id !== id));
            } catch (error) {
              console.error("Error al eliminar la noticia:", error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text numberOfLines={3} style={styles.content}>
        {item.contenido}
      </Text>
      <Text style={styles.estado}>{item.estado}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditarNoticia", { id: item._id })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => eliminarNoticia(item._id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <Text style={styles.titleScreen}>📰 Mis Noticias</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {noticias.length > 0 ? (
          <FlatList
            data={noticias}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.empty}>Aún no has creado ninguna noticia.</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#8B0000",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  titleScreen: {
    marginTop:20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    marginVertical: 8,
    color: "#555",
  },
  estado: {
    fontStyle: "italic",
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#facc15",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
