import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

// Navigation types
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Screen dimensions
const { width } = Dimensions.get("window");

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = () => {
    // TODO: Thêm logic xử lý gửi yêu cầu đặt lại mật khẩu (ví dụ: gọi API)
    if (email) {
      Toast.show({
        type: "success",
        text1: "Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      navigation.navigate("Login");
    } else {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập email!",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Quên Mật Khẩu</Text>
          <Text style={styles.description}>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn..."
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Icon name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
          </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
            </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Đã nhớ mật khẩu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <View style={styles.loginLink}>
                <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
                <Icon name="arrow-right" size={16} color="#0D9488" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#374151",
  },
  inputIcon: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 12,
    color: "#6B7280",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 12,
    color: "#0D9488",
    fontWeight: "500",
    marginRight: 4,
  },
});

export default ForgotPassword;