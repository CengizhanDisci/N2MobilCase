import { makeAutoObservable, action, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

class FavoriteStore {
  favorites: { [userId: number]: User[] } = {}; // Her kullanıcı için favori listesi

  constructor() {
    makeAutoObservable(this, {
      addFavorite: action,
      removeFavorite: action,
      clearFavorites: action,
      loadFavorites: action,
      saveFavorites: action,
    });
    this.loadFavorites();
  }

  addFavorite(user: User, userId: number) {
    if (!this.favorites[userId]) {
      this.favorites[userId] = [];
    }
    if (!this.favorites[userId].some((fav) => fav.id === user.id)) {
      runInAction(() => {
        this.favorites[userId].push(user);
        this.saveFavorites();
      });
    }
  }

  removeFavorite(user: User, userId: number) {
    if (this.favorites[userId]) {
      runInAction(() => {
        this.favorites[userId] = this.favorites[userId].filter(
          (favorite) => favorite.id !== user.id
        );
        this.saveFavorites();
      });
    }
  }

  clearFavorites(userId: number) {
    if (this.favorites[userId]) {
      runInAction(() => {
        this.favorites[userId] = [];
        this.saveFavorites();
      });
    }
  }

  async loadFavorites() {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      runInAction(() => {
        this.favorites = JSON.parse(favorites);
      });
    }
  }

  async saveFavorites() {
    await AsyncStorage.setItem("favorites", JSON.stringify(this.favorites));
  }
}

export default new FavoriteStore();
