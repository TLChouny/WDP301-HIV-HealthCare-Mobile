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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPasswordOTP: { email: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { forgotPassword, loading: authLoading } = useAuth();

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

      await forgotPassword({ email: email.trim().toLowerCase() });

      setEmailSent(true);

      Toast.show({
        type: "success",
        text1: "Đã gửi email khôi phục!",
        text2: "Vui lòng kiểm tra hộp thư email của bạn",
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });

      // Navigate to OTP verification screen after a short delay
      setTimeout(() => {
        navigation.navigate("VerifyResetOTP", {
          email: email.trim().toLowerCase(),
        });
      }, 2000);
    } catch (error: any) {
      console.error("Forgot password error:", error);

      let errorMessage = "Vui lòng thử lại sau";

      if (error.message) {
        if (
          error.message.includes("not found") ||
          error.message.includes("không tồn tại")
        ) {
          errorMessage = "Email này chưa được đăng ký trong hệ thống";
        } else if (
          error.message.includes("network") ||
          error.message.includes("timeout")
        ) {
          errorMessage = "Lỗi kết nối mạng. Vui lòng thử lại";
        } else if (
          error.message.includes("rate limit") ||
          error.message.includes("quá nhiều")
        ) {
          errorMessage =
            "Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi và thử lại sau";
        } else {
          errorMessage = error.message;
        }
      }

      Toast.show({
        type: "error",
        text1: "Gửi yêu cầu thất bại!",
        text2: errorMessage,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) return;

    try {
      setLoading(true);
      await forgotPassword({ email: email.trim().toLowerCase() });

      Toast.show({
        type: "success",
        text1: "Đã gửi lại email!",
        text2: "Vui lòng kiểm tra hộp thư của bạn",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gửi lại email thất bại!",
        text2: error.message || "Vui lòng thử lại",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || authLoading;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Icon name="lock" size={32} color="#0D9488" />
          </View>
          <Text style={styles.title}>Quên Mật Khẩu</Text>
          <Text style={styles.subtitle}>
            {emailSent
              ? `Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến ${email}`
              : "Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu"}
          </Text>
        </View>

        {!emailSent ? (
          <>
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
                  <Text style={styles.submitButtonText}>Đang gửi...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emailSentContainer}>
            <View style={styles.successIconContainer}>
              <Icon name="check-circle" size={64} color="#10B981" />
            </View>

            <Text style={styles.emailSentTitle}>Email đã được gửi!</Text>
            <Text style={styles.emailSentText}>
              Vui lòng kiểm tra hộp thư email và làm theo hướng dẫn để đặt lại
              mật khẩu.
            </Text>

            <View style={styles.emailSentActions}>
              <TouchableOpacity
                style={[
                  styles.resendButton,
                  isLoading && styles.resendButtonDisabled,
                ]}
                onPress={handleResendEmail}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#0D9488" size="small" />
                ) : (
                  <>
                    <Icon name="refresh-cw" size={16} color="#0D9488" />
                    <Text style={styles.resendButtonText}>Gửi lại email</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() =>
                  navigation.navigate("VerifyResetOTP", {
                    email: email.trim().toLowerCase(),
                  })
                }
              >
                <Text style={styles.continueButtonText}>Tiếp tục với OTP</Text>
                <Icon name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Icon name="arrow-left" size={16} color="#0D9488" />
          <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>

        {/* Help text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Không nhận được email? Kiểm tra thư mục spam hoặc{" "}
            <Text style={styles.helpLink}>liên hệ hỗ trợ</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
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
  emailSentContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  emailSentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 8,
    textAlign: "center",
  },
  emailSentText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  emailSentActions: {
    width: "100%",
    gap: 12,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0D9488",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  resendButtonDisabled: {
    borderColor: "#D1D5DB",
  },
  resendButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#0D9488",
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  helpContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  helpText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  helpLink: {
    color: "#0D9488",
    fontWeight: "600",
  },
});

export default ForgotPassword;
