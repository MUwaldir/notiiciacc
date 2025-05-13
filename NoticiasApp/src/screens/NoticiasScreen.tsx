import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import api from "../api/axios";
import ImageSlider from "../components/ImageSlider";
import AuthorInfo from "../components/AuthorInfo";
import PostContent from "../components/PostContent";
import PostActions from "../components/PostActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
const { width, height } = Dimensions.get("window");

const NoticiasScreen = ({ navigation }: any) => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState<number>(0);
  const [cargando, setCargando] = useState(false);

  const limit = 10; // Puedes ajustar el número de noticias por página

  const fetchNoticias = async (pageToLoad = 1, isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const userData = await AsyncStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      const res = await api.get(
        `/noticias?_page=${pageToLoad}${
          tipoFiltro !== "todos" ? `&tipo=${tipoFiltro}` : ""
        }`
      );

      const data = res.data.data;

      const noticiasConConfirmacion = data.map((noticia: any) => ({
        ...noticia,
        confirmaciones: noticia.confirmaciones || [],
        confirmadoPorUsuario: (noticia.confirmaciones || []).includes(user?.id),
      }));

      if (isRefreshing) {
        setNoticias(noticiasConConfirmacion);
      } else {
        setNoticias((prevNoticias) => [
          ...prevNoticias,
          ...noticiasConConfirmacion,
        ]);
      }

      setHasMore(noticiasConConfirmacion.length === limit);
      setError(null);
    } catch (err) {
      console.error("Error obteniendo las noticias", err);
      setError("Error obteniendo las noticias");
    } finally {
      setLoading(false);
      if (isRefreshing) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNoticias(page);
  }, [page, tipoFiltro]);

  // Filtrar noticias por tipo
  const filteredNoticias = noticias.filter((noticia) => {
    if (tipoFiltro === "todos") return true;
    return noticia.tipo === tipoFiltro;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchNoticias(1, true);
  };

  const loadMoreNoticias = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleToggleText = (id: string) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleCommentsNavigation = (noticiaId: string) => {
    navigation.navigate("Comentarios", { noticiaId });
  };

  const handleImagePress = (imageUrl: string, allImages: string[]) => {
    setModalImages(allImages);
    setModalIndex(allImages.indexOf(imageUrl));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading && noticias.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterChipsContainer}>
        {[
          { label: "Accidente", value: "accidente", icon: "🚑" },
          { label: "Todos", value: "todos", icon: "📰" },
          { label: "Bloqueo", value: "bloqueo", icon: "🚧" },
          { label: "Clima", value: "clima", icon: "🌤️" },
          { label: "Obras", value: "obras", icon: "🏗️" },
          { label: "Otro", value: "otro", icon: "❓" },
        ].map((filtro) => (
          <TouchableOpacity
            key={filtro.value}
            style={[
              styles.chip,
              tipoFiltro === filtro.value && styles.chipSelected,
            ]}
            onPress={() => setTipoFiltro(filtro.value)}
          >
            <Text
              style={[
                styles.chipText,
                tipoFiltro === filtro.value && styles.chipTextSelected,
              ]}
            >
              {filtro.icon} {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredNoticias}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={loadMoreNoticias}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          const isTextExpanded = expandedPostId === item._id;

          return (
            <View style={styles.card}>
              <AuthorInfo
                nombre={item.autor?.nombre}
                avatar={item.autor?.imagen}
              />
              <PostContent
                titulo={item.titulo}
                tipo={item.tipo}
                contenido={item.contenido}
                ubicacion={item.ubicacion}
                createdAt={item.createdAt}
                isExpanded={isTextExpanded}
                onToggle={() => handleToggleText(item._id)}
              />
              {item.imagenes && item.imagenes.length > 0 && (
                <ImageSlider
                  images={item.imagenes}
                  onImagePress={(img) => handleImagePress(img, item.imagenes)}
                />
              )}
              <PostActions
                noticiaId={item._id}
                confirmadoPorUsuario={item.confirmadoPorUsuario}
                totalConfirmaciones={item.confirmaciones.length}
                onCommentsPress={() => handleCommentsNavigation(item._id)}
              />
            </View>
          );
        }}
        ListFooterComponent={() =>
          loading && noticias.length > 0 ? (
            <ActivityIndicator
              size="small"
              color="#007bff"
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
      />

      {/* Modal para mostrar la imagen */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <FlatList
            horizontal
            pagingEnabled
            data={modalImages}
            initialScrollIndex={modalIndex}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={closeModal}>
                <Image source={{ uri: item }} style={styles.fullScreenImage} />
              </TouchableWithoutFeedback>
            )}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  picker: {
    width: "100%",
    height: 40,
    backgroundColor: "#f0f0f0",
  },
  list: {
    padding: 12,
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullScreenImage: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  chipSelected: {
    backgroundColor: "#000",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default NoticiasScreen;
