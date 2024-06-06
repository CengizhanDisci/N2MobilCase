import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawer: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) {
        setUserProfile(JSON.parse(user));
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      {userProfile && (
        <View style={styles.profileSection}>
          <Image
            source={{ uri: `https://robohash.org/${userProfile.id}.png` }}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>İsim: {userProfile.name}</Text>
          <Text style={styles.profileName}>
            Kullanıcı Adı: {userProfile.username}
          </Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Kullanıcılar")}
      >
        <Ionicons name="people-outline" size={24} color="black" />
        <Text style={styles.itemText}>Kullanıcılar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Gönderiler")}
      >
        <Ionicons name="paper-plane-outline" size={24} color="black" />
        <Text style={styles.itemText}>Gönderiler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Görevler")}
      >
        <Ionicons name="checkmark-done-outline" size={24} color="black" />
        <Text style={styles.itemText}>Görevler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Albümler")}
      >
        <Ionicons name="albums-outline" size={24} color="black" />
        <Text style={styles.itemText}>Albümler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Favoriler")}
      >
        <Ionicons name="heart-outline" size={24} color="black" />
        <Text style={styles.itemText}>Favoriler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("İstatistikler")}
      >
        <Ionicons name="stats-chart-outline" size={24} color="black" />
        <Text style={styles.itemText}>İstatistikler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
  profileEmail: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Roboto-Regular",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
  },
});

export default CustomDrawer;
