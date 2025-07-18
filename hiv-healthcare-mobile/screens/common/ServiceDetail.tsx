// screens/service/ServiceDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Service } from "../../types/Service";
import { getServiceById, getServicesByCategoryId } from "../../api/categoryApi";

type ServiceStackParamList = {
  ServiceDetail: { serviceId: string };
  AppointmentBooking: { serviceId?: string };
  ServiceByCategoryId: { categoryId: string; categoryName?: string };
};

type NavigationProp = NativeStackNavigationProp<ServiceStackParamList>;

const { width, height } = Dimensions.get("window");

const ServiceDetail: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { serviceId } = route.params;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
        Alert.alert(
          "Lỗi",
          "Không thể tải thông tin dịch vụ. Vui lòng thử lại.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const formatPrice = (price: number): string => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleBookAppointment = () => {
    navigation.navigate("AppointmentBooking", { serviceId: service?._id });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>Đang tải thông tin dịch vụ...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorTitle}>Không tìm thấy dịch vụ</Text>
          <Text style={styles.errorDescription}>
            Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Text style={styles.errorButtonText}>Quay lại trang trước</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          {service.serviceImage ? (
            <Image
              source={{ uri: service.serviceImage }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="medical-outline" size={60} color="#9CA3AF" />
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.serviceName}>{service.serviceName}</Text>
            {service.price !== undefined && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {formatPrice(service.price)}
                </Text>
                {service.price > 0 && (
                  <Text style={styles.priceUnit}>/ lần khám</Text>
                )}
              </View>
            )}
          </View>

          {/* Service Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View
                style={[styles.infoCardIcon, { backgroundColor: "#EBF8FF" }]}
              >
                <Ionicons name="time-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Thời gian</Text>
                <Text style={styles.infoCardValue}>
                  {service.duration ? `${service.duration} phút` : "30-60 phút"}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View
                style={[styles.infoCardIcon, { backgroundColor: "#F0FDF4" }]}
              >
                <Ionicons name="location-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Địa điểm</Text>
                <Text style={styles.infoCardValue}>Phòng khám</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View
                style={[styles.infoCardIcon, { backgroundColor: "#FAF5FF" }]}
              >
                <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardLabel}>Đặt lịch</Text>
                <Text style={styles.infoCardValue}>Trực tuyến</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Mô tả dịch vụ</Text>
            <Text style={styles.descriptionText}>
              {service.serviceDescription}
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Đặc điểm nổi bật</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.featureText}>
                  Bảo mật thông tin tuyệt đối
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.featureText}>
                  Đội ngũ y bác sĩ chuyên nghiệp
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.featureText}>Môi trường không kỳ thị</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.featureText}>
                  Tư vấn trước và sau xét nghiệm
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.bookButtonText}>Đặt lịch khám ngay</Text>
        </TouchableOpacity>
        <Text style={styles.bookButtonSubtext}>
          Đặt lịch nhanh chóng và thuận tiện
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  imageSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Space for fixed bottom button
  },
  headerSection: {
    marginBottom: 24,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D9488",
  },
  priceUnit: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  infoCardsContainer: {
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  descriptionSection: {
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bookButton: {
    backgroundColor: "#0D9488",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bookButtonSubtext: {
    textAlign: "center",
    fontSize: 14,
    color: "#6B7280",
  },
});

export default ServiceDetail;
