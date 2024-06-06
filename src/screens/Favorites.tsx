import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { observer } from "mobx-react-lite";
import Ionicons from "react-native-vector-icons/Ionicons";
import favoriteStore from "../stores/favoriteStore";
import { UserWithUniqueId } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reaction } from "mobx";
import { useFocusEffect } from "@react-navigation/native";

const Favorites = observer(() => {
  const [filteredFavorites, setFilteredFavorites] = useState<
    UserWithUniqueId[]
  >([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A">("A-Z");
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
    };

    fetchLoggedInUser();
    const dispose = reaction(
      () => favoriteStore.favorites,
      () => applySorting()
    );
    return () => dispose();
  }, []);

  useFocusEffect(
    useCallback(() => {
      applySorting();
    }, [loggedInUser, search, sortOption])
  );

  const applySorting = () => {
    if (!loggedInUser) return;

    let updatedFavorites = [
      ...(favoriteStore.favorites[loggedInUser.id] || []),
    ].map((user) => ({
      ...user,
      uniqueId: `${user.id}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    if (search.trim() !== "") {
      updatedFavorites = updatedFavorites.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    updatedFavorites.sort((a, b) => {
      if (sortOption === "A-Z") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredFavorites(updatedFavorites);
  };

  const renderItem = ({ item }: { item: UserWithUniqueId }) => (
    <View style={styles.favoriteItem}>
      <Text style={styles.favoriteText}>{item.name}</Text>
      <Text style={styles.favoriteUsername}>{item.username}</Text>
      <Text style={styles.favoriteEmail}>{item.email}</Text>
      <Text style={styles.favoritePhone}>{item.phone}</Text>
    </View>
  );

  const handleSort = () => {
    setSortOption((prevSortOption) =>
      prevSortOption === "A-Z" ? "Z-A" : "A-Z"
    );
    applySorting();
  };

  const handleClearFavorites = () => {
    if (loggedInUser) {
      favoriteStore.clearFavorites(loggedInUser.id);
      applySorting(); // Favorileri temizledikten sonra listeyi güncelle
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Favori kullanıcı ara"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.filterSortContainer}>
        <TouchableOpacity
          style={[styles.filterSortButton, styles.leftButton]}
          onPress={handleSort}
        >
          <Ionicons name="swap-vertical-outline" size={24} color="black" />
          <Text style={styles.filterSortText}>Sırala ({sortOption})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterSortButton, styles.rightButton]}
          onPress={() => {}}
        >
          <Ionicons name="filter-outline" size={24} color="black" />
          <Text style={styles.filterSortText}>Filtrele</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item: UserWithUniqueId) => item.uniqueId}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearFavorites}
      >
        <Text style={styles.clearButtonText}>Favorileri Temizle</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontFamily: "Roboto-Regular",
  },
  filterSortContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  filterSortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "grey",
    borderWidth: 1,
  },
  leftButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRightWidth: 0,
  },
  rightButton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  filterSortText: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
  },
  favoriteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 5,
  },
  favoriteText: {
    fontSize: 18,
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  favoriteUsername: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  favoriteEmail: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  favoritePhone: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Roboto-Regular",
  },
  clearButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
});

export default Favorites;
