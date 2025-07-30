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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { Clipboard } from 'react-native';

// Navigation types
type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  VerifyResetOTP: { email: string };
  ResetPassword: { resetToken: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type VerifyResetOTPRouteProp = RouteProp<RootStackParamList, "VerifyResetOTP">;

const VerifyResetOTP: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigation = useNavigation<NavigationProp>();
    const route = useRoute<VerifyResetOTPRouteProp>();
  
  const { email } = route.params;

  const { verifyResetOTP, forgotPassword, loading: authLoading } = useAuth();

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

      // Resend forgot password email
      await forgotPassword({ email: email.toLowerCase() });

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

  const handlePaste = (text: string) => {
    // Handle paste event for OTP
    const numbers = text.replace(/\D/g, "").slice(0, 6);
    if (numbers.length === 6) {
      const newOtp = numbers.split("");
      setOtp(newOtp);
      // Auto submit on paste
      handleSubmit(newOtp);
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
            <Icon name="lock" size={32} color="#DC2626" />
          </View>
          <Text style={styles.title}>Xác Minh Đặt Lại Mật Khẩu</Text>
          <Text style={styles.subtitle}>
            Nhập mã xác minh đã gửi đến{" "}
            <Text style={styles.emailText}>{email}</Text> để đặt lại mật khẩu
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
                onChangeText={(value) => {
  if (index === 0 && value.length === 6 && /^\d{6}$/.test(value)) {
    const digits = value.split('');
    setOtp(digits);
    inputRefs.current[5]?.focus(); // optional
  } else {
    handleOtpChange(value, index);
  }
}}

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
            <Text style={styles.submitButtonText}>Xác Minh & Tiếp Tục</Text>
          )}
        </TouchableOpacity>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          {!canResend ? (
            <Text style={styles.countdownText}>
              Gửi lại mã sau{" "}
              <Text style={styles.countdownNumber}>{countdown}s</Text>
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
                <ActivityIndicator color="#DC2626" size="small" />
              ) : (
                <>
                  <Icon name="refresh-cw" size={16} color="#DC2626" />
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
          <Icon name="arrow-left" size={16} color="#DC2626" />
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
    backgroundColor: "#FEF2F2",
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
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF2F2",
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
  emailText: {
    fontWeight: "600",
    color: "#DC2626",
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
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
    color: "#DC2626",
  },
  otpInputDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  },
  submitButton: {
    backgroundColor: "#DC2626",
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
  countdownNumber: {
    fontWeight: "700",
    color: "#DC2626",
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
    color: "#DC2626",
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
    color: "#DC2626",
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

export default VerifyResetOTP;
