import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { observer } from "mobx-react-lite";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserWithUniqueId } from "../types";
import UserDetailModal from "../components/UserDetailModal";
import favoriteStore from "../stores/favoriteStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserList = observer(() => {
  const [users, setUsers] = useState<UserWithUniqueId[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithUniqueId[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A">("A-Z");
  const [selectedUser, setSelectedUser] = useState<UserWithUniqueId | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await AsyncStorage.getItem("loggedInUser");
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
    };

    fetchLoggedInUser();
    loadUsers();
  }, []);

  useEffect(() => {
    applySorting();
  }, [search, users, sortOption]);

  const loadUsers = () => {
    if (!hasMore) return;
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=10`)
      .then((response) => {
        const newUsers = response.data.map((user: UserWithUniqueId) => ({
          ...user,
          uniqueId: `${user.id}-${page}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }));
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setHasMore(newUsers.length > 0);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const applySorting = () => {
    let updatedUsers = [...users];

    if (search.trim() !== "") {
      updatedUsers = updatedUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    updatedUsers.sort((a, b) => {
      if (sortOption === "A-Z") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredUsers(updatedUsers);
  };

  const handleAddFavorite = (user: UserWithUniqueId) => {
    if (loggedInUser) {
      favoriteStore.addFavorite(user, loggedInUser.id);
    }
  };

  const handleRemoveFavorite = (user: UserWithUniqueId) => {
    if (loggedInUser) {
      favoriteStore.removeFavorite(user, loggedInUser.id);
    }
  };

  const isFavorite = (id: number) => {
    if (loggedInUser) {
      return favoriteStore.favorites[loggedInUser.id]?.some(
        (fav) => fav.id === id
      );
    }
    return false;
  };

  const renderItem = ({ item }: { item: UserWithUniqueId }) => {
    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userPhone}>{item.phone}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedUser(item);
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={30} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadUsers();
    }
  };

  const handleSort = () => {
    setSortOption((prevSortOption) =>
      prevSortOption === "A-Z" ? "Z-A" : "A-Z"
    );
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
          placeholder="Kullanıcı ara"
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
        data={filteredUsers}
        keyExtractor={(item: UserWithUniqueId) => item.uniqueId}
        renderItem={renderItem}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onFavoriteToggle={
            isFavorite(selectedUser.id)
              ? handleRemoveFavorite
              : handleAddFavorite
          }
          isFavorite={isFavorite(selectedUser.id)}
        />
      )}
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
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginVertical: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
  userEmail: {
    fontSize: 14,
    color: "grey",
    fontFamily: "Roboto-Regular",
  },
  userPhone: {
    fontSize: 14,
    color: "grey",
    fontFamily: "Roboto-Regular",
  },
  userUsername: {
    fontSize: 14,
    color: "grey",
    fontFamily: "Roboto-Regular",
  },
});

export default UserList;
