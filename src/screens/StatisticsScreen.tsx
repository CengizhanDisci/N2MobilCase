import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";

const StatisticsScreen: React.FC = () => {
  const [albums, setAlbums] = useState<{ id: number; title: string }[]>([]);
  const [tasks, setTasks] = useState<
    { id: number; title: string; completed: boolean }[]
  >([]);
  const [completedTasks, setCompletedTasks] = useState<number>(0);
  const [pendingTasks, setPendingTasks] = useState<number>(0);
  const navigation = useNavigation();

  useEffect(() => {
    // Albümleri ve görevleri almak için API çağrısı
    const fetchAlbums = async () => {
      const albumResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/albums"
      );
      setAlbums(albumResponse.data);
    };

    const fetchTasks = async () => {
      const taskResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTasks(taskResponse.data);

      let completedCount = 0;
      let pendingCount = 0;

      taskResponse.data.forEach((task: { completed: boolean }) => {
        if (task.completed) {
          completedCount++;
        } else {
          pendingCount++;
        }
      });

      setCompletedTasks(completedCount);
      setPendingTasks(pendingCount);
    };

    fetchAlbums();
    fetchTasks();
  }, []);

  // Grafik verileri
  const chartData = [
    {
      name: "Yapılacak Görevler",
      population: pendingTasks,
      color: "#a64ac9",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Yapılan Görevler",
      population: completedTasks,
      color: "#540d6e",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Görev İstatistikleri</Text>
      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData}
          width={200}
          height={200}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => `rgba(0, 0, 0, 0)`, // Etiketleri gizler
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="60"
          hasLegend={false}
          absolute
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColorBox, { backgroundColor: "#a64ac9" }]}
            />
            <Text style={styles.legendText}>
              Yapılacak Görevler: {pendingTasks}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColorBox, { backgroundColor: "#540d6e" }]}
            />
            <Text style={styles.legendText}>
              Yapılan Görevler: {completedTasks}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.header}>Albüm İstatistikleri</Text>
      <Text style={styles.albumCount}>{albums.length} adet albüm bulundu.</Text>
      <FlatList
        data={albums.slice(0, 4)}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Albümler" as never)}
          >
            <Image
              source={{ uri: `https://via.placeholder.com/150/${item.id}` }}
              style={styles.photo}
            />
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
    color: "#333",
  },
  chartWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  albumCount: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "left",
    color: "#666",
  },
  photo: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
  },
});

export default StatisticsScreen;
