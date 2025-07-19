import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../components/Navigation";

const { width } = Dimensions.get("window");

const AboutPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'About'>>();

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
          <Text style={styles.headerTitle}>Giới thiệu</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* About Content */}
        <View style={styles.section}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>HC</Text>
            </View>
            <Text style={styles.appName}>HIV Care</Text>
            <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Về chúng tôi</Text>
            <Text style={styles.contentText}>
              HIV Care là ứng dụng di động được phát triển để hỗ trợ việc quản lý và chăm sóc sức khỏe cho người nhiễm HIV/AIDS. 
              Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe chất lượng cao với sự bảo mật và tôn trọng quyền riêng tư của người bệnh.
            </Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Sứ mệnh</Text>
            <Text style={styles.contentText}>
              Cung cấp giải pháp toàn diện cho việc quản lý sức khỏe HIV/AIDS, 
              giúp người bệnh tiếp cận dễ dàng các dịch vụ y tế chất lượng và 
              hỗ trợ tâm lý cần thiết để có cuộc sống khỏe mạnh.
            </Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Tầm nhìn</Text>
            <Text style={styles.contentText}>
              Trở thành ứng dụng hàng đầu trong lĩnh vực chăm sóc sức khỏe HIV/AIDS, 
              góp phần giảm thiểu sự kỳ thị và nâng cao chất lượng cuộc sống cho 
              cộng đồng người nhiễm HIV/AIDS tại Việt Nam.
            </Text>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Dịch vụ chính</Text>
            <View style={styles.serviceList}>
              <View style={styles.serviceItem}>
                <Ionicons name="calendar-outline" size={20} color="#0D9488" />
                <Text style={styles.serviceText}>Đặt lịch khám và tư vấn</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="document-text-outline" size={20} color="#0D9488" />
                <Text style={styles.serviceText}>Quản lý hồ sơ y tế</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="medkit-outline" size={20} color="#0D9488" />
                <Text style={styles.serviceText}>Theo dõi điều trị ARV</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="videocam-outline" size={20} color="#0D9488" />
                <Text style={styles.serviceText}>Tư vấn trực tuyến</Text>
              </View>
              <View style={styles.serviceItem}>
                <Ionicons name="notifications-outline" size={20} color="#0D9488" />
                <Text style={styles.serviceText}>Nhắc nhở lịch hẹn</Text>
              </View>
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={16} color="#6B7280" />
                <Text style={styles.contactText}>1900-1234</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={16} color="#6B7280" />
                <Text style={styles.contactText}>contact@hivcare.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.contactText}>123 Đường ABC, Quận 1, TP.HCM</Text>
              </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: "#6B7280",
  },
  contentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  serviceList: {
    gap: 12,
  },
  serviceItem: {
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
  serviceText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  contactInfo: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
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

export default AboutPage; 