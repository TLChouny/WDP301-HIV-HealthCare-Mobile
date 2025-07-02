import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  VerifyOTP: { email: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const Register: React.FC = () => {
<<<<<<< Updated upstream
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Vui lòng điền đầy đủ thông tin!",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
=======
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { register, loading: authLoading } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ thường";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ hoa";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Mật khẩu phải chứa ít nhất 1 chữ số";
    }
    return null;
  };

  const validateForm = (): string | null => {
    const { userName, email, password, confirmPassword, phone_number } =
      formData;

    if (!userName.trim()) {
      return "Vui lòng nhập tên người dùng";
    }

    if (userName.trim().length < 2) {
      return "Tên người dùng phải có ít nhất 2 ký tự";
    }

    if (!email.trim()) {
      return "Vui lòng nhập email";
    }

    if (!validateEmail(email)) {
      return "Email không hợp lệ";
    }

    if (phone_number && !validatePhone(phone_number)) {
      return "Số điện thoại không hợp lệ";
    }

    if (!password.trim()) {
      return "Vui lòng nhập mật khẩu";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return passwordError;
    }

    if (!confirmPassword.trim()) {
      return "Vui lòng nhập xác nhận mật khẩu";
>>>>>>> Stashed changes
    }

    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }

<<<<<<< Updated upstream
    // TODO: Thêm logic xử lý đăng ký (ví dụ: gọi API)
    Toast.show({
      type: "success",
      text1: "Đăng ký thành công!",
      position: "top",
      autoHide: true,
      visibilityTime: 3000,
    });
    navigation.navigate("Login");
=======
    if (!acceptTerms) {
      return "Vui lòng đồng ý với điều khoản sử dụng";
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
        visibilityTime: 4000,
      });
      return;
    }

    try {
      setLoading(true);

      const registerData = {
        userName: formData.userName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        phone_number: formData.phone_number.trim() || undefined,
        role: "user",
      };

      await register(registerData);

      Toast.show({
        type: "success",
        text1: "Đăng ký thành công!",
        text2: "Vui lòng kiểm tra email để xác minh tài khoản.",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });

      navigation.navigate("VerifyOTP", {
        email: formData.email.trim().toLowerCase(),
      });
    } catch (error: any) {
      console.error("Register error:", error);

      let errorMessage = "Vui lòng thử lại sau";

      if (error.message) {
        if (
          error.message.includes("email") &&
          error.message.includes("exist")
        ) {
          errorMessage = "Email này đã được sử dụng";
        } else if (
          error.message.includes("username") &&
          error.message.includes("exist")
        ) {
          errorMessage = "Tên người dùng đã tồn tại";
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
        text1: "Đăng ký thất bại!",
        text2: errorMessage,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
>>>>>>> Stashed changes
  };

  const isLoading = loading || authLoading;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
<<<<<<< Updated upstream
        <Text style={styles.title}>Đăng Ký</Text>
        
=======
        <Text style={styles.appTitle}>HIV Healthcare</Text>
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
        <Text style={styles.subtitle}>
          Tạo tài khoản mới để sử dụng dịch vụ
        </Text>

>>>>>>> Stashed changes
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên người dùng *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên người dùng..."
              placeholderTextColor="#9CA3AF"
              value={formData.userName}
              onChangeText={(value) => updateFormData("userName", value)}
              autoCapitalize="words"
              editable={!isLoading}
            />
            <Icon
              name="user"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn..."
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
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
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại (tùy chọn)..."
              placeholderTextColor="#9CA3AF"
              value={formData.phone_number}
              onChangeText={(value) => updateFormData("phone_number", value)}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            <Icon
              name="phone"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu..."
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
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
          <Text style={styles.passwordHint}>
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Xác nhận mật khẩu *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu..."
              placeholderTextColor="#9CA3AF"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.inputIcon}
              disabled={isLoading}
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

<<<<<<< Updated upstream
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Đăng Ký</Text>
=======
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
          disabled={isLoading}
        >
          <View
            style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
          >
            {acceptTerms && <Icon name="check" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.checkboxText}>
            Tôi đồng ý với{" "}
            <Text style={styles.linkText}>Điều khoản sử dụng</Text> và{" "}
            <Text style={styles.linkText}>Chính sách bảo mật</Text>
          </Text>
>>>>>>> Stashed changes
        </TouchableOpacity>

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
              <Text style={styles.submitButtonText}>Đang đăng ký...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Đăng Ký</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
          >
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Đăng nhập ngay</Text>
              <Icon name="arrow-right" size={16} color="#0D9488" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    margin: 16,
    marginTop: 60,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
<<<<<<< Updated upstream
=======
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0D9488",
    textAlign: "center",
    marginBottom: 8,
  },
>>>>>>> Stashed changes
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
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
  passwordHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  linkText: {
    color: "#0D9488",
    fontWeight: "600",
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
<<<<<<< Updated upstream
=======
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
>>>>>>> Stashed changes
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "600",
    marginRight: 4,
  },
});

export default Register;
