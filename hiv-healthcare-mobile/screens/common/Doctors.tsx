import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface DoctorCategory {
  id: number;
  title: string;
  description: string;
  icon: string;
  path: string;
  color: string[];
}

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

type RootStackParamList = {
  Doctors: undefined;
  DoctorsByCategory: { categoryId: number; categoryTitle: string };
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const Doctors: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const doctorCategories: DoctorCategory[] = [
    {
      id: 1,
      title: "Bác sĩ Chuyên khoa HIV",
      description:
        "Đội ngũ bác sĩ chuyên gia hàng đầu trong lĩnh vực điều trị và chăm sóc bệnh nhân HIV/AIDS",
      icon: "medical-outline",
      path: "/doctors/hiv-specialist",
      color: ["#0D9488", "#0F766E"],
    },
    {
      id: 2,
      title: "Bác sĩ Tư vấn",
      description:
        "Các chuyên gia tư vấn tâm lý và sức khỏe cho người sống chung với HIV",
      icon: "person-outline",
      path: "/doctors/counselors",
      color: ["#2563EB", "#1D4ED8"],
    },
  ];

  const features: FeatureItem[] = [
    {
      id: 1,
      title: "Chuyên môn cao",
      description:
        "Đội ngũ bác sĩ được đào tạo chuyên sâu về HIV/AIDS và có nhiều năm kinh nghiệm.",
      icon: "school-outline",
    },
    {
      id: 2,
      title: "Tận tâm với bệnh nhân",
      description:
        "Luôn lắng nghe và thấu hiểu nhu cầu của bệnh nhân để đưa ra phương án điều trị tốt nhất.",
      icon: "heart-outline",
    },
    {
      id: 3,
      title: "Cập nhật kiến thức",
      description:
        "Thường xuyên cập nhật các phương pháp điều trị mới nhất trong lĩnh vực HIV/AIDS.",
      icon: "library-outline",
    },
  ];

  const handleCategoryPress = (category: DoctorCategory) => {
    console.log(`Navigate to ${category.title}`);
  };

  const LinearGradientView: React.FC<{
    colors: string[];
    children: React.ReactNode;
    style?: any;
  }> = ({ colors, children, style }) => (
    <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainTabs")}
          style={styles.backButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={28} color="#0D9488" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Đội ngũ Y Bác sĩ</Text>
            <Text style={styles.heroSubtitle}>
              Đội ngũ y bác sĩ của chúng tôi là những chuyên gia hàng đầu trong
              lĩnh vực chăm sóc sức khỏe cho người sống chung với HIV. Với kinh
              nghiệm và chuyên môn sâu rộng, chúng tôi cam kết mang đến dịch vụ
              y tế chất lượng cao nhất.
            </Text>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {doctorCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <LinearGradientView
                  colors={category.color}
                  style={styles.categoryHeader}
                >
                  <View style={styles.categoryIconContainer}>
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={category.icon as any}
                        size={32}
                        color="#ffffff"
                      />
                    </View>
                  </View>
                </LinearGradientView>

                <View style={styles.categoryContent}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>

                  <View style={styles.categoryFooter}>
                    <Text style={styles.viewMoreText}>Xem chi tiết</Text>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={16}
                      color="#0D9488"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.additionalSection}>
          <View style={styles.additionalCard}>
            <Text style={styles.additionalTitle}>
              Tại sao chọn đội ngũ y bác sĩ của chúng tôi?
            </Text>

            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <View key={feature.id} style={styles.featureItem}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons
                      name={feature.icon as any}
                      size={24}
                      color="#0D9488"
                    />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <View style={styles.ctaIconContainer}>
              <Ionicons name="calendar-outline" size={40} color="#0D9488" />
            </View>
            <Text style={styles.ctaTitle}>Sẵn sàng đặt lịch khám?</Text>
            <Text style={styles.ctaDescription}>
              Hãy liên hệ với chúng tôi để được tư vấn và đặt lịch khám với các
              bác sĩ chuyên khoa
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.ctaButtonText}>Đặt lịch ngay</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={20}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  heroSection: {
    backgroundColor: "#0F766E",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#A7F3D0",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 10,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  categoriesGrid: {
    gap: 20,
  },
  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    transform: [{ scale: 1 }],
  },
  categoryHeader: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryContent: {
    padding: 24,
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  categoryDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  categoryFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D9488",
  },
  additionalSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  additionalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  additionalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  featuresGrid: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0FDFA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ctaCard: {
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A7F3D0",
  },
  ctaIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default Doctors;
