import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";

type ResetPasswordRouteProp = RouteProp<RootStackParamList, "ResetPassword">;



// Navigation types
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { email: string; type?: "register" | "reset" };
  ResetPasswordOTP: { email: string };
  ResetPassword: { resetToken: string };
  UserDashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const route = useRoute<ResetPasswordRouteProp>();

  const navigation = useNavigation<NavigationProp>();
  const { resetToken } = route.params;

  const { resetPassword, loading: authLoading } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    const { newPassword, confirmPassword } = formData;

    if (!newPassword.trim()) {
      return "Vui lòng nhập mật khẩu mới";
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return passwordError;
    }

    if (!confirmPassword.trim()) {
      return "Vui lòng nhập xác nhận mật khẩu";
    }

    if (newPassword !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }

    return null;
  };

  const handleSubmit = async () => {
    // Validate form
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

      await resetPassword({
        resetToken,
        newPassword: formData.newPassword.trim(),
      });

      Toast.show({
        type: "success",
        text1: "Đặt lại mật khẩu thành công!",
        text2: "Bạn có thể đăng nhập với mật khẩu mới",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });

      // Navigate to login after success
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);

      let errorMessage = "Vui lòng thử lại";

      if (error.message) {
        if (
          error.message.includes("expired") ||
          error.message.includes("hết hạn")
        ) {
          errorMessage =
            "Mã xác thực đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới";
        } else if (
          error.message.includes("invalid") ||
          error.message.includes("không hợp lệ")
        ) {
          errorMessage = "Mã xác thực không hợp lệ";
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
        text1: "Đặt lại mật khẩu thất bại!",
        text2: errorMessage,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });

      // If token expired, navigate back to forgot password
      if (error.message && error.message.includes("expired")) {
        setTimeout(() => {
          navigation.navigate("ForgotPassword");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string; width: string } => {
    if (password.length === 0) {
      return { strength: "", color: "#E5E7EB", width: "0%" };
    }

    let score = 0;
    if (password.length >= 6) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    switch (score) {
      case 1:
      case 2:
        return { strength: "Yếu", color: "#EF4444", width: "25%" };
      case 3:
        return { strength: "Trung bình", color: "#F59E0B", width: "50%" };
      case 4:
        return { strength: "Mạnh", color: "#10B981", width: "75%" };
      case 5:
        return { strength: "Rất mạnh", color: "#059669", width: "100%" };
      default:
        return { strength: "Yếu", color: "#EF4444", width: "25%" };
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const isLoading = loading || authLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <Icon name="key" size={32} color="#0D9488" />
            </View>
            <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
            <Text style={styles.subtitle}>
              Tạo mật khẩu mới cho tài khoản của bạn
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu mới *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới..."
                placeholderTextColor="#9CA3AF"
                value={formData.newPassword}
                onChangeText={(value) => updateFormData("newPassword", value)}
                secureTextEntry={!showNewPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.inputIcon}
                disabled={isLoading}
              >
                <Icon
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {formData.newPassword.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View
                    style={[
                      styles.passwordStrengthFill,
                      {
                        width: passwordStrength.width as `${number}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.passwordStrengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.strength}
                </Text>
              </View>
            )}

            <Text style={styles.passwordHint}>
              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và
              số
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Xác nhận mật khẩu *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới..."
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  updateFormData("confirmPassword", value)
                }
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

            {/* Password Match Indicator */}
            {formData.confirmPassword.length > 0 && (
              <View style={styles.passwordMatchContainer}>
                {formData.newPassword === formData.confirmPassword ? (
                  <View style={styles.passwordMatchSuccess}>
                    <Icon name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.passwordMatchSuccessText}>
                      Mật khẩu khớp
                    </Text>
                  </View>
                ) : (
                  <View style={styles.passwordMatchError}>
                    <Icon name="x-circle" size={16} color="#EF4444" />
                    <Text style={styles.passwordMatchErrorText}>
                      Mật khẩu không khớp
                    </Text>
                  </View>
                )}
              </View>
            )}
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
                <Text style={styles.submitButtonText}>Đang cập nhật...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Đặt Lại Mật Khẩu</Text>
            )}
          </TouchableOpacity>

          {/* Security Tips */}
          <View style={styles.securityTipsContainer}>
            <Text style={styles.securityTipsTitle}>💡 Mẹo bảo mật:</Text>
            <Text style={styles.securityTipText}>
              • Sử dụng mật khẩu duy nhất cho tài khoản này
            </Text>
            <Text style={styles.securityTipText}>
              • Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
            </Text>
            <Text style={styles.securityTipText}>
              • Không chia sẻ mật khẩu với người khác
            </Text>
            <Text style={styles.securityTipText}>
              • Đổi mật khẩu định kỳ để bảo mật tốt hơn
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Login")}
            disabled={isLoading}
          >
            <Icon name="arrow-left" size={16} color="#0D9488" />
            <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
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
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  passwordMatchContainer: {
    marginTop: 8,
  },
  passwordMatchSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  passwordMatchSuccessText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
  passwordMatchError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  passwordMatchErrorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
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
  securityTipsContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
  },
  securityTipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0C4A6E",
    marginBottom: 8,
  },
  securityTipText: {
    fontSize: 12,
    color: "#0369A1",
    lineHeight: 18,
    marginBottom: 4,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ResetPassword;
