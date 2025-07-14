import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { RootStackParamList } from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  const { login, loading: authLoading } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!email.trim()) {
      return "Vui lòng nhập email";
    }

    if (!validateEmail(email)) {
      return "Email không hợp lệ";
    }

    if (!password.trim()) {
      return "Vui lòng nhập mật khẩu";
    }

    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({
        type: "error",
        text1: "Thông tin không hợp lệ",
        text2: validationError,
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await login(
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        },
        navigation
      );

      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công!",
        text2: "Chào mừng bạn trở lại",
        position: "top",
        autoHide: true,
        visibilityTime: 2000,
      });
    } catch (error: any) {
      let errorMessage = "Vui lòng kiểm tra lại thông tin đăng nhập";

      if (error.message) {
        if (error.message.includes("email")) {
          errorMessage = "Email không tồn tại trong hệ thống";
        } else if (
          error.message.includes("password") ||
          error.message.includes("mật khẩu")
        ) {
          errorMessage = "Mật khẩu không chính xác";
        } else if (
          error.message.includes("verify") ||
          error.message.includes("xác minh")
        ) {
          errorMessage =
            "Tài khoản chưa được xác minh. Vui lòng kiểm tra email";
        } else if (
          error.message.includes("network") ||
          error.message.includes("timeout")
        ) {
          errorMessage = "Lỗi kết nối mạng. Vui lòng thử lại";
        } else {
          errorMessage = error.message;
        }
      }

      Toast.show({
        type: "error",
        text1: "Đăng nhập thất bại!",
        text2: errorMessage,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || authLoading;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.appTitle}>HIV Healthcare</Text>
        <Text style={styles.title}>Đăng Nhập</Text>

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
              autoCorrect={false}
              editable={!isLoading}
            />
            <Icon
              name="mail"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.inputIcon}
              disabled={isLoading}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.rememberMe} disabled={isLoading}>
            <Text style={styles.optionText}>Ghi nhớ đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.submitButtonText}>Đang đăng nhập...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Đăng Nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerLinkContainer}>
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register" as never)}
            disabled={isLoading}
          >
            <View style={styles.registerLink}>
              <Text style={styles.registerLinkText}>Đăng ký ngay</Text>
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
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0D9488",
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#374151",
  },
  inputIcon: {
    marginLeft: 8,
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "500",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  registerLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerLinkText: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "600",
    marginRight: 4,
  },
  // Development styles
  devContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  devTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 8,
    textAlign: "center",
  },
  devButton: {
    backgroundColor: "#F59E0B",
    padding: 8,
    borderRadius: 4,
    marginVertical: 2,
  },
  devButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default Login;
