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

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  avatar: string;
}

const DoctorsPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Doctors'>>();

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "BS. Nguyễn Văn An",
      specialty: "Chuyên khoa HIV/AIDS",
      experience: "15 năm kinh nghiệm",
      rating: 4.8,
      avatar: "NA",
    },
    {
      id: "2",
      name: "BS. Trần Thị Bình",
      specialty: "Tư vấn tâm lý",
      experience: "12 năm kinh nghiệm",
      rating: 4.9,
      avatar: "TB",
    },
    {
      id: "3",
      name: "BS. Lê Văn Cường",
      specialty: "Chuyên khoa Nhiễm",
      experience: "18 năm kinh nghiệm",
      rating: 4.7,
      avatar: "LC",
    },
    {
      id: "4",
      name: "BS. Phạm Thị Dung",
      specialty: "Dinh dưỡng",
      experience: "10 năm kinh nghiệm",
      rating: 4.6,
      avatar: "PD",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#F59E0B" : "#D1D5DB"}
        />
      );
    }
    return stars;
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
          <Text style={styles.headerTitle}>Đội ngũ bác sĩ</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bác sĩ chuyên khoa</Text>
          <Text style={styles.sectionDescription}>
            Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao trong lĩnh vực HIV/AIDS
          </Text>

          <View style={styles.doctorsList}>
            {doctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorAvatar}>
                  <Text style={styles.avatarText}>{doctor.avatar}</Text>
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                  <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                      {renderStars(doctor.rating)}
                    </View>
                    <Text style={styles.ratingText}>{doctor.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookButton} activeOpacity={0.7}>
                  <Text style={styles.bookButtonText}>Đặt lịch</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 22,
  },
  doctorsList: {
    gap: 16,
  },
  doctorCard: {
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
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "500",
    marginBottom: 4,
  },
  doctorExperience: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  bookButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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

export default DoctorsPage; 