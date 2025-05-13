import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

interface ImageSliderProps {
  images: string[];
  onImagePress: (imageUrl: string) => void;
}

const { width: windowWidth } = Dimensions.get("window");
const IMAGE_WIDTH = windowWidth;
const SIDE_SPACING = 0;

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onImagePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  const openZoomModal = (index: number) => {
    setActiveIndex(index);
    setModalVisible(true);
    onImagePress(images[index]);
  };

  const imageUrls = images.map((url) => ({ url }));

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={IMAGE_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: SIDE_SPACING }}
      >
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => openZoomModal(index)}
            style={[
              styles.imageWrapper,
              {
                transform: [{ scale: activeIndex === index ? 1 : 0.95 }],
                opacity: activeIndex === index ? 1 : 0.7,
              },
            ]}
          >
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {activeIndex + 1} / {images.length}
        </Text>
      </View>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Modal con zoom */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={activeIndex}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          onCancel={() => setModalVisible(false)}
          onClick={() => setModalVisible(false)} // 👈 Cierra al tocar fuera de la imagen
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    marginTop: 10,
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: 250,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  counterContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },
  counterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pagination: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
  },
  inactiveDot: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: 8,
    height: 8,
  },
});

export default ImageSlider;
