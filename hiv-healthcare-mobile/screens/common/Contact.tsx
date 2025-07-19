import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../components/Navigation";

const { width, height } = Dimensions.get("window");

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Contact'>>();
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.email.includes('@')) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      Alert.alert(
        "Thành công", 
        "Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!",
        [
          {
            text: "OK",
            onPress: () => {
              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
              });
            }
          }
        ]
      );
      setIsSubmitting(false);
    }, 2000);
  };

  const handleCall = () => {
    const phoneNumber = "1900-1234";
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể thực hiện cuộc gọi");
      }
    });
  };

  const handleEmail = () => {
    const email = "contact@hivcare.com";
    const url = `mailto:${email}?subject=Liên hệ từ ứng dụng HIV Care`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở ứng dụng email");
      }
    });
  };

  const handleMap = () => {
    const address = "123 Đường ABC, Quận 1, TP.HCM";
    const url = Platform.OS === 'ios' 
      ? `http://maps.apple.com/?q=${encodeURIComponent(address)}`
      : `geo:0,0?q=${encodeURIComponent(address)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở ứng dụng bản đồ");
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Liên hệ</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          
          <View style={styles.contactCards}>
            {/* Phone Card */}
            <TouchableOpacity style={styles.contactCard} onPress={handleCall} activeOpacity={0.7}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call" size={24} color="#0D9488" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Điện thoại</Text>
                <Text style={styles.contactValue}>1900-1234</Text>
                <Text style={styles.contactSubtext}>Hỗ trợ 24/7</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Email Card */}
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail} activeOpacity={0.7}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="mail" size={24} color="#0D9488" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>contact@hivcare.com</Text>
                <Text style={styles.contactSubtext}>Phản hồi nhanh</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Address Card */}
            <TouchableOpacity style={styles.contactCard} onPress={handleMap} activeOpacity={0.7}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="location" size={24} color="#0D9488" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Địa chỉ</Text>
                <Text style={styles.contactValue}>123 Đường ABC, Quận 1</Text>
                <Text style={styles.contactSubtext}>TP.HCM, Việt Nam</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Working Hours Card */}
            <View style={styles.contactCard}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="time" size={24} color="#0D9488" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Giờ làm việc</Text>
                <Text style={styles.contactValue}>Thứ 2 - Thứ 6: 8:00 - 17:00</Text>
                <Text style={styles.contactSubtext}>Thứ 7: 8:00 - 12:00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gửi tin nhắn</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Họ và tên *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Nhập họ và tên của bạn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Nhập email của bạn"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Nhập số điện thoại (tùy chọn)"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tiêu đề *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholder="Nhập tiêu đề tin nhắn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nội dung *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                placeholder="Nhập nội dung tin nhắn của bạn"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>Đang gửi...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Gửi tin nhắn</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
          
          <View style={styles.faqContainer}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Làm thế nào để đặt lịch khám?</Text>
              <Text style={styles.faqAnswer}>
                Bạn có thể đặt lịch khám thông qua ứng dụng hoặc gọi điện thoại đến số 1900-1234 để được hỗ trợ.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Chi phí khám và điều trị như thế nào?</Text>
              <Text style={styles.faqAnswer}>
                Chi phí khám và điều trị HIV được hỗ trợ bởi BHYT. Vui lòng liên hệ để được tư vấn chi tiết.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Có dịch vụ tư vấn online không?</Text>
              <Text style={styles.faqAnswer}>
                Có, chúng tôi cung cấp dịch vụ tư vấn online qua video call. Bạn có thể đặt lịch trong phần "Đặt lịch khám".
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 HIV Care. Tất cả quyền được bảo lưu.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#0F766E",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 20,
  },
  contactCards: {
    gap: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  contactSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: "#0D9488",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default ContactPage; 