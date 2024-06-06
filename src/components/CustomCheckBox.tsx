import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface CustomCheckBoxProps {
  value: boolean;
  onValueChange: () => void;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  value,
  onValueChange,
}) => {
  return (
    // Kullanıcı checkbox'a tıkladığında onValueChange fonksiyonunu çağırır
    <TouchableOpacity onPress={onValueChange} style={styles.container}>
      {/* Checkbox görünümü, seçili olup olmadığına göre stil değiştirir */}
      <View style={[styles.checkbox, value && styles.checked]}>
        {/* Eğer checkbox seçiliyse, işaret ikonu gösterilir */}
        {value && <Ionicons name="checkmark" size={20} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007bff",
  },
});

export default CustomCheckBox;
