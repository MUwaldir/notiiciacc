import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const PostContent = ({
  titulo,
  tipo,
  contenido,
  ubicacion,
  createdAt,
  isExpanded,
  onToggle,
}: {
  titulo: string;
  contenido: string;
  createdAt: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={2}>{titulo}</Text>
      {/* <Text style={styles.title} numberOfLines={2}>Tipo: {tipo}</Text> */}

      <Text style={styles.location} numberOfLines={2}>Ubicación: {ubicacion}</Text>
      <Text style={styles.date}>Publicado el {formatDate(createdAt)}</Text>

      <Text style={styles.content} numberOfLines={isExpanded ? undefined : 4}>
        {contenido}
      </Text>

      {contenido.length > 100 && (
        <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
          <Text style={styles.toggle}>{isExpanded ? "Ver menos" : "Ver más"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: "#fff",
    borderRadius: 8,

 
  
 
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  location: {
    color: "#777",
    fontSize: 14,
    marginBottom: 6,
  },
  date: {
    color: "#999",
    fontSize: 12,
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  toggle: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PostContent;
