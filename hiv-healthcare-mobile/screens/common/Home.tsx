import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Header from "../../components/Header";
import { User } from "../../types/User";
import { getAllUsers } from "../../api/userApi";
import { RootStackParamList } from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";

const images = {
  doctor: require("../../assets/doingubacsi.png"),
  doctor2: require("../../assets/doingubacsi2.png"),
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const MeetingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleAppointmentBooking = () => {
    onClose();
    navigation.navigate("AppointmentBooking", { serviceId: "1" });
  };

  const handleOnlineConsultation = () => {
    onClose();
    navigation.navigate("OnlineConsultation");
  };
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chọn loại tư vấn</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            style={styles.modalOption}
            onPress={handleAppointmentBooking}
          >
            <Ionicons name="calendar-outline" size={24} color="#0D9488" />
            <Text style={styles.modalOptionText}>Đặt lịch khám tại phòng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={handleOnlineConsultation}
          >
            <Ionicons name="videocam-outline" size={24} color="#0D9488" />
            <Text style={styles.modalOptionText}>Tư vấn trực tuyến</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

// Main Home component
const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  // Use auth context to determine if user is authenticated
  const { isAuthenticated } = useAuth();
  const showAuthButtons = !isAuthenticated;
  // Fetch doctors when Home is focused
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchDoctors = async (): Promise<void> => {
        try {
          const users = await getAllUsers();
          if (isActive) {
            setDoctors(users.filter((u: User) => u.role === "doctor"));
          }
        } catch (err) {
          if (isActive) setDoctors([]);
        }
      };
      fetchDoctors();
      return () => {
        isActive = false;
      };
    }, [])
  );
  // Removed scroll progress logic

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handlePhoneCall = () => {
    Alert.alert("Gọi điện", "Bạn có muốn gọi đến hotline: 1900-1234?", [
      { text: "Hủy", style: "cancel" },
      { text: "Gọi", onPress: () => console.log("Calling...") },
    ]);
  };

  const handleBookAppointment = () => {
    setShowMeetingModal(true);
  };

  return (
    <View style={styles.container}>
      <Header />
      {showAuthButtons && (
        <View style={styles.header}>
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View
          style={[
            styles.heroSection,
            !showAuthButtons && styles.heroSectionNoAuth,
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Tìm Bác Sĩ{"\n"}Chuyên Khoa HIV
              </Text>
              <Text style={styles.heroSubtitle}>
                Đội ngũ y bác sĩ chuyên khoa giàu kinh nghiệm, tận tâm và không
                kỳ thị
              </Text>
              {/* <TouchableOpacity
                style={styles.heroButton}
                onPress={handleBookAppointment}
              >
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                <Text style={styles.heroButtonText}>
                  Đặt lịch tư vấn trực tuyến
                </Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.heroImageContainer}>
              <View style={styles.heroImageWrapper}>
                <View style={styles.heroImageBackground} />
                <Image
                  source={images.doctor}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch Vụ Nổi Bật</Text>
          <View style={styles.servicesGrid}>
            {[
              {
                icon: "document-text-outline",
                title: "Tư Vấn Xét Nghiệm",
                description:
                  "Tư vấn trước và sau xét nghiệm HIV miễn phí, bảo mật và không kỳ thị",
              },
              {
                icon: "shield-outline",
                title: "Điều Trị ARV",
                description:
                  "Điều trị ARV hiện đại, theo dõi sát sao và hỗ trợ tuân thủ điều trị",
              },
              {
                icon: "heart-outline",
                title: "Chăm Sóc Toàn Diện",
                description:
                  "Chăm sóc sức khỏe toàn diện cho người sống chung với HIV",
              },
              {
                icon: "people-outline",
                title: "Hỗ Trợ Tâm Lý",
                description:
                  "Tư vấn tâm lý và hỗ trợ xã hội cho người nhiễm và gia đình",
              },
            ].map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons
                    name={service.icon as any}
                    size={30}
                    color="#0D9488"
                  />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Problem Section */}
        <View style={[styles.section, styles.problemSection]}>
          <View style={styles.problemContent}>
            <View style={styles.problemImageContainer}>
              <View style={styles.problemImageWrapper}>
                <View style={styles.problemImageBackground} />
                <Image
                  source={images.doctor2}
                  style={styles.problemImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.problemTextContainer}>
              <Text style={styles.problemTitle}>Bạn Đang Gặp Vấn Đề Nào?</Text>
              <Text style={styles.problemDescription}>
                Đừng để những lo lắng về HIV ảnh hưởng đến sức khỏe và chất
                lượng cuộc sống của bạn. Việc phát hiện và điều trị sớm là yếu
                tố quan trọng giúp kiểm soát bệnh hiệu quả.
              </Text>
              <View style={styles.problemButtonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handlePhoneCall}
                >
                  <Ionicons name="call-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Gọi Ngay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleBookAppointment}
                >
                  <Ionicons name="calendar-outline" size={20} color="#0D9488" />
                  <Text style={[styles.buttonText, { color: "#0D9488" }]}>
                    Đặt Lịch
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Experienced Staff Section */}
        <View style={styles.section}>
          <View style={styles.experiencedStaffContent}>
            <View style={styles.experiencedStaffTextContainer}>
              <Text style={styles.experiencedStaffTitle}>
                Đội Ngũ Y Bác Sĩ Giàu Kinh Nghiệm
              </Text>
              <Text style={styles.experiencedStaffDescription}>
                Đội ngũ y bác sĩ của chúng tôi có nhiều năm kinh nghiệm trong
                lĩnh vực điều trị và chăm sóc HIV/AIDS. Họ không chỉ giỏi chuyên
                môn mà còn tận tâm, nhiệt tình và luôn đặt bệnh nhân lên hàng
                đầu.
              </Text>
              <View style={styles.featuresGrid}>
                {[
                  {
                    icon: "shield-outline",
                    title: "Chuyên Môn Cao",
                    description: "Được đào tạo bài bản",
                  },
                  {
                    icon: "heart-outline",
                    title: "Tận Tâm",
                    description: "Đặt bệnh nhân lên hàng đầu",
                  },
                  {
                    icon: "people-outline",
                    title: "Không Kỳ Thị",
                    description: "Môi trường thân thiện",
                  },
                  {
                    icon: "information-circle-outline",
                    title: "Cập Nhật",
                    description: "Phương pháp điều trị mới nhất",
                  },
                ].map((feature, index) => (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Ionicons
                        name={feature.icon as any}
                        size={24}
                        color="#0D9488"
                      />
                    </View>
                    <View style={styles.featureTextContainer}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.experiencedStaffImageContainer}>
              <View style={styles.experiencedStaffImageWrapper}>
                <View style={styles.experiencedStaffImageBackground} />
                <Image
                  source={images.doctor}
                  style={styles.experiencedStaffImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Services For You Section */}
        <View style={[styles.section, styles.servicesForYouSection]}>
          <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>
            Dịch Vụ Dành Cho Bạn
          </Text>
          <View style={styles.servicesForYouGrid}>
            {[
              {
                icon: "document-text-outline",
                title: "Tư Vấn & Xét Nghiệm",
                description:
                  "Tư vấn trước và sau xét nghiệm HIV, xét nghiệm nhanh và bảo mật kết quả.",
              },
              {
                icon: "shield-outline",
                title: "Điều Trị ARV",
                description:
                  "Điều trị ARV hiện đại, theo dõi tải lượng virus và tư vấn tuân thủ điều trị.",
              },
              {
                icon: "people-outline",
                title: "Hỗ Trợ Tâm Lý",
                description:
                  "Tư vấn tâm lý cá nhân và nhóm, hỗ trợ vượt qua khó khăn và kỳ thị.",
              },
            ].map((service, index) => (
              <View key={index} style={styles.serviceForYouCard}>
                <Ionicons
                  name={service.icon as any}
                  size={40}
                  color="#A7F3D0"
                />
                <Text style={styles.serviceForYouTitle}>{service.title}</Text>
                <Text style={styles.serviceForYouDescription}>
                  {service.description}
                </Text>
                <TouchableOpacity style={styles.serviceForYouButton}>
                  <Text style={styles.serviceForYouButtonText}>
                    Tìm hiểu thêm
                  </Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={16}
                    color="#A7F3D0"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Specialists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tìm Kiếm Theo Chuyên Khoa</Text>
          <View style={styles.specialistsGrid}>
            {[
              { icon: "document-text-outline", name: "Tư Vấn Xét Nghiệm" },
              { icon: "shield-outline", name: "Điều Trị ARV" },
              { icon: "heart-outline", name: "Dinh Dưỡng" },
              { icon: "people-outline", name: "Tâm Lý" },
              { icon: "information-circle-outline", name: "Bệnh Đồng Nhiễm" },
            ].map((specialist, index) => (
              <View key={index} style={styles.specialistCard}>
                <View style={styles.specialistIconContainer}>
                  <Ionicons
                    name={specialist.icon as any}
                    size={24}
                    color="#0D9488"
                  />
                </View>
                <Text style={styles.specialistName}>{specialist.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Doctors Section */}
        <View style={[styles.section, styles.doctorsSection]}>
          <Text style={styles.sectionTitle}>Đội Ngũ Chuyên Gia</Text>
          <View style={styles.doctorsGrid}>
            {doctors.map((doctor, index) => (
              <View key={index} style={styles.doctorCard}>
                <View style={styles.doctorImageContainer}>
                  <View style={styles.doctorImagePlaceholder}>
                    {doctor.avatar ? (
                      <Image
                        source={{ uri: doctor.avatar }}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="person-outline" size={40} color="#0D9488" />
                    )}
                  </View>
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.userName}</Text>
                  <Text style={styles.doctorRole}>{doctor.role}</Text>
                  <TouchableOpacity
                    style={styles.doctorViewButton}
                    onPress={() => navigation.push("Doctors")}
                  >
                    <Text style={styles.doctorViewButtonText}>Xem hồ sơ</Text>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={16}
                      color="#0D9488"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Blog Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bài Viết Mới Nhất</Text>
          <View style={styles.blogGrid}>
            {[
              {
                title: "Hiểu đúng về HIV/AIDS trong thời đại mới",
                excerpt:
                  "Những thông tin cập nhật và chính xác về HIV/AIDS, giúp bạn hiểu đúng và phòng ngừa hiệu quả.",
                date: "15/05/2025",
                comments: 5,
                author: "BS. Nguyễn Văn A",
                image: require("../../assets/doingubacsi2.png"),
              },
              {
                title: "Sống khỏe mạnh với HIV - Những điều cần biết",
                excerpt:
                  "Chia sẻ kinh nghiệm và lời khuyên giúp người sống chung với HIV duy trì lối sống khỏe mạnh và tích cực.",
                date: "10/05/2025",
                comments: 8,
                author: "ThS. Lê Văn C",
                image: require("../../assets/doingubacsi3.png"),
              },
            ].map((article, index) => (
              <View key={index} style={styles.blogCard}>
                <View style={styles.blogImageContainer}>
                  {article.image ? (
                    <Image
                      source={article.image}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.blogImagePlaceholder}>
                      <Ionicons
                        name="document-text-outline"
                        size={40}
                        color="#0D9488"
                      />
                    </View>
                  )}
                </View>
                <View style={styles.blogContent}>
                  <View style={styles.blogMeta}>
                    <Text style={styles.blogDate}>{article.date}</Text>
                    <Text style={styles.blogComments}>
                      • {article.comments} bình luận
                    </Text>
                  </View>
                  <Text style={styles.blogTitle}>{article.title}</Text>
                  <Text style={styles.blogExcerpt}>{article.excerpt}</Text>
                  <View style={styles.blogFooter}>
                    <Text style={styles.blogAuthor}>{article.author}</Text>
                    <TouchableOpacity style={styles.blogReadMore}>
                      <Text style={styles.blogReadMoreText}>Đọc tiếp</Text>
                      <Ionicons
                        name="arrow-forward-outline"
                        size={16}
                        color="#0D9488"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={scrollToTop}>
        <Ionicons name="arrow-up-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0F766E",
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  registerButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  // Removed progress bar styles
  heroSection: {
    backgroundColor: "#0F766E",
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginTop: 60,
  },
  heroSectionNoAuth: {
    marginTop: 0,
  },
  heroContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  heroTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#D1FAE5",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  heroButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  heroImageContainer: {
    width: "100%",
    alignItems: "center",
  },
  heroImageWrapper: {
    position: "relative",
    width: width - 32,
    height: 200,
  },
  heroImageBackground: {
    position: "absolute",
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: "#0D9488",
    borderRadius: 12,
    opacity: 0.3,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#A7F3D0",
  },
  problemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  experiencedStaffImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 24,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },
  problemSection: {
    backgroundColor: "#F9FAFB",
  },
  problemContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  problemImageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  problemImageWrapper: {
    position: "relative",
    width: width - 32,
    height: 200,
  },
  problemImageBackground: {
    position: "absolute",
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: "#0D9488",
    borderRadius: 12,
    opacity: 0.2,
  },
  problemTextContainer: {
    width: "100%",
    alignItems: "center",
  },
  problemTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 16,
  },
  problemDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  problemButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  experiencedStaffContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  experiencedStaffTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  experiencedStaffTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D9488",
    textAlign: "center",
    marginBottom: 16,
  },
  experiencedStaffDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    width: (width - 48) / 2,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2A44",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  experiencedStaffImageContainer: {
    width: "100%",
    alignItems: "center",
  },
  experiencedStaffImageWrapper: {
    position: "relative",
    width: width - 32,
    height: 200,
  },
  experiencedStaffImageBackground: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 60,
    height: 60,
    backgroundColor: "#A7F3D0",
    borderRadius: 30,
    opacity: 0.7,
  },
  servicesForYouSection: {
    backgroundColor: "#0F766E",
  },
  servicesForYouGrid: {
    flexDirection: "column",
    gap: 16,
  },
  serviceForYouCard: {
    backgroundColor: "rgba(13, 148, 136, 0.8)",
    borderRadius: 12,
    padding: 20,
    alignItems: "flex-start",
  },
  serviceForYouTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 8,
  },
  serviceForYouDescription: {
    fontSize: 14,
    color: "#A7F3D0",
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceForYouButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceForYouButtonText: {
    color: "#A7F3D0",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  specialistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  specialistCard: {
    width: (width - 64) / 3,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  specialistIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  specialistName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2A44",
    textAlign: "center",
  },
  doctorsSection: {
    backgroundColor: "#F9FAFB",
  },
  doctorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  doctorCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImageContainer: {
    height: 120,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorInfo: {
    padding: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
    marginBottom: 4,
  },
  doctorRole: {
    fontSize: 12,
    color: "#0D9488",
    marginBottom: 8,
  },
  doctorViewButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorViewButtonText: {
    color: "#0D9488",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  blogGrid: {
    flexDirection: "column",
    gap: 16,
  },
  blogCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  blogImageContainer: {
    height: 120,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
  },
  blogImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  blogContent: {
    padding: 16,
  },
  blogMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  blogDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  blogComments: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
    marginBottom: 8,
    lineHeight: 22,
  },
  blogExcerpt: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  blogFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blogAuthor: {
    fontSize: 12,
    color: "#6B7280",
  },
  blogReadMore: {
    flexDirection: "row",
    alignItems: "center",
  },
  blogReadMoreText: {
    color: "#0D9488",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    margin: 20,
    width: width - 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2A44",
  },
  closeButton: {
    padding: 4,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#1F2A44",
    marginLeft: 12,
    fontWeight: "500",
  },
});

export default Home;
