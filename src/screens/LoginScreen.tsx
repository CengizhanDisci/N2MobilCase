import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
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
          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
          >
            <Text style={styles.buttonText}>Sıfırlama Linki Gönder</Text>
          </TouchableOpacity>
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
            <Text style={styles.title}>N2Mobil CRM'e Hoş Geldiniz</Text>
          </View>
          <TextInput
            placeholder="Kullanıcı Adı"
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    backgroundColor: "#fff", // White background
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333", // Dark text color
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#1E88E5",
    marginTop: 10,
    textAlign: "center",
  },
  backToLogin: {
    color: "#1E88E5",
    marginTop: 10,
    textAlign: "center",
  },
});

export default LoginScreen;
