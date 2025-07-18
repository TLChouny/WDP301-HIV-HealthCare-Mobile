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
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.serviceName} numberOfLines={2}>
          {service.serviceName}
        </Text>

        <Text style={styles.serviceDescription} numberOfLines={3}>
          {service.serviceDescription}
        </Text>

        {service.duration && (
          <View style={styles.durationContainer}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.durationText}>{service.duration} phút</Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatPrice(service.price)}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => handleServicePress(service._id)}
        >
          <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
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
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{currentCategoryName}</Text>
            <Text style={styles.subtitle}>
              Khám phá các dịch vụ chất lượng cao trong danh mục này
            </Text>
          </View>

          {/* Services Grid */}
          {services.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.servicesContainer}>
              <View style={styles.servicesGrid}>
                {services.map((service) => renderServiceCard(service))}
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
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
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
  servicesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
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
    backgroundColor: "#F9FAFB",
  },
  cardContent: {
    padding: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 22,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  durationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceContainer: {
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D9488",
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D9488",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
});

export default ServiceByCategoryId;
