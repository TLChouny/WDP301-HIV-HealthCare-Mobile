import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  VerifyOTP: { email: string; type?: "register" | "reset" };
  ResetPassword: { resetToken: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type VerifyOTPRouteProp = RouteProp<RootStackParamList, 'VerifyOTP'>;

const { width } = Dimensions.get("window");

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VerifyOTPRouteProp>();
  const { email, type = "register" } = route.params;

  const {
    verifyOTP,
    resendOTP,
    verifyResetOTP,
    loading: authLoading,
  } = useAuth();

  // Refs for input focusing
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits are filled
    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (otpArray?: string[]) => {
    const otpString = (otpArray || otp).join("");

    if (otpString.length !== 6) {
      Toast.show({
        type: "error",
        text1: "OTP không hợp lệ",
        text2: "Vui lòng nhập đầy đủ 6 chữ số",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);

      if (type === "reset") {
        // Verify OTP for password reset
        const response = await verifyResetOTP({
          email: email.toLowerCase(),
          otp: otpString,
        });

        Toast.show({
          type: "success",
          text1: "Xác minh thành công!",
          text2: "Tiếp tục đặt lại mật khẩu",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });

        // Navigate to reset password with token
        navigation.navigate("ResetPassword", {
          resetToken: response.resetToken,
        });
      } else {
        // Verify OTP for registration
        await verifyOTP({
          email: email.toLowerCase(),
          otp: otpString,
        });

        Toast.show({
          type: "success",
          text1: "Xác minh thành công!",
          text2: "Tài khoản đã được kích hoạt",
          position: "top",
          autoHide: true,
          visibilityTime: 2000,
        });

        // Navigate to login or dashboard based on auth state
        setTimeout(() => {
          navigation.navigate("Login");
        }, 1000);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "Vui lòng thử lại";

      if (error.message) {
        if (
          error.message.includes("invalid") ||
          error.message.includes("sai")
        ) {
          errorMessage = "Mã OTP không đúng";
        } else if (
          error.message.includes("expired") ||
          error.message.includes("hết hạn")
        ) {
          errorMessage = "Mã OTP đã hết hạn";
        } else if (
          error.message.includes("already verified") ||
          error.message.includes("đã xác minh")
        ) {
          errorMessage = "Tài khoản đã được xác minh";
        } else {
          errorMessage = error.message;
        }
      }

      Toast.show({
        type: "error",
        text1: "Xác minh thất bại!",
        text2: errorMessage,
        position: "top",
        autoHide: true,
        visibilityTime: 4000,
      });

      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);

      await resendOTP({ email: email.toLowerCase() });

      Toast.show({
        type: "success",
        text1: "Đã gửi lại mã OTP!",
        text2: "Vui lòng kiểm tra email",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });

      // Reset countdown
      setCountdown(60);
      setCanResend(false);

      // Clear current OTP
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gửi lại OTP thất bại!",
        text2: error.message || "Vui lòng thử lại",
        position: "top",
        autoHide: true,
        visibilityTime: 3000,
      });
    } finally {
      setResendLoading(false);
    }
  };



  const isLoading = loading || authLoading;
  const otpString = otp.join("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.iconContainer}>
            <Icon name="shield" size={32} color="#0D9488" />
          </View>
          <Text style={styles.title}>Xác Minh OTP</Text>
          <Text style={styles.subtitle}>
            {type === "reset"
              ? `Nhập mã xác minh đã gửi đến ${email} để đặt lại mật khẩu`
              : `Nhập mã xác minh đã gửi đến ${email} để kích hoạt tài khoản`}
          </Text>
        </View>

        {/* OTP Input Container */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>Mã xác minh (6 chữ số)</Text>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  isLoading && styles.otpInputDisabled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="numeric"
                textAlign="center"
                selectionColor="#0D9488"
                editable={!isLoading}
              />
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!otpString || otpString.length !== 6 || isLoading) &&
              styles.submitButtonDisabled,
          ]}
          onPress={() => handleSubmit()}
          disabled={!otpString || otpString.length !== 6 || isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.submitButtonText}>Đang xác minh...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Xác Minh</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.countdownText}>
              Gửi lại mã sau {countdown}s
            </Text>
          ) : (
            <TouchableOpacity
              style={[
                styles.resendButton,
                resendLoading && styles.resendButtonDisabled,
              ]}
              onPress={handleResendOTP}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator color="#0D9488" size="small" />
              ) : (
                <>
                  <Icon name="refresh-cw" size={16} color="#0D9488" />
                  <Text style={styles.resendButtonText}>Gửi lại mã</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Icon name="arrow-left" size={16} color="#0D9488" />
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Không nhận được mã? Kiểm tra thư mục spam hoặc thử gửi lại
          </Text>
        </View>

        {/* Development Helper */}
        {__DEV__ && (
          <View style={styles.devContainer}>
            <Text style={styles.devTitle}>Development Mode</Text>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => {
                const testOtp = ["1", "2", "3", "4", "5", "6"];
                setOtp(testOtp);
              }}
            >
              <Text style={styles.devButtonText}>Fill Test OTP (123456)</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingHorizontal: 8,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    fontSize: 24,
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "#F9FAFB",
  },
  otpInputFilled: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
    color: "#0D9488",
  },
  otpInputDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
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
  resendContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  helpContainer: {
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
  },
  devButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default VerifyOTP;
