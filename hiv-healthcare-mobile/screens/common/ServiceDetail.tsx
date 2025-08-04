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
import { getServiceById } from "../../api/categoryApi";

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

  const [service, setService] = useState<any>(null);
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

  const getServiceType = (service: any) => {
    if (service.isLabTest)
      return {
        label: "Xét nghiệm",
        color: "#3B82F6",
        bgColor: "#EBF8FF",
        icon: "flask-outline",
      };
    if (service.isArvTest)
      return {
        label: "Điều trị ARV",
        color: "#8B5CF6",
        bgColor: "#F3E8FF",
        icon: "pulse-outline",
      };
    return {
      label: "Khám lâm sàng",
      color: "#0D9488",
      bgColor: "#F0FDFA",
      icon: "medical-outline",
    };
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
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={60} color="#F59E0B" />
          </View>
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

  const serviceType = getServiceType(service);
  const categoryName = service.categoryId?.categoryName;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D9488" />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết dịch vụ
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.imageSection}>
          {service.serviceImage ? (
            <Image
              source={{ uri: service.serviceImage }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.placeholderImage,
                { backgroundColor: serviceType.bgColor },
              ]}
            >
              <Ionicons
                name={serviceType.icon as any}
                size={80}
                color={serviceType.color}
              />
            </View>
          )}

          {/* Service Type Badge */}
          <View style={styles.serviceTypeBadge}>
            <Text
              style={[
                styles.serviceTypeBadgeText,
                { color: serviceType.color },
              ]}
            >
              {serviceType.label}
            </Text>
          </View>

          {/* Category Badge */}
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{categoryName}</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.serviceName}>{service.serviceName}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{formatPrice(service.price)}</Text>
              {service.price > 0 && (
                <Text style={styles.priceUnit}>/ lần khám</Text>
              )}
            </View>
          </View>

          {/* Service Info Grid */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="information-circle" size={20} color="#0D9488" />{" "}
              Thông tin dịch vụ
            </Text>

            <View style={styles.infoCardsContainer}>
              {/* Duration */}
              <View style={styles.infoCard}>
                <View
                  style={[styles.infoCardIcon, { backgroundColor: "#EBF8FF" }]}
                >
                  <Ionicons name="time-outline" size={20} color="#3B82F6" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Thời gian khám</Text>
                  <Text style={styles.infoCardValue}>
                    {service.duration
                      ? `${service.duration} phút`
                      : "30-60 phút"}
                  </Text>
                </View>
              </View>

              {/* Time Slot */}
              {service.timeSlot && (
                <View style={styles.infoCard}>
                  <View
                    style={[
                      styles.infoCardIcon,
                      { backgroundColor: "#F3E8FF" },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#8B5CF6"
                    />
                  </View>
                  <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardLabel}>Khung giờ</Text>
                    <Text style={styles.infoCardValue}>{service.timeSlot}</Text>
                  </View>
                </View>
              )}

              {/* Doctor */}
              {service.doctorName && (
                <View style={styles.infoCard}>
                  <View
                    style={[
                      styles.infoCardIcon,
                      { backgroundColor: "#ECFDF5" },
                    ]}
                  >
                    <Ionicons name="person-outline" size={20} color="#10B981" />
                  </View>
                  <View style={styles.infoCardContent}>
                    <Text style={styles.infoCardLabel}>Bác sĩ phụ trách</Text>
                    <Text style={styles.infoCardValue}>
                      {service.doctorName}
                    </Text>
                  </View>
                </View>
              )}

              {/* Location */}
              <View style={styles.infoCard}>
                <View
                  style={[styles.infoCardIcon, { backgroundColor: "#F0FDF4" }]}
                >
                  <Ionicons name="location-outline" size={20} color="#10B981" />
                </View>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Địa điểm</Text>
                  <Text style={styles.infoCardValue}>
                    Phòng khám chuyên khoa
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#0D9488"
              />{" "}
              Mô tả dịch vụ
            </Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                {service.serviceDescription ||
                  "Chưa có mô tả chi tiết cho dịch vụ này."}
              </Text>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#0D9488"
              />{" "}
              Đặc điểm dịch vụ
            </Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                <Text style={styles.featureTitle}>Đội ngũ chuyên nghiệp</Text>
                <Text style={styles.featureDescription}>
                  Bác sĩ giàu kinh nghiệm
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="hardware-chip" size={24} color="#3B82F6" />
                <Text style={styles.featureTitle}>Trang thiết bị hiện đại</Text>
                <Text style={styles.featureDescription}>
                  Công nghệ tiên tiến
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="globe" size={24} color="#8B5CF6" />
                <Text style={styles.featureTitle}>Quy trình chuẩn quốc tế</Text>
                <Text style={styles.featureDescription}>
                  Đảm bảo chất lượng
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Ionicons name="headset" size={24} color="#F59E0B" />
                <Text style={styles.featureTitle}>Hỗ trợ 24/7</Text>
                <Text style={styles.featureDescription}>Tư vấn mọi lúc</Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="call-outline" size={20} color="#0D9488" /> Thông
              tin liên hệ
            </Text>
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color="#EF4444" />
                <Text style={styles.contactText}>
                  123 Đường ABC, Quận XYZ, TP.HCM
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color="#10B981" />
                <Text style={styles.contactText}>Hotline: 1900 1234</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="time" size={20} color="#3B82F6" />
                <Text style={styles.contactText}>
                  Giờ làm việc: 7:00 - 17:00
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomCTA}>
        <View style={styles.priceSection}>
          <Text style={styles.bottomPriceLabel}>Giá dịch vụ</Text>
          <Text style={styles.bottomPriceText}>
            {formatPrice(service.price)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#0D9488",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
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
  errorIcon: {
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
  imageSection: {
    position: "relative",
    height: 280,
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceTypeBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceTypeBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(107, 114, 128, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  contentSection: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for fixed bottom button
  },
  headerSection: {
    marginBottom: 32,
  },
  serviceName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 36,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D9488",
  },
  priceUnit: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 6,
  },
  infoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  infoCardsContainer: {
    gap: 12,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  descriptionSection: {
    marginBottom: 32,
  },
  descriptionCard: {
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  descriptionText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2, // 2 columns with gap
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  contactSection: {
    marginBottom: 32,
  },
  contactCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceSection: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  bottomPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D9488",
  },
  bookButton: {
    backgroundColor: "#0D9488",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ServiceDetail;
