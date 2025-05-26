import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Text,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "../api/axios";

const PostActions = ({
  onCommentsPress,
  noticiaId,
  confirmadoPorUsuario,
  totalConfirmaciones,
  totalComentarios,
}) => {
  const [confirmado, setConfirmado] = useState(confirmadoPorUsuario);
  const [confirmacionesCount, setConfirmacionesCount] = useState(totalConfirmaciones);
  const [comentariosCount] = useState(totalComentarios);

  const handleConfirmacion = async () => {
    try {
      const response = await axios.patch(`/noticias/${noticiaId}/confirmar`);
      const {
        confirmado: nuevoConfirmado,
        totalConfirmaciones: nuevasConfirmaciones,
      } = response.data;

      setConfirmado(nuevoConfirmado);
      setConfirmacionesCount(nuevasConfirmaciones);

      Alert.alert(
        nuevoConfirmado ? "Noticia confirmada" : "Confirmación retirada",
        nuevoConfirmado
          ? "Has confirmado que esta noticia es cierta."
          : "Has retirado tu confirmación de esta noticia."
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo confirmar la noticia.");
    }
  };

  const compartirNoticia = async () => {
    const url = `http://localhost:5173/noticias/${noticiaId}`;
    const message = `¡Mira esta noticia de la Carretera Central! ${url}`;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  return (
    <View style={styles.actions}>
      <TouchableOpacity onPress={handleConfirmacion} style={styles.actionItem}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={confirmado ? "check-circle" : "check-circle-outline"}
            size={34}
            color={confirmado ? "#8B0000" : "#999"}
          />
        </View>
        <Text style={styles.counterText}>{confirmacionesCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onCommentsPress} style={styles.actionItem}>
        <View style={styles.iconCircleSmall}>
          <MaterialCommunityIcons name="comment-outline" size={28} color="#8B0000" />
        </View>
        <Text style={styles.counterText}>{comentariosCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={compartirNoticia} style={styles.actionItem}>
        <View style={styles.iconCircleSmall}>
          <MaterialCommunityIcons name="share-variant" size={26} color="#8B0000" />
        </View>
        <Text style={styles.counterText}>{"\u00A0"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    paddingTop: 20,
    borderColor: "#eee",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  actionItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  counterText: {
    fontSize: 12,
    color: "#8B0000",
    marginTop: 2,
  },
});

export default PostActions;
