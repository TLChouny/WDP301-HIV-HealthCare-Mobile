import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getAllUsers } from "../../api/userApi";
import { User, Certification, Experience } from "../../types/User";
import { useNavigation } from "@react-navigation/native";

interface AccordionState {
  personal: boolean;
  cert: boolean;
  exp: boolean;
}

interface OpenAccordions {
  [doctorId: string]: AccordionState;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Chưa cập nhật";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Doctors: React.FC = () => {
  const navigation = useNavigation();
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openAccordions, setOpenAccordions] = useState<OpenAccordions>({});

  useEffect(() => {
    const fetchDoctors = async (): Promise<void> => {
      setLoading(true);
      try {
        const users = await getAllUsers();
        setDoctors(users.filter((u: User) => u.role === "doctor"));
      } catch (err) {
        setDoctors([]);
        Alert.alert("Lỗi", "Không thể tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const toggleAccordion = (
    doctorId: string,
    type: keyof AccordionState
  ): void => {
    setOpenAccordions((prev) => ({
      ...prev,
      [doctorId]: {
        personal:
          type === "personal"
            ? !prev[doctorId]?.personal
            : !!prev[doctorId]?.personal,
        cert: type === "cert" ? !prev[doctorId]?.cert : !!prev[doctorId]?.cert,
        exp: type === "exp" ? !prev[doctorId]?.exp : !!prev[doctorId]?.exp,
      },
    }));
  };

  const handleOpenDocument = async (url: string): Promise<void> => {
    if (!url) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở tài liệu");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở tài liệu");
    }
  };

  const renderAccordionSection = (
    doctor: User,
    type: keyof AccordionState,
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    content: React.ReactNode
  ): React.ReactElement => {
    const accState = openAccordions[doctor._id] || {
      personal: false,
      cert: false,
      exp: false,
    };
    const isOpen = accState[type];

    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => toggleAccordion(doctor._id, type)}
          activeOpacity={0.7}
        >
          <View style={styles.accordionTitleContainer}>
            <Ionicons name={icon} size={20} color="#0D9488" />
            <Text style={styles.accordionTitle}>{title}</Text>
          </View>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {isOpen && <View style={styles.accordionContent}>{content}</View>}
      </View>
    );
  };

  const renderPersonalInfo = (doctor: User): React.ReactElement => (
    <View style={styles.infoList}>
      <View style={styles.infoItem}>
        <Ionicons name="person-outline" size={20} color="#9CA3AF" />
        <Text style={styles.infoLabel}>Giới tính:</Text>
        <Text style={styles.infoValue}>
          {doctor.gender === "male"
            ? "Nam"
            : doctor.gender === "female"
            ? "Nữ"
            : doctor.gender === "other"
            ? "Khác"
            : "Chưa cập nhật"}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="call-outline" size={20} color="#9CA3AF" />
        <Text style={styles.infoLabel}>SĐT:</Text>
        <Text style={styles.infoValue}>
          {doctor.phone_number || "Chưa cập nhật"}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="location-outline" size={20} color="#9CA3AF" />
        <Text style={styles.infoLabel}>Địa chỉ:</Text>
        <Text style={styles.infoValue}>
          {doctor.address || "Chưa cập nhật"}
        </Text>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        <Text style={styles.infoLabel}>Ngày sinh:</Text>
        <Text style={styles.infoValue}>{formatDate(doctor.dateOfBirth)}</Text>
      </View>
    </View>
  );

  const renderCertifications = (doctor: any) => {
    const approvedCerts = (doctor.certifications || []).filter(
      (cert: Certification) => cert.status === "approved"
    );

    if (approvedCerts.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Chứng chỉ làm việc chưa được cập nhật.
        </Text>
      );
    }

    return (
      <View style={styles.itemsList}>
        {approvedCerts.map((cert: Certification, index: number) => (
          <View
            key={cert._id || `${cert.title}-${index}`}
            style={styles.certItem}
          >
            <View style={styles.certHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#0D9488"
              />
              <Text style={styles.certTitle}>{cert.title}</Text>
            </View>

            <View style={styles.certDetail}>
              <Ionicons name="business-outline" size={16} color="#9CA3AF" />
              <Text style={styles.certLabel}>Cấp bởi:</Text>
              <Text style={styles.certValue}>
                {cert.issuer || "Chưa xác định"}
              </Text>
            </View>

            <View style={styles.certDetail}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.certDateText}>
                Ngày cấp: {formatDate(cert.issueDate)}
                {cert.expiryDate &&
                  ` | Ngày hết hạn: ${formatDate(cert.expiryDate)}`}
              </Text>
            </View>

            {cert.description && (
              <View style={styles.certDetail}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#9CA3AF"
                />
                <Text style={styles.certDescription}>{cert.description}</Text>
              </View>
            )}

            {cert.fileUrl && (
              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => handleOpenDocument(cert.fileUrl)}
                activeOpacity={0.7}
              >
                <Ionicons name="document-outline" size={16} color="#3B82F6" />
                <Text style={styles.documentButtonText}>Xem tài liệu</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderExperiences = (doctor: any) => {
    const approvedExps = (doctor.experiences || []).filter(
      (exp: Experience) => exp.status === "approved"
    );

    if (approvedExps.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Kinh nghiệm làm việc chưa được cập nhật.
        </Text>
      );
    }

    return (
      <View style={styles.itemsList}>
        {approvedExps.map((exp: Experience, index: number) => (
          <View
            key={exp._id || `${exp.position}-${index}`}
            style={styles.expItem}
          >
            <View style={styles.expHeader}>
              <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
              <Text style={styles.expTitle}>{exp.position}</Text>
            </View>

            <View style={styles.expDetail}>
              <Ionicons name="business-outline" size={16} color="#9CA3AF" />
              <Text style={styles.expLabel}>Bệnh viện:</Text>
              <Text style={styles.expValue}>
                {exp.hospital || "Chưa xác định"}
              </Text>
            </View>

            <View style={styles.expDetail}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
              <Text style={styles.expDateText}>
                Thời gian: {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Hiện tại"}
              </Text>
            </View>

            {exp.description && (
              <View style={styles.expDetail}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#9CA3AF"
                />
                <Text style={styles.expDescription}>{exp.description}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderDoctorCard = (doctor: User): React.ReactElement => (
    <View key={doctor._id} style={styles.doctorCard}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {doctor.avatar ? (
          <Image source={{ uri: doctor.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color="#0D9488" />
          </View>
        )}
      </View>

      {/* Name & Email */}
      <Text style={styles.doctorName}>{doctor.userName}</Text>
      <Text style={styles.doctorEmail}>{doctor.email || "Chưa cập nhật"}</Text>

      {/* Accordions */}
      <View style={styles.accordionsContainer}>
        {renderAccordionSection(
          doctor,
          "personal",
          "Thông tin cá nhân",
          "person-outline",
          renderPersonalInfo(doctor)
        )}

        {renderAccordionSection(
          doctor,
          "cert",
          "Chứng chỉ làm việc",
          "document-text-outline",
          renderCertifications(doctor)
        )}

        {renderAccordionSection(
          doctor,
          "exp",
          "Kinh nghiệm làm việc",
          "briefcase-outline",
          renderExperiences(doctor)
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Đội ngũ Y Bác sĩ</Text>
        <Text style={styles.heroSubtitle}>
          Đội ngũ y bác sĩ của chúng tôi là những chuyên gia hàng đầu trong lĩnh
          vực chăm sóc sức khỏe cho người sống chung với HIV. Với kinh nghiệm và
          chuyên môn sâu rộng, chúng tôi cam kết mang đến dịch vụ y tế chất
          lượng cao nhất.
        </Text>
      </View>

      {/* Doctors List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D9488" />
            <Text style={styles.loadingText}>Đang tải danh sách bác sĩ...</Text>
          </View>
        ) : doctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Chưa có bác sĩ nào</Text>
            <Text style={styles.emptyDescription}>
              Danh sách bác sĩ sẽ được cập nhật sớm nhất.
            </Text>
          </View>
        ) : (
          <View style={styles.doctorsContainer}>
            {doctors.map(renderDoctorCard)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  heroSection: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  doctorsContainer: {
    gap: 20,
  },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  doctorEmail: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  accordionsContainer: {
    width: "100%",
    gap: 8,
  },
  accordionContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
  },
  accordionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D9488",
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderTopWidth: 0,
  },
  // Personal Info Styles
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  // Certifications Styles
  itemsList: {
    gap: 12,
  },
  certItem: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  certHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  certDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  certLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  certValue: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  certDateText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  certDescription: {
    fontSize: 12,
    color: "#9CA3AF",
    flex: 1,
  },
  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  documentButtonText: {
    fontSize: 12,
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  // Experience Styles
  expItem: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  expHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  expTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  expDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  expValue: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  expDateText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  expDescription: {
    fontSize: 12,
    color: "#9CA3AF",
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
  },
});

export default Doctors;
