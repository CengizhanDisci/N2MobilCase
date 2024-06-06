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
import { PostWithUniqueId } from "../types";

const PostList = observer(() => {
  const [posts, setPosts] = useState<PostWithUniqueId[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostWithUniqueId[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A">("A-Z");
  const [expandedPosts, setExpandedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    applySorting();
  }, [search, posts, sortOption]);

  // Postları yükleyen fonksiyon
  const loadPosts = () => {
    if (!hasMore) return;
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
      .then((response) => {
        const newPosts = response.data.map((post: PostWithUniqueId) => ({
          ...post,
          uniqueId: `${post.id}-${page}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }));
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length > 0);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Postları filtreleyip sıralayan fonksiyon
  const applySorting = () => {
    let updatedPosts = [...posts];

    if (search.trim() !== "") {
      updatedPosts = updatedPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    updatedPosts.sort((a, b) => {
      if (sortOption === "A-Z") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setFilteredPosts(updatedPosts);
  };

  // Post bileşeni
  const renderItem = ({ item }: { item: PostWithUniqueId }) => {
    const isExpanded = expandedPosts[item.uniqueId];
    const textLimit = 100; // Character limit for the post body

    return (
      <View style={styles.postItem}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody}>
          {isExpanded ? item.body : item.body.substring(0, textLimit)}
          {item.body.length > textLimit && !isExpanded && '...'}
        </Text>
        {item.body.length > textLimit && (
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => {
              setExpandedPosts((prevState) => ({
                ...prevState,
                [item.uniqueId]: !isExpanded,
              }));
            }}
          >
            <Text style={styles.seeMoreText}>
              {isExpanded ? 'Daha Az' : 'Daha Fazla'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Daha fazla post yükleyen fonksiyon
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadPosts();
    }
  };

  // Sıralama seçeneğini değiştiren fonksiyon
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
          placeholder="Post ara"
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
        data={filteredPosts}
        keyExtractor={(item: PostWithUniqueId) => item.uniqueId}
        renderItem={renderItem}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
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
  postItem: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Roboto-Regular",
  },
  postBody: {
    fontSize: 14,
    color: "#666",
    marginVertical: 10,
    fontFamily: "Roboto-Regular",
  },
  seeMoreButton: {
    alignSelf: "flex-end",
  },
  seeMoreText: {
    color: "#007bff",
    fontWeight: "bold",
    fontFamily: "Roboto-Regular",
  },
});

export default PostList;
