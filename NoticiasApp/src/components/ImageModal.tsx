import React from "react";
import { Modal, View, FlatList, Image, Dimensions, TouchableWithoutFeedback, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const ImageModal = ({ visible, images, index, onClose }: any) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <FlatList
        horizontal
        pagingEnabled
        data={images}
        initialScrollIndex={index}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={onClose}>
            <Image source={{ uri: item }} style={styles.fullScreenImage} />
          </TouchableWithoutFeedback>
        )}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "black",
  },
  fullScreenImage: {
    width,
    height: "100%",
    resizeMode: "contain",
  },
});

export default ImageModal;
