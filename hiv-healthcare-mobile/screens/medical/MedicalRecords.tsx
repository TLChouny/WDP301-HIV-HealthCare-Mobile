import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getResultsByUserId } from "../../api/resultApi";
import { getUserById } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";

type RootStackParamList = {
  MedicalRecords: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get("window");

const MedicalRecords: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const recordsPerPage = 3;

  const allRecords = useMemo(() => {
    return medicalRecords.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [medicalRecords]);

  const totalRecords = allRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = allRecords.slice(startIndex, endIndex);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "confirmed":
        return "#3B82F6";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "re-examination":
        return "#8B5CF6";
      case "checked-in":
        return "#6366F1";
      case "checked-out":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  }, []);

  const getStatusBgColor = useCallback((status: string): string => {
    switch (status) {
      case "completed":
        return "#D1FAE5";
      case "confirmed":
        return "#DBEAFE";
      case "pending":
        return "#FEF3C7";
      case "cancelled":
        return "#FEE2E2";
      case "re-examination":
        return "#EDE9FE";
      case "checked-in":
        return "#E0E7FF";
      case "checked-out":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  }, []);

  const getStatusIcon = useCallback(
    (status: string): keyof typeof Ionicons.glyphMap => {
      switch (status) {
        case "completed":
          return "checkmark-circle-outline";
        case "confirmed":
          return "checkmark-circle-outline";
        case "pending":
          return "time-outline";
        case "cancelled":
          return "close-circle-outline";
        case "re-examination":
          return "refresh-outline";
        case "checked-in":
          return "location-outline";
        case "checked-out":
          return "location-outline";
        default:
          return "alert-circle-outline";
      }
    },
    []
  );

  const getStatusDisplayText = useCallback((status: string): string => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      case "re-examination":
        return "Tái khám";
      case "checked-in":
        return "Đã check-in";
      case "checked-out":
        return "Đã check-out";
      default:
        return status;
    }
  }, []);

  const getGenderDisplayText = useCallback((gender?: string): string => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa cập nhật";
    }
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Không xác định";
    }
  }, []);

  const formatDateTime = useCallback((dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch {
      return "Không xác định";
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user?._id) {
      setError("Không tìm thấy thông tin người dùng");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [userData, resultsData] = await Promise.all([
        getUserById(user._id),
        getResultsByUserId(user._id),
      ]);

      setUserInfo(userData);

      setMedicalRecords(resultsData);
    } catch (error) {
      console.error("Lỗi fetch:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
      setMedicalRecords([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?._id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewRecord = useCallback((record: any) => {
    setSelectedRecord(record);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedRecord(null);
  }, []);

  const handlePrint = useCallback(() => {
    Alert.alert(
      "Tính năng đang phát triển",
      "Tính năng in hồ sơ sẽ được cập nhật trong phiên bản tiếp theo."
    );
  }, []);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchData()}
          >
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  const handleOpenLink = async (url: any) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không thể mở liên kết");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở liên kết");
    }
  };

  const formatMedicationTimes = (medicationTime: string) => {
    if (!medicationTime) return "Chưa có";

    if (Array.isArray(medicationTime)) {
      return medicationTime.join(", ");
    }

    return medicationTime;
  };

  const formatFrequency = (frequency: string): string => {
    if (!frequency) return "Chưa có";

    const frequencyMap: Record<string, string> = {
      once_daily: "Ngày 1 lần",
      twice_daily: "Ngày 2 lần",
      three_times_daily: "Ngày 3 lần",
      four_times_daily: "Ngày 4 lần",
      as_needed: "Khi cần thiết",
      before_meals: "Trước bữa ăn",
      after_meals: "Sau bữa ăn",
      at_bedtime: "Trước khi ngủ",
    };

    return frequencyMap[frequency] || frequency;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#0D9488" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color="#0D9488"
              />
            </View>
            <Text style={styles.headerTitle}>Hồ Sơ Bệnh Án Điện Tử</Text>
            <Text style={styles.headerSubtitle}>
              Quản lý và theo dõi lịch sử khám bệnh
            </Text>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Patient Info Card */}
          {userInfo && (
            <View style={styles.patientCard}>
              <View style={styles.patientHeader}>
                <Ionicons name="person-outline" size={24} color="#0D9488" />
                <Text style={styles.patientHeaderTitle}>
                  Thông Tin Bệnh Nhân
                </Text>
              </View>

              <View style={styles.patientAvatarContainer}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>
                    {userInfo.userName
                      ? userInfo.userName.charAt(0).toUpperCase()
                      : "?"}
                  </Text>
                </View>
                <Text style={styles.patientName}>
                  {userInfo.userName || "Chưa cập nhật"}
                </Text>
              </View>

              <View style={styles.patientInfoGrid}>
                <View style={styles.patientInfoItem}>
                  <View style={styles.patientInfoIcon}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.patientInfoContent}>
                    <Text style={styles.patientInfoLabel}>Email</Text>
                    <Text style={styles.patientInfoValue}>
                      {userInfo.email || "Chưa cập nhật"}
                    </Text>
                  </View>
                </View>

                <View style={styles.patientInfoItem}>
                  <View style={styles.patientInfoIcon}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.patientInfoContent}>
                    <Text style={styles.patientInfoLabel}>Số điện thoại</Text>
                    <Text style={styles.patientInfoValue}>
                      {userInfo.phone_number || "Chưa cập nhật"}
                    </Text>
                  </View>
                </View>

                {userInfo.dateOfBirth && (
                  <View style={styles.patientInfoItem}>
                    <View style={styles.patientInfoIcon}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.patientInfoContent}>
                      <Text style={styles.patientInfoLabel}>Ngày sinh</Text>
                      <Text style={styles.patientInfoValue}>
                        {formatDate(userInfo.dateOfBirth)}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.patientInfoItem}>
                  <View style={styles.patientInfoIcon}>
                    <Text style={styles.genderIcon}>⚥</Text>
                  </View>
                  <View style={styles.patientInfoContent}>
                    <Text style={styles.patientInfoLabel}>Giới tính</Text>
                    <Text style={styles.patientInfoValue}>
                      {getGenderDisplayText(userInfo.gender)}
                    </Text>
                  </View>
                </View>

                {userInfo.address && (
                  <View style={[styles.patientInfoItem, styles.addressItem]}>
                    <View style={styles.patientInfoIcon}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                    <View style={styles.patientInfoContent}>
                      <Text style={styles.patientInfoLabel}>Địa chỉ</Text>
                      <Text style={styles.patientInfoValue}>
                        {userInfo.address}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.totalRecordsContainer}>
                <Ionicons name="analytics-outline" size={20} color="#0D9488" />
                <View style={styles.totalRecordsContent}>
                  <Text style={styles.totalRecordsLabel}>Tổng số lần khám</Text>
                  <Text style={styles.totalRecordsValue}>{totalRecords}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Medical Records */}
          <View style={styles.recordsCard}>
            <View style={styles.recordsHeader}>
              <Ionicons name="medical-outline" size={24} color="#0D9488" />
              <View style={styles.recordsHeaderContent}>
                <Text style={styles.recordsHeaderTitle}>Lịch Sử Khám Bệnh</Text>
                <Text style={styles.recordsHeaderSubtitle}>
                  Chi tiết các lần khám và kết quả điều trị
                </Text>
              </View>
            </View>

            {currentRecords.length > 0 ? (
              <>
                <View style={styles.recordsList}>
                  {currentRecords.map((record: any) => (
                    <View key={record._id} style={styles.recordItem}>
                      <View
                        style={[
                          styles.recordItemHeader,
                          {
                            backgroundColor: getStatusBgColor(
                              record.bookingId?.status || "pending"
                            ),
                          },
                        ]}
                      >
                        <View style={styles.recordItemHeaderLeft}>
                          <View style={styles.recordItemIcon}>
                            <Ionicons
                              name="medical-outline"
                              size={20}
                              color="#0D9488"
                            />
                          </View>
                          <View>
                            <Text style={styles.recordItemTitle}>
                              {record.bookingId?.serviceId?.serviceName ||
                                record.bookingId?.serviceName ||
                                "Khác"}
                            </Text>
                            <Text style={styles.recordItemSubtitle}>
                              {formatDateTime(record.createdAt)}
                            </Text>
                          </View>
                        </View>
                        {record.bookingId?.status && (
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor: getStatusBgColor(
                                  record.bookingId.status
                                ),
                                borderColor: getStatusColor(
                                  record.bookingId.status
                                ),
                              },
                            ]}
                          >
                            <Ionicons
                              name={getStatusIcon(record.bookingId.status)}
                              size={12}
                              color={getStatusColor(record.bookingId.status)}
                            />
                            <Text
                              style={[
                                styles.statusText,
                                {
                                  color: getStatusColor(
                                    record.bookingId.status
                                  ),
                                },
                              ]}
                            >
                              {getStatusDisplayText(record.bookingId.status)}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.recordItemContent}>
                        <View style={styles.recordItemMeta}>
                          {record.reExaminationDate && (
                            <View style={styles.recordItemMetaItem}>
                              <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#6B7280"
                              />
                              <Text style={styles.recordItemMetaText}>
                                Tái khám: {formatDate(record.reExaminationDate)}
                              </Text>
                            </View>
                          )}
                          {record.bookingId?.doctorName && (
                            <View style={styles.recordItemMetaItem}>
                              <Ionicons
                                name="person-outline"
                                size={16}
                                color="#6B7280"
                              />
                              <Text style={styles.recordItemMetaText}>
                                BS. {record.bookingId.doctorName}
                              </Text>
                            </View>
                          )}
                        </View>

                        {record.resultDescription && (
                          <Text
                            style={styles.recordItemDescription}
                            numberOfLines={2}
                          >
                            {record.resultDescription}
                          </Text>
                        )}

                        <TouchableOpacity
                          style={styles.viewDetailButton}
                          onPress={() => handleViewRecord(record)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="eye-outline"
                            size={16}
                            color="#0D9488"
                          />
                          <Text style={styles.viewDetailButtonText}>
                            Chi tiết
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Pagination */}
                {totalRecords > recordsPerPage && (
                  <View style={styles.pagination}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        currentPage === 1 && styles.paginationButtonDisabled,
                      ]}
                      onPress={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={16}
                        color={currentPage === 1 ? "#D1D5DB" : "#6B7280"}
                      />
                      <Text
                        style={[
                          styles.paginationButtonText,
                          currentPage === 1 &&
                            styles.paginationButtonTextDisabled,
                        ]}
                      >
                        Trang trước
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.paginationInfo}>
                      Trang {currentPage} / {totalPages}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        currentPage === totalPages &&
                          styles.paginationButtonDisabled,
                      ]}
                      onPress={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <Text
                        style={[
                          styles.paginationButtonText,
                          currentPage === totalPages &&
                            styles.paginationButtonTextDisabled,
                        ]}
                      >
                        Trang sau
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={16}
                        color={
                          currentPage === totalPages ? "#D1D5DB" : "#6B7280"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#D1D5DB"
                  />
                </View>
                <Text style={styles.emptyStateTitle}>
                  Chưa có hồ sơ khám bệnh
                </Text>
                <Text style={styles.emptyStateText}>
                  Hồ sơ khám bệnh sẽ được hiển thị tại đây sau khi bạn thực hiện
                  khám
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Detail Modal - áp dụng logic từ web */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCloseModal}
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#0D9488"
              />
              <Text style={styles.modalTitle}>Chi Tiết Hồ Sơ Khám Bệnh</Text>
            </View>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedRecord && (
              <>
                {/* General Information */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Ionicons
                      name="clipboard-outline"
                      size={20}
                      color="#0D9488"
                    />
                    <Text style={styles.modalSectionTitle}>
                      Thông Tin Chung
                    </Text>
                  </View>

                  <View style={styles.modalField}>
                    <Text style={styles.modalFieldLabel}>Tên kết quả</Text>
                    <Text style={styles.modalFieldValue}>
                      {selectedRecord.resultName || "Chưa có"}
                    </Text>
                  </View>

                  {selectedRecord.reExaminationDate && (
                    <View style={styles.modalField}>
                      <Text style={styles.modalFieldLabel}>Ngày tái khám</Text>
                      <Text style={styles.modalFieldValue}>
                        {formatDate(selectedRecord.reExaminationDate)}
                      </Text>
                    </View>
                  )}

                  {selectedRecord.symptoms && (
                    <View style={styles.modalField}>
                      <Text style={styles.modalFieldLabel}>Triệu chứng</Text>
                      <Text
                        style={[styles.modalFieldValue, styles.descriptionText]}
                      >
                        {selectedRecord.symptoms}
                      </Text>
                    </View>
                  )}

                  <View style={styles.modalField}>
                    <Text style={styles.modalFieldLabel}>Mô tả kết quả</Text>
                    <Text
                      style={[styles.modalFieldValue, styles.descriptionText]}
                    >
                      {selectedRecord.resultDescription || "Không có mô tả"}
                    </Text>
                  </View>
                </View>

                {/* Vital Signs Section */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Ionicons name="heart-outline" size={20} color="#0D9488" />
                    <Text style={styles.modalSectionTitle}>
                      Dấu Hiệu Sinh Tồn
                    </Text>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Cân nặng</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.weight
                          ? `${selectedRecord.weight} kg`
                          : "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Chiều cao</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.height
                          ? `${selectedRecord.height} cm`
                          : "Chưa có"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>BMI</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.bmi || "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Huyết áp</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.bloodPressure || "Chưa có"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Mạch</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.pulse
                          ? `${selectedRecord.pulse} lần/phút`
                          : "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Nhiệt độ</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.temperature
                          ? `${selectedRecord.temperature} °C`
                          : "Chưa có"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Lab Test Information */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Ionicons name="flask-outline" size={20} color="#0D9488" />
                    <Text style={styles.modalSectionTitle}>Xét Nghiệm</Text>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>
                        Loại mẫu xét nghiệm
                      </Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.sampleType || "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>
                        Phương pháp xét nghiệm
                      </Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.testMethod || "Chưa có"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Loại kết quả</Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.resultType || "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>
                        Kết quả xét nghiệm
                      </Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.testResult || "Chưa có"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>
                        Giá trị xét nghiệm
                      </Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.testValue
                          ? `${selectedRecord.testValue} ${
                              selectedRecord.unit || ""
                            }`.trim()
                          : "Chưa có"}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>
                        Khoảng tham chiếu
                      </Text>
                      <Text style={styles.modalFieldValue}>
                        {selectedRecord.referenceRange || "Chưa có"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Booking Information */}
                {selectedRecord.bookingId && (
                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#0D9488"
                      />
                      <Text style={styles.modalSectionTitle}>
                        Thông Tin Đặt Lịch
                      </Text>
                    </View>

                    <View style={styles.modalFieldsRow}>
                      <View style={styles.modalFieldHalf}>
                        <Text style={styles.modalFieldLabel}>Mã đặt lịch</Text>
                        <Text style={[styles.modalFieldValue, styles.codeText]}>
                          {selectedRecord.bookingId.bookingCode || "Chưa có"}
                        </Text>
                      </View>

                      <View style={styles.modalFieldHalf}>
                        <Text style={styles.modalFieldLabel}>Trạng thái</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            styles.modalStatusBadge,
                            {
                              backgroundColor: getStatusBgColor(
                                selectedRecord.bookingId.status
                              ),
                              borderColor: getStatusColor(
                                selectedRecord.bookingId.status
                              ),
                            },
                          ]}
                        >
                          <Ionicons
                            name={getStatusIcon(
                              selectedRecord.bookingId.status
                            )}
                            size={12}
                            color={getStatusColor(
                              selectedRecord.bookingId.status
                            )}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color: getStatusColor(
                                  selectedRecord.bookingId.status
                                ),
                              },
                            ]}
                          >
                            {getStatusDisplayText(
                              selectedRecord.bookingId.status
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modalFieldsRow}>
                      {selectedRecord.bookingId.bookingDate && (
                        <View style={styles.modalFieldHalf}>
                          <Text style={styles.modalFieldLabel}>Ngày khám</Text>
                          <Text style={styles.modalFieldValue}>
                            {formatDate(selectedRecord.bookingId.bookingDate)}
                          </Text>
                        </View>
                      )}

                      {(selectedRecord.bookingId.startTime ||
                        selectedRecord.bookingId.endTime) && (
                        <View style={styles.modalFieldHalf}>
                          <Text style={styles.modalFieldLabel}>Thời gian</Text>
                          <Text style={styles.modalFieldValue}>
                            {selectedRecord.bookingId.startTime || "??:??"} -{" "}
                            {selectedRecord.bookingId.endTime || "??:??"}
                          </Text>
                        </View>
                      )}
                    </View>

                    {selectedRecord.bookingId.doctorName && (
                      <View style={styles.modalField}>
                        <Text style={styles.modalFieldLabel}>Bác sĩ</Text>
                        <Text style={styles.modalFieldValue}>
                          BS. {selectedRecord.bookingId.doctorName}
                        </Text>
                      </View>
                    )}

                    {selectedRecord.bookingId.notes && (
                      <View style={styles.modalField}>
                        <Text style={styles.modalFieldLabel}>Ghi chú</Text>
                        <Text
                          style={[
                            styles.modalFieldValue,
                            styles.descriptionText,
                          ]}
                        >
                          {selectedRecord.bookingId.notes}
                        </Text>
                      </View>
                    )}

                    {selectedRecord.bookingId.meetLink && (
                      <View style={styles.modalField}>
                        <Text style={styles.modalFieldLabel}>
                          Link cuộc họp
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleOpenLink(selectedRecord.bookingId.meetLink)
                          }
                          style={styles.linkContainer}
                        >
                          <Text style={styles.linkText} numberOfLines={2}>
                            {selectedRecord.bookingId.meetLink}
                          </Text>
                          <Ionicons
                            name="open-outline"
                            size={16}
                            color="#3B82F6"
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

                {/* ARV Regimen Information */}
                {selectedRecord.arvregimenId && (
                  <View style={styles.modalSection}>
                    <View style={styles.modalSectionHeader}>
                      <Ionicons
                        name="medical-outline"
                        size={20}
                        color="#0D9488"
                      />
                      <Text style={styles.modalSectionTitle}>Phác Đồ ARV</Text>
                    </View>

                    <View style={styles.modalField}>
                      <Text style={styles.modalFieldLabel}>Tên phác đồ</Text>
                      <Text style={[styles.modalFieldValue, styles.boldText]}>
                        {selectedRecord.arvregimenId.arvName || "Chưa có"}
                      </Text>
                    </View>

                    {selectedRecord.medicationTime && (
                      <View style={styles.modalFieldsRow}>
                        <View style={styles.modalFieldHalf}>
                          <Text style={styles.modalFieldLabel}>
                            Thời gian uống thuốc
                          </Text>
                          <Text style={styles.modalFieldValue}>
                            {formatMedicationTimes(
                              selectedRecord.medicationTime
                            )}
                          </Text>
                        </View>

                        <View style={styles.modalFieldHalf}>
                          <Text style={styles.modalFieldLabel}>
                            Khe thời gian
                          </Text>
                          <Text style={styles.modalFieldValue}>
                            {selectedRecord.medicationSlot || "Chưa có"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {selectedRecord.arvregimenId.arvDescription && (
                      <View style={styles.modalField}>
                        <Text style={styles.modalFieldLabel}>Mô tả</Text>
                        <Text
                          style={[
                            styles.modalFieldValue,
                            styles.descriptionText,
                          ]}
                        >
                          {selectedRecord.arvregimenId.arvDescription}
                        </Text>
                      </View>
                    )}

                    {selectedRecord.arvregimenId.drugs &&
                      selectedRecord.arvregimenId.drugs.length > 0 && (
                        <View style={styles.modalField}>
                          <Text style={styles.modalFieldLabel}>
                            Thông tin thuốc
                          </Text>
                          <View style={styles.drugsTable}>
                            <View style={styles.drugsTableHeader}>
                              <Text style={styles.drugsTableHeaderText}>
                                Tên thuốc
                              </Text>
                              <Text style={styles.drugsTableHeaderText}>
                                Liều dùng
                              </Text>
                              <Text style={styles.drugsTableHeaderText}>
                                Tần suất
                              </Text>
                            </View>
                            {selectedRecord.arvregimenId.drugs.map(
                              (drug: string, index: number) => {
                                const frequencies = selectedRecord.arvregimenId
                                  ?.frequency
                                  ? selectedRecord.arvregimenId.frequency.split(
                                      ";"
                                    )
                                  : [];
                                return (
                                  <View
                                    key={index}
                                    style={styles.drugsTableRow}
                                  >
                                    <Text style={styles.drugsTableCell}>
                                      {drug}
                                    </Text>
                                    <Text style={styles.drugsTableCell}>
                                      {selectedRecord.arvregimenId?.dosages[
                                        index
                                      ] || "Chưa có"}
                                    </Text>
                                    <Text style={styles.drugsTableCell}>
                                      {formatFrequency(frequencies[index])}
                                    </Text>
                                  </View>
                                );
                              }
                            )}
                          </View>
                        </View>
                      )}

                    {selectedRecord.arvregimenId.contraindications &&
                      selectedRecord.arvregimenId.contraindications.length >
                        0 && (
                        <View style={styles.modalField}>
                          <View style={styles.warningHeader}>
                            <Ionicons
                              name="warning-outline"
                              size={16}
                              color="#EF4444"
                            />
                            <Text style={styles.modalFieldLabel}>
                              Chống chỉ định
                            </Text>
                          </View>
                          <View style={styles.warningContainer}>
                            {selectedRecord.arvregimenId.contraindications.map(
                              (item: string, index: number) => (
                                <View key={index} style={styles.warningItem}>
                                  <Text style={styles.warningText}>{item}</Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}

                    {selectedRecord.arvregimenId.sideEffects &&
                      selectedRecord.arvregimenId.sideEffects.length > 0 && (
                        <View style={styles.modalField}>
                          <View style={styles.warningHeader}>
                            <Ionicons
                              name="alert-circle-outline"
                              size={16}
                              color="#F59E0B"
                            />
                            <Text style={styles.modalFieldLabel}>
                              Tác dụng phụ
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.warningContainer,
                              {
                                backgroundColor: "#FEF3C7",
                                borderColor: "#F59E0B",
                              },
                            ]}
                          >
                            {selectedRecord.arvregimenId.sideEffects.map(
                              (effect: string, index: number) => (
                                <View key={index} style={styles.warningItem}>
                                  <Text
                                    style={[
                                      styles.warningText,
                                      { color: "#92400E" },
                                    ]}
                                  >
                                    {effect}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        </View>
                      )}
                  </View>
                )}

                {/* Timestamps */}
                <View style={styles.modalSection}>
                  <View style={styles.modalSectionHeader}>
                    <Ionicons name="time-outline" size={20} color="#0D9488" />
                    <Text style={styles.modalSectionTitle}>
                      Thông Tin Thời Gian
                    </Text>
                  </View>

                  <View style={styles.modalFieldsRow}>
                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Ngày tạo</Text>
                      <Text style={styles.modalFieldValue}>
                        {formatDateTime(selectedRecord.createdAt)}
                      </Text>
                    </View>

                    <View style={styles.modalFieldHalf}>
                      <Text style={styles.modalFieldLabel}>Ngày cập nhật</Text>
                      <Text style={styles.modalFieldValue}>
                        {formatDateTime(selectedRecord.updatedAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={handlePrint}
              activeOpacity={0.7}
            >
              <Ionicons name="print-outline" size={16} color="#6B7280" />
              <Text style={styles.modalSecondaryButtonText}>In hồ sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Text style={styles.modalPrimaryButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
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
    width: 80,
    height: 80,
    backgroundColor: "#FEE2E2",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D9488",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    position: "absolute",
    top: 24,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  headerContent: {
    alignItems: "center",
  },
  headerIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  mainContent: {
    padding: 20,
    gap: 20,
  },
  patientCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  patientHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  patientAvatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  patientAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0D9488",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  patientAvatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  patientInfoGrid: {
    gap: 12,
  },
  patientInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
  },
  addressItem: {
    alignItems: "flex-start",
  },
  patientInfoIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  genderIcon: {
    fontSize: 18,
    color: "#6B7280",
  },
  patientInfoContent: {
    marginLeft: 12,
    flex: 1,
  },
  patientInfoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  patientInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  totalRecordsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  totalRecordsContent: {
    marginLeft: 12,
  },
  totalRecordsLabel: {
    fontSize: 14,
    color: "#0D9488",
    marginBottom: 4,
    fontWeight: "500",
  },
  totalRecordsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D9488",
  },
  recordsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recordsHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  recordsHeaderContent: {
    marginLeft: 12,
  },
  recordsHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  recordsHeaderSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  recordsList: {
    padding: 16,
    gap: 12,
  },
  recordItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  recordItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  recordItemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recordItemIcon: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recordItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  recordItemSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
  },
  modalStatusBadge: {
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  recordItemContent: {
    padding: 16,
  },
  recordItemMeta: {
    gap: 8,
    marginBottom: 12,
  },
  recordItemMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recordItemMetaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  recordItemDescription: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  viewDetailButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0D9488",
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#F3F4F6",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  paginationButtonTextDisabled: {
    color: "#D1D5DB",
  },
  paginationInfo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  modalField: {
    marginBottom: 12,
  },
  modalFieldsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  modalFieldHalf: {
    flex: 1,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  modalFieldValue: {
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    lineHeight: 20,
  },
  descriptionText: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  codeText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 13,
    backgroundColor: "#F3F4F6",
  },
  boldText: {
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0891B2",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0891B2",
  },
  listContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  listItemText: {
    fontSize: 14,
    color: "#1F2937",
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  warningContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F59E0B",
    overflow: "hidden",
  },
  warningItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  warningText: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "500",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
  },
  modalSecondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  modalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  modalPrimaryButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 4,
  },
  linkText: {
    fontSize: 14,
    color: "#3B82F6",
    flex: 1,
    marginRight: 8,
  },
  drugsTable: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
    overflow: "hidden",
  },
  drugsTableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  drugsTableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  drugsTableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  drugsTableCell: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  modalPrimaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default MedicalRecords;
