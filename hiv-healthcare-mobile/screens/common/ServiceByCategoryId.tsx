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
  TextInput,
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
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentCategoryName, setCurrentCategoryName] = useState<string>(
    categoryName || "Dịch vụ theo danh mục"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServicesByCategoryId(categoryId);
      setServices(res);
      setFilteredServices(res);
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

  // Filter services based on search term and price filter
  useEffect(() => {
    let filtered = services.filter(
      (service) =>
        service.price &&
        service.price > 0 && // Loại bỏ dịch vụ miễn phí
        (service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.serviceDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    if (priceFilter === "paid") {
      filtered = filtered.filter(
        (service) => service.price && service.price > 0
      );
    }

    setFilteredServices(filtered);
  }, [searchTerm, priceFilter, services]);

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

  const getServiceStats = () => {
    const paidServices = services.filter((s) => s.price && s.price > 0);
    const testServices = paidServices.filter(
      (s: any) => s.isLabTest || s.isArvTest
    );
    return {
      totalServices: paidServices.length,
      testServices: testServices.length,
    };
  };

  const renderStatsSection = () => {
    const stats = getServiceStats();

    return (
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="medical" size={24} color="#3B82F6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats.totalServices}</Text>
              <Text style={styles.statLabel}>Tổng dịch vụ</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: "#F3E8FF" }]}
            >
              <Ionicons name="flask" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statValue}>{stats.testServices}</Text>
              <Text style={styles.statLabel}>
                {services.some((s: any) => s.isArvTest)
                  ? "Điều trị ARV"
                  : "Xét nghiệm"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSearchAndFilter = () => (
    <View style={styles.searchFilterSection}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#9CA3AF"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Ionicons name="filter" size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Lọc theo giá</Text>
        </View>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              priceFilter === "all" && styles.filterOptionActive,
            ]}
            onPress={() => setPriceFilter("all")}
          >
            <Text
              style={[
                styles.filterOptionText,
                priceFilter === "all" && styles.filterOptionTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterOption,
              priceFilter === "paid" && styles.filterOptionActive,
            ]}
            onPress={() => setPriceFilter("paid")}
          >
            <Text
              style={[
                styles.filterOptionText,
                priceFilter === "paid" && styles.filterOptionTextActive,
              ]}
            >
              Có phí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderServiceCard = (service: any) => (
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
            <Text style={styles.priceTagText}>
              {formatPrice(service.price)}
            </Text>
          </View>
        </View>

        {/* Service type badge */}
        <View style={styles.serviceTypeBadge}>
          <Text style={styles.serviceTypeBadgeText}>
            {service.isLabTest
              ? "Xét nghiệm"
              : service.isArvTest
              ? "Điều trị ARV"
              : "Khám lâm sàng"}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.serviceName} numberOfLines={2}>
          {service.serviceName}
        </Text>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.serviceDescription}
        </Text>

        <View style={styles.serviceInfo}>
          {service.duration && (
            <View style={styles.durationContainer}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.durationText}>{service.duration} phút</Text>
            </View>
          )}

          {service.doctorName && (
            <View style={styles.doctorContainer}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={styles.doctorText} numberOfLines={1}>
                {service.doctorName}
              </Text>
            </View>
          )}
        </View>

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
      <Text style={styles.emptyStateTitle}>
        {searchTerm || priceFilter !== "all"
          ? "Không tìm thấy dịch vụ"
          : "Chưa có dịch vụ"}
      </Text>
      <Text style={styles.emptyStateText}>
        {searchTerm || priceFilter !== "all"
          ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
          : "Hiện tại không có dịch vụ nào trong danh mục này. Vui lòng quay lại sau."}
      </Text>
      {!searchTerm && priceFilter === "all" && (
        <TouchableOpacity style={styles.refreshButton} onPress={fetchServices}>
          <Ionicons name="refresh-outline" size={20} color="#0D9488" />
          <Text style={styles.refreshButtonText}>Thử lại</Text>
        </TouchableOpacity>
      )}
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
                {services.filter((s) => s.price && s.price > 0).length} dịch vụ
                chất lượng cao sẵn sàng phục vụ bạn
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          {renderStatsSection()}

          {/* Search and Filter Section */}
          {renderSearchAndFilter()}

          {/* Services Section */}
          {filteredServices.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.servicesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
                <View style={styles.serviceCount}>
                  <Ionicons name="list" size={16} color="#0D9488" />
                  <Text style={styles.serviceCountText}>
                    {filteredServices.length} dịch vụ
                  </Text>
                </View>
              </View>

              <View style={styles.servicesContainer}>
                <View style={styles.servicesGrid}>
                  {filteredServices.map((service) =>
                    renderServiceCard(service)
                  )}
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
  // Stats Section Styles
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Search and Filter Styles
  searchFilterSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#1F2937",
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    marginTop: 8,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 6,
  },
  filterOptions: {
    flexDirection: "row",
    gap: 12,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterOptionActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterOptionTextActive: {
    color: "#FFFFFF",
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
    minHeight: 350,
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
  serviceTypeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(59, 130, 246, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  serviceTypeBadgeText: {
    fontSize: 10,
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
  serviceInfo: {
    marginBottom: 12,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  durationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  doctorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
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
