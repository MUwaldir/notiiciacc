import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Text,
  Animated,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "../api/axios";

const TOOLTIP_DURATION = 5000;

const PostActions = ({
  onCommentsPress,
  noticiaId,
  confirmadoPorUsuario,
  totalConfirmaciones,
  totalComentarios, // Añadimos esta prop para el número de comentarios
}) => {
  const [confirmado, setConfirmado] = useState(confirmadoPorUsuario);
  const [confirmacionesCount, setConfirmacionesCount] =
    useState(totalConfirmaciones);
  const [comentariosCount, setComentariosCount] = useState(totalComentarios); // Estado para comentarios
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!confirmado) {
      Animated.sequence([
        Animated.timing(tooltipOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(TOOLTIP_DURATION),
        Animated.timing(tooltipOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  const handleConfirmacion = async () => {
    try {
      const response = await axios.patch(`/noticias/${noticiaId}/confirmar`);
      const {
        confirmado: nuevoConfirmado,
        totalConfirmaciones: nuevasConfirmaciones,
      } = response.data;
      setConfirmado(nuevoConfirmado);
      setConfirmacionesCount(nuevasConfirmaciones);
    } catch (error) {
      Alert.alert("Error", "No se pudo confirmar la noticia");
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
      <View style={styles.confirmWrapper}>
        <Animated.View style={[styles.tooltip, { opacity: tooltipOpacity }]}>
          <Text style={styles.tooltipText}>
            Toca para confirmar que esta noticia es cierta
          </Text>
        </Animated.View>
        <TouchableOpacity
          onPress={handleConfirmacion}
          style={styles.actionItem}
        >
          {/* <Text style={styles.confirmLabel}>
            {confirmado ? "Confirmaste" : "Confirmar"}
          </Text> */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={confirmado ? "check-circle" : "check-circle-outline"}
              size={34}
              color={confirmado ? "#8B0000" : "#999"}
            />
          </View>

          <Text style={styles.counterText}>{confirmacionesCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de comentarios */}
      <TouchableOpacity onPress={onCommentsPress} style={styles.actionItem}>
        <View style={styles.iconCircleSmall}>
          <MaterialCommunityIcons
            name="comment-outline"
            size={28}
            color="#8B0000"
          />
        </View>
        {/* Aquí mostramos el número de comentarios */}
        <Text style={styles.counterText}>{comentariosCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={compartirNoticia} style={styles.actionItem}>
        <View style={styles.iconCircleSmall}>
          <MaterialCommunityIcons
            name="share-variant"
            size={26}
            color="#8B0000"
          />
        </View>
        <Text style={styles.counterText}>{"\u00A0"}</Text>
        {/* espacio en blanco */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    paddingTop:20,
    // paddingVertical: 12,
    // borderTopWidth: 1,
    borderColor: "#eee",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    // elevation: 3,
  },
  tooltip: {
    position: "absolute",
    bottom: 72,
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 2,
    maxWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
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
    shadowColor: "#8B0000", // Color más oscuro
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.6, // Aumentar la opacidad de la sombra
    shadowRadius: 10, // Hacer la sombra más difusa
    elevation: 8, // Mayor elevación para dar un mayor efecto de profundidad
  },
  iconCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B0000", // Mismo color para consistencia
    shadowOffset: { width: 0, height: 3 }, // Desplazamiento más pequeño
    shadowOpacity: 0.4, // Sombra un poco más suave
    shadowRadius: 6, // Menos difusa que el icono de confirmación
    elevation: 4, // Menor elevación
  },
  confirmLabel: {
    fontSize: 13,
    marginTop: 4,
    color: "#8B0000",
    fontWeight: "bold",
  },
  counterText: {
    fontSize: 12,
    color: "#8B0000",
    marginTop: 2,
  },
});

export default PostActions;
