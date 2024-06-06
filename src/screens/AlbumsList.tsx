import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStackParamList, Photo } from "../types";

type AlbumsListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PhotoDetail"
>;

const AlbumsList: React.FC = () => {
  const [albums, setAlbums] = useState<{ id: number; title: string }[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation<AlbumsListNavigationProp>();

  useEffect(() => {
    // Albümleri ve fotoğrafları almak için API çağrısı
    const fetchAlbums = async () => {
      const albumResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/albums"
      );
      setAlbums(albumResponse.data);
      const photoResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/photos"
      );
      setPhotos(photoResponse.data);
    };

    fetchAlbums();
  }, []);

  // Arama kutusuna göre albümleri filtreleme
  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase())
  );

  // Albüm bileşeni
  const renderAlbum = ({ item }: { item: { id: number; title: string } }) => {
    const albumPhotos = photos.filter((p) => p.albumId === item.id);

    return (
      <View style={styles.albumContainer}>
        <Text style={styles.albumTitle}>{item.title}</Text>
        <FlatList
          data={albumPhotos}
          keyExtractor={(photo) => photo.id.toString()}
          horizontal
          renderItem={({ item: photoItem }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PhotoDetail", { photos: albumPhotos })
              }
            >
              <Image
                source={{ uri: photoItem.thumbnailUrl }}
                style={styles.photo}
              />
            </TouchableOpacity>
          )}
        />
      </View>
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
          placeholder="Albüm ara"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredAlbums}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlbum}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
  albumContainer: {
    marginBottom: 16,
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Roboto-Regular",
  },
  photo: {
    width: 150,
    height: 150,
    marginRight: 8,
  },
});

export default AlbumsList;
