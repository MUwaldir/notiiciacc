import React from "react";
import {
  Modal,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("screen");

interface FullScreenImageCarouselProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenImageCarousel: React.FC<FullScreenImageCarouselProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback onPress={onClose}>
              <Image source={{ uri: item }} style={styles.fullScreenImage} resizeMode="contain" />
            </TouchableWithoutFeedback>
          )}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenImage: {
    width,
    height,
  },
});

export default FullScreenImageCarousel;
