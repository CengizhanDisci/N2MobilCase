import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";

const Profile: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>
      {userProfile && (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: `https://robohash.org/${userProfile.id}.png` }}
            style={styles.profileImage}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.profileText}>İsim: {userProfile.name}</Text>
            <Text style={styles.profileText}>
              Kullanıcı Adı: {userProfile.username}
            </Text>
            <Text style={styles.profileText}>Email: {userProfile.email}</Text>
            <Text style={styles.profileText}>Telefon: {userProfile.phone}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    alignItems: "center",
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Roboto-Regular",
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
});

export default Profile;
