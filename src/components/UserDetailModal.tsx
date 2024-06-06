import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { UserWithUniqueId } from "../types"; // UserWithUniqueId tipini buradan alıyoruz
import Ionicons from "react-native-vector-icons/Ionicons";

interface UserDetailModalProps {
  user: UserWithUniqueId | null;
  visible: boolean;
  onClose: () => void;
  onFavoriteToggle: (user: UserWithUniqueId) => void;
  isFavorite: boolean;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  visible,
  onClose,
  onFavoriteToggle,
  isFavorite,
}) => {
  if (!user) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.userName}>{user.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.userDetail}>{user.username}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={24} color="black" />
            <Text
              style={styles.userDetail}
            >{`${user.address.street}, ${user.address.suite}, ${user.address.city}`}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={24} color="black" />
            <Text style={styles.userDetail}>{user.company.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="globe-outline" size={24} color="black" />
            <Text style={styles.userDetail}>{user.website}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onFavoriteToggle(user)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="#fff"
            />
            <Text style={styles.favoriteButtonText}>
              {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userDetail: {
    fontSize: 18,
    marginLeft: 10,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginTop: 20,
  },
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default UserDetailModal;
