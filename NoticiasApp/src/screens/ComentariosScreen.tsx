import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ComentariosScreen = ({ route }: any) => {
  const { noticiaId } = route.params;

  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/comentarios/${noticiaId}`);
        setComentarios(response.data);
      } catch (err) {
        setError("Error obteniendo los comentarios");
        console.error("Error obteniendo los comentarios", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComentarios();
  }, [noticiaId]);

  const handleComentarioSubmit = async () => {
    const userData = await AsyncStorage.getItem('user');
    const parsedUserData = userData ? JSON.parse(userData) : null;

    if (!nuevoComentario.trim()) return;

    try {
      await api.post("/comentarios", {
        noticia: noticiaId,
        contenido: nuevoComentario,
      });
      setComentarios((prev) => [
        {
          contenido: nuevoComentario,
          autor: { nombre: "Tú", imagen: parsedUserData.imagen },
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNuevoComentario("");
    } catch (err) {
      setError("Error al agregar el comentario");
      console.error("Error al agregar comentario", err);
    }
  };

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para agrupar comentarios por fecha
  const groupCommentsByDate = (comments: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    comments.forEach((comment) => {
      const commentDate = new Date(comment.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Formatear la fecha a 'Hoy', 'Ayer' o la fecha en formato 'dd MMM'
      let dateLabel = "";
      if (commentDate.toDateString() === today.toDateString()) {
        dateLabel = "Hoy";
      } else if (commentDate.toDateString() === yesterday.toDateString()) {
        dateLabel = "Ayer";
      } else {
        dateLabel = commentDate.toLocaleDateString("es-PE", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }

      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      grouped[dateLabel].push(comment);
    });

    return grouped;
  };

  const groupedComentarios = groupCommentsByDate(comentarios);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
      <View style={styles.header}>
        <Text style={styles.title}>Comentarios</Text>
      </View>

      <View style={styles.container}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <FlatList
          data={Object.keys(groupedComentarios)}
          keyExtractor={(item) => item}
          renderItem={({ item: dateLabel }) => (
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              {groupedComentarios[dateLabel].map((comment: any, index: number) => (
                <View key={comment._id || index} style={styles.commentCard}>
                  <View style={styles.avatarRow}>
                    <Image
                      source={
                        comment?.autor.imagen
                          ? { uri: comment.autor.imagen }
                          : require("../../assets/avatar-de-usuario.png")
                      }
                      style={styles.avatar}
                    />
                    <Text style={styles.commentUser}>
                      {comment.autor?.nombre || "Usuario"}
                    </Text>
                  </View>
                  <Text style={styles.commentContent}>{comment.contenido}</Text>
                  {comment.createdAt && (
                    <Text style={styles.commentDate}>
                      {formatDateTime(comment.createdAt)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              Sé el primero en dejar tu opinión sobre esta noticia 🗣️
            </Text>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
            style={styles.commentInput}
            placeholder="Escribe un comentario..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={handleComentarioSubmit}
            style={styles.submitButton}
          >
            <Text style={styles.submitText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#8B0000",
  },
  header: {
    backgroundColor: "#8B0000",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  dateSection: {
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 6,
  },
  commentsList: {
    paddingBottom: 80,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 20,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  commentCard: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#8B0000",
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default ComentariosScreen;
