import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types"; // Tipleri buradan alacağız
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleResetPassword = () => {
    // Şifre sıfırlama işlemini burada gerçekleştirin
    setIsForgotPassword(false);
    setEmail("");
  };

  const handleLogin = async () => {
    // Giriş işlemi
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = response.data;
      const user = users.find(
        (user: any) => user.email === email && user.username === password
      );
      if (user) {
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));
        navigation.replace("Main");
      } else {
        alert("Kullanıcı adı veya şifre yanlış");
      }
    } catch (error) {
      console.error(error);
      alert("Giriş başarısız");
    }
  };

  return (
    <View style={styles.container}>
      {isForgotPassword ? (
        <>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <TextInput
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <Button
            title="Sıfırlama Linki Gönder"
            onPress={handleResetPassword}
          />
          <Text
            style={styles.backToLogin}
            onPress={() => setIsForgotPassword(false)}
          >
            Giriş Ekranına Dön
          </Text>
        </>
      ) : (
        <>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/N2MobilLogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>CRM'e Hoş Geldiniz</Text>
          </View>
          <TextInput
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Parola"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Giriş Yap" onPress={handleLogin} />
          <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
            Şifremi Unuttum
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    fontFamily: "Roboto-Regular",
  },
  forgotPassword: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
  backToLogin: {
    color: "blue",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
