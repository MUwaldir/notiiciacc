import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const AuthorInfo = ({ nombre, avatar }: { nombre: string; avatar?: string }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const avatarSource = avatar
    ? { uri: avatar }
    : require("../../assets/avatar-de-usuario.png");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={avatarSource} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={styles.name}>{nombre || "Desconocido"}</Text>

      {/* Modal imagen ampliada */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image source={avatarSource} style={styles.fullScreenAvatar} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenAvatar: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    resizeMode: "cover",
    borderWidth: 4,
    borderColor: "#fff",
  },
});

export default AuthorInfo;
