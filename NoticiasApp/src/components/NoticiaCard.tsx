import React from "react";
import { View, StyleSheet } from "react-native";
import AuthorInfo from "./AuthorInfo";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import ImageSlider from "./ImageSlider";

const NoticiaCard = ({
  item,
  isExpanded,
  onToggleText,
  onImagePress,
  onCommentsPress,
}: any) => (
  <View style={styles.card}>
    <AuthorInfo nombre={item.autor?.nombre} avatar={item.autor?.imagen} />
    <PostContent
      titulo={item.titulo}
      tipo={item.tipo}
      contenido={item.contenido}
      ubicacion={item.ubicacion}
      createdAt={item.createdAt}
      isExpanded={isExpanded}
      onToggle={() => onToggleText(item._id)}
    />
    {item.imagenes?.length > 0 && (
      <ImageSlider images={item.imagenes} onImagePress={(img) => onImagePress(img, item.imagenes)} />
    )}
    <PostActions
      noticiaId={item._id}
      confirmadoPorUsuario={item.confirmadoPorUsuario}
      totalConfirmaciones={item.confirmaciones.length}
      totalComentarios={item.totalComentarios}
      onCommentsPress={() => onCommentsPress(item._id)}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default NoticiaCard;
