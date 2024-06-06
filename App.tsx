import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from "./src/screens/LoginScreen";
import UserList from "./src/screens/UserList";
import PostList from "./src/screens/PostList";
import TaskList from "./src/screens/TaskList";
import Favorites from "./src/screens/Favorites";
import AlbumsList from "./src/screens/AlbumsList";
import CustomDrawer from "./src/components/CustomDrawer";
import Profile from "./src/screens/Profile";
import PhotoDetail from "./src/screens/PhotoDetail";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import { RootStackParamList } from "./src/types";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const loadFonts = () => {
  return Font.loadAsync({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  });
};

type MainDrawerNavigationProp = StackNavigationProp<RootStackParamList, "Main">;

const MainDrawer = () => {
  // Profil sayfasına yönlendiren header butonu
  const renderHeaderRightButton = (navigation: MainDrawerNavigationProp) => (
    <TouchableOpacity
      style={{ paddingRight: 20 }}
      onPress={() => navigation.navigate("Profile")}
    >
      <Ionicons name="person-circle-outline" size={30} color="black" />
    </TouchableOpacity>
  );

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="Kullanıcılar"
        component={UserList}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
      <Drawer.Screen
        name="Gönderiler"
        component={PostList}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
      <Drawer.Screen
        name="Görevler"
        component={TaskList}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
      <Drawer.Screen
        name="Albümler"
        component={AlbumsList}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
      <Drawer.Screen
        name="Favoriler"
        component={Favorites}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
      <Drawer.Screen
        name="İstatistikler"
        component={StatisticsScreen}
        options={({ navigation }) => ({
          headerRight: () =>
            renderHeaderRightButton(navigation as MainDrawerNavigationProp),
        })}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return <View />; // Boş bir görünüm döndür
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen name="PhotoDetail" component={PhotoDetail} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
