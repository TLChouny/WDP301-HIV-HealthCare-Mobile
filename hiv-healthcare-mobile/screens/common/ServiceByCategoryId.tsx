// screens/service/ServiceByCategoryId.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getServicesByCategoryId } from "../../api/categoryApi";
import { Service } from "../../types/Service";

// Navigation types
type ServiceStackParamList = {
  ServiceByCategoryId: { categoryId: string; categoryName?: string };
  ServiceDetail: { serviceId: string };
};

type NavigationProp = NativeStackNavigationProp<ServiceStackParamList>;
type RouteProp = {
  params: {
    categoryId: string;
    categoryName?: string;
  };
};

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const ServiceByCategoryId: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { categoryId, categoryName } = route.params;

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCategoryName, setCurrentCategoryName] = useState<string>(
    categoryName || "Dịch vụ theo danh mục"
  );

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServicesByCategoryId(categoryId);
      setServices(res);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách dịch vụ. Vui lòng thử lại.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  useEffect(() => {
    if (categoryId) {
      fetchServices();
    }
  }, [categoryId]);

  const formatPrice = (price: number): string => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate("ServiceDetail", { serviceId });
  };

  const renderServiceCard = (service: Service) => (
    <TouchableOpacity
      key={service._id}
      style={styles.serviceCard}
      onPress={() => handleServicePress(service._id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {service.serviceImage ? (
          <Image
            source={{ uri: service.serviceImage }}
            style={styles.serviceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="medical-outline" size={40} color="#9CA3AF" />
          </View>
        )}
        <View style={styles.imageOverlay}>
          <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>{formatPrice(service.price)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.serviceName} numberOfLines={2}>
          {service.serviceName}
        </Text>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.serviceDescription}
        </Text>

        {service.duration && (
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.durationText}>{service.duration} phút</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => handleServicePress(service._id)}
        >
          <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="medical-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>Không tìm thấy dịch vụ</Text>
      <Text style={styles.emptyStateText}>
        Hiện tại không có dịch vụ nào trong danh mục này. Vui lòng quay lại sau.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchServices}>
        <Ionicons name="refresh-outline" size={20} color="#0D9488" />
        <Text style={styles.refreshButtonText}>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0D9488" />
      <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentCategoryName}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      {loading ? (
        renderLoadingState()
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0D9488"]}
              tintColor="#0D9488"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <Ionicons name="medical" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.heroTitle}>{currentCategoryName}</Text>
              <Text style={styles.heroSubtitle}>
                {services.length} dịch vụ chất lượng cao sẵn sàng phục vụ bạn
              </Text>
            </View>
          </View>

          {/* Services Section */}
          {services.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.servicesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
                <View style={styles.serviceCount}>
                  <Ionicons name="list" size={16} color="#0D9488" />
                  <Text style={styles.serviceCountText}>{services.length} dịch vụ</Text>
                </View>
              </View>
              
              <View style={styles.servicesContainer}>
                <View style={styles.servicesGrid}>
                  {services.map((service) => renderServiceCard(service))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
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
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: {
    alignItems: "center",
  },
  heroIconContainer: {
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
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
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#F0FDFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0D9488",
  },
  refreshButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#0D9488",
  },
  servicesSection: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  serviceCount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  serviceCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D9488",
    marginLeft: 6,
  },
  servicesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
    alignItems: "stretch",
  },
  serviceCard: {
    width: cardWidth,
    minHeight: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    flexGrow: 1,
    justifyContent: "flex-start",
    alignSelf: "stretch",
    display: "flex",
  },
  imageContainer: {
    width: "100%",
    height: 140,
    backgroundColor: "#F3F4F6",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  priceTag: {
    backgroundColor: "rgba(13, 148, 136, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
    textAlign: "center",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  durationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
});

export default ServiceByCategoryId;
