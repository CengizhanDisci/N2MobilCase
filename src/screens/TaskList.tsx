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
import { TaskWithUniqueId } from "../types";
import CustomCheckBox from "../components/CustomCheckBox";

const TaskList = observer(() => {
  const [tasks, setTasks] = useState<TaskWithUniqueId[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskWithUniqueId[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<"A-Z" | "Z-A">("A-Z");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applySorting();
  }, [search, tasks, sortOption]);

  // Görevleri yükleyen fonksiyon
  const loadTasks = () => {
    if (!hasMore) return;
    setLoading(true);
    axios
      .get(`https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`)
      .then((response) => {
        const newTasks = response.data.map((task: TaskWithUniqueId) => ({
          ...task,
          uniqueId: `${task.id}-${page}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        }));
        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
        setHasMore(newTasks.length > 0);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  // Görevleri filtreleyip sıralayan fonksiyon
  const applySorting = () => {
    let updatedTasks = [...tasks];

    if (search.trim() !== "") {
      updatedTasks = updatedTasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    updatedTasks.sort((a, b) => {
      if (sortOption === "A-Z") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setFilteredTasks(updatedTasks);
  };

  // Görevin tamamlanma durumunu değiştiren fonksiyon
  const toggleTaskCompleted = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Görev bileşeni
  const renderItem = ({ item }: { item: TaskWithUniqueId }) => (
    <View style={styles.taskItem}>
      <CustomCheckBox
        value={item.completed}
        onValueChange={() => toggleTaskCompleted(item.id)}
      />
      <Text style={[styles.taskTitle, item.completed && styles.taskCompleted]}>
        {item.title}
      </Text>
    </View>
  );

  // Daha fazla görev yükleyen fonksiyon
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadTasks();
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
          placeholder="Görev ara"
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
        data={filteredTasks}
        keyExtractor={(item: TaskWithUniqueId) => item.uniqueId}
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
  taskItem: {
    flexDirection: "row",
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
    marginVertical: 5,
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
    marginLeft: 10,
    fontFamily: "Roboto-Regular",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default TaskList;
