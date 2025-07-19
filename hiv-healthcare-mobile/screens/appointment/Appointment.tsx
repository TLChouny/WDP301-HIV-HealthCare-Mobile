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
  Modal,
  FlatList,
  RefreshControl,
  Linking,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { getBookingsByUserId } from "../../api/bookingApi";
import { Booking } from "../../types/Booking";

const { width } = Dimensions.get("window");

const Appointment: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Booking | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentBooking, setSelectedPaymentBooking] =
    useState<Booking | null>(null);

  const fetchBookingsByUserId = async (userId: string) => {
    const res = await getBookingsByUserId(userId);
    if (res) setAppointments(res);
  };

  const removeBooking = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  const createPayment = async () => {};

  useEffect(() => {
    if (user) {
      fetchBookingsByUserId(user._id);
    }
  }, [user]);

  const onRefresh = async () => {
    if (!user?._id) return;
    try {
      fetchBookingsByUserId(user._id);
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleViewAppointment = (appointment: Booking) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleCancelAppointment = async (appointment: Booking) => {
    Alert.alert(
      "Xác nhận hủy lịch",
      "Bạn có chắc chắn muốn hủy lịch hẹn này?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy lịch",
          style: "destructive",
          onPress: async () => {
            try {
              await removeBooking(appointment._id);
              setAppointments((prev) =>
                prev.filter((appt) => appt._id !== appointment._id)
              );
              setShowViewModal(false);
              Alert.alert("Thành công", "Đã hủy lịch hẹn thành công");
            } catch (error) {
              console.error("Error cancelling appointment:", error);
              Alert.alert("Lỗi", "Không thể hủy lịch hẹn");
            }
          },
        },
      ]
    );
  };

  const handleOpenPayment = (booking: Booking) => {
    setSelectedPaymentBooking(booking);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {};

  const translateBookingStatus = (status: string): string => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "checked-in":
        return "Đã điểm danh";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "paid":
        return "Đã thanh toán";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" };
      case "confirmed":
        return { bg: "#D1FAE5", text: "#047857", border: "#A7F3D0" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#DC2626", border: "#FECACA" };
      case "completed":
        return { bg: "#E0E7FF", text: "#3730A3", border: "#C7D2FE" };
      case "checked-in":
        return { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" };
      case "paid":
        return { bg: "#FED7AA", text: "#C2410C", border: "#FDBA74" };
      default:
        return { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "confirmed":
      case "completed":
      case "checked-in":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      case "paid":
        return "card-outline";
      default:
        return "help-circle-outline";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "checked-in", label: "Đã điểm danh" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "cancelled", label: "Đã hủy" },
    { value: "completed", label: "Hoàn thành" },
  ];

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === selectedStatus)?.label ||
    "Tất cả trạng thái";

  // Filter appointments by status
  const filteredAppointments =
    selectedStatus === "all"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.status === selectedStatus
        );

  const renderAppointmentCard = ({ item }: { item: Booking }) => {
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.cardContent}>
          {/* Service Info */}
          <View style={styles.serviceInfo}>
            <View style={styles.serviceImageContainer}>
              {item.serviceId?.serviceImage ? (
                <Image
                  source={{ uri: item.serviceId.serviceImage }}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.serviceImage, styles.placeholderImage]}>
                  <Ionicons name="medical-outline" size={24} color="#9CA3AF" />
                </View>
              )}
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName} numberOfLines={2}>
                {item.serviceId?.serviceName || "Không xác định"}
              </Text>
              <View style={styles.appointmentMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {formatDate(item.bookingDate as string)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{item.startTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text style={styles.metaText}>{item.doctorName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Status & Actions */}
          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColor.bg,
                  borderColor: statusColor.border,
                },
              ]}
            >
              <Ionicons
                name={statusIcon as any}
                size={16}
                color={statusColor.text}
              />
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {translateBookingStatus(item.status)}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => handleViewAppointment(item)}
                activeOpacity={0.8}
              >
                <Ionicons name="eye-outline" size={16} color="#3B82F6" />
                <Text style={styles.viewButtonText}>Xem</Text>
              </TouchableOpacity>

              {item.status === "pending" && (
                <>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close-outline" size={16} color="#EF4444" />
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => handleOpenPayment(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="card-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.payButtonText}>Thanh toán</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Lịch hẹn của bạn</Text>
              <Text style={styles.headerSubtitle}>
                Quản lý và theo dõi các lịch hẹn khám bệnh của bạn
              </Text>
            </View>
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.statusFilterButton}
            onPress={() => setShowStatusPicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.statusFilterText}>{selectedStatusLabel}</Text>
            <Ionicons name="chevron-down" size={16} color="#0D9488" />
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có lịch hẹn nào</Text>
            <Text style={styles.emptyDescription}>
              {selectedStatus === "all"
                ? "Bạn chưa có lịch hẹn nào được đặt"
                : `Không có lịch hẹn nào ở trạng thái "${translateBookingStatus(
                    selectedStatus
                  )}"`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAppointments}
            renderItem={renderAppointmentCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.appointmentsList}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Status Picker Modal */}
      <Modal
        visible={showStatusPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.statusPickerModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn trạng thái</Text>
              <TouchableOpacity
                onPress={() => setShowStatusPicker(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={statusOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    selectedStatus === item.value &&
                      styles.statusOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedStatus(item.value);
                    setShowStatusPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      selectedStatus === item.value &&
                        styles.statusOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedStatus === item.value && (
                    <Ionicons name="checkmark" size={20} color="#0D9488" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <Modal
          visible={showViewModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowViewModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.viewModal}>
              <View style={styles.viewModalHeader}>
                <View style={styles.viewModalIcon}>
                  <Ionicons name="calendar-outline" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.viewModalTitle}>Chi tiết lịch hẹn</Text>
              </View>

              <ScrollView style={styles.viewModalContent}>
                <Text style={styles.appointmentServiceName}>
                  {selectedAppointment.serviceId?.serviceName ||
                    "Không xác định"}
                </Text>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedAppointment.bookingDate as string)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Giờ:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.startTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bác sĩ:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.doctorName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Meeting Link:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.meetLink || "Không có"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Trạng thái:</Text>
                    <View
                      style={[
                        styles.detailStatusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedAppointment.status
                          ).bg,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(selectedAppointment.status) as any}
                        size={16}
                        color={getStatusColor(selectedAppointment.status).text}
                      />
                      <Text
                        style={[
                          styles.detailStatusText,
                          {
                            color: getStatusColor(selectedAppointment.status)
                              .text,
                          },
                        ]}
                      >
                        {translateBookingStatus(selectedAppointment.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ghi chú:</Text>
                    <Text style={styles.detailValue}>
                      {selectedAppointment.notes || "Không có"}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.viewModalActions}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowViewModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
                {selectedAppointment.status === "pending" && (
                  <TouchableOpacity
                    style={styles.cancelAppointmentButton}
                    onPress={() => handleCancelAppointment(selectedAppointment)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelAppointmentButtonText}>
                      Hủy lịch
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPaymentBooking && (
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.paymentModal}>
              <View style={styles.paymentModalHeader}>
                <View style={styles.paymentModalIcon}>
                  <Ionicons name="card-outline" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.paymentModalTitle}>Thanh toán dịch vụ</Text>
              </View>

              <View style={styles.paymentContent}>
                <View style={styles.paymentServiceImageContainer}>
                  {selectedPaymentBooking.serviceId?.serviceImage ? (
                    <Image
                      source={{
                        uri: selectedPaymentBooking.serviceId.serviceImage,
                      }}
                      style={styles.paymentServiceImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.paymentServiceImage,
                        styles.placeholderImage,
                      ]}
                    >
                      <Ionicons
                        name="medical-outline"
                        size={32}
                        color="#9CA3AF"
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.paymentServiceName}>
                  {selectedPaymentBooking.serviceId?.serviceName ||
                    "Không xác định"}
                </Text>
                <Text style={styles.paymentAmount}>
                  {formatPrice(selectedPaymentBooking.serviceId?.price || 0)}
                </Text>

                <View style={styles.paymentDetails}>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentDetailLabel}>Ngày:</Text>
                    <Text style={styles.paymentDetailValue}>
                      {formatDate(selectedPaymentBooking.bookingDate as string)}
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentDetailLabel}>Giờ:</Text>
                    <Text style={styles.paymentDetailValue}>
                      {selectedPaymentBooking.startTime}
                    </Text>
                  </View>
                  <View style={styles.paymentDetailRow}>
                    <Text style={styles.paymentDetailLabel}>Bác sĩ:</Text>
                    <Text style={styles.paymentDetailValue}>
                      {selectedPaymentBooking.doctorName}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.paymentActions}>
                <TouchableOpacity
                  style={styles.paymentCloseButton}
                  onPress={() => setShowPaymentModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.paymentCloseButtonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmPaymentButton}
                  onPress={handleConfirmPayment}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmPaymentButtonText}>
                    Xác nhận thanh toán
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statusFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#0D9488",
  },
  statusFilterText: {
    fontSize: 16,
    color: "#0D9488",
    fontWeight: "500",
  },
  appointmentsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardContent: {
    padding: 16,
  },
  serviceInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  serviceImageContainer: {
    marginRight: 12,
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    lineHeight: 24,
  },
  appointmentMeta: {
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusSection: {
    alignItems: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3B82F6",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  bookNowButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookNowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusPickerModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: width * 0.8,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  statusOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statusOptionSelected: {
    backgroundColor: "#F0FDFA",
  },
  statusOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  statusOptionTextSelected: {
    color: "#0D9488",
    fontWeight: "600",
  },
  viewModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: "80%",
  },
  viewModalHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  viewModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  viewModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  viewModalContent: {
    paddingHorizontal: 24,
    maxHeight: 400,
  },
  appointmentServiceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
  },
  appointmentDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
    maxWidth: "60%",
  },
  detailStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  detailStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  viewModalActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  closeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  cancelAppointmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  cancelAppointmentButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  paymentModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: width * 0.9,
    maxHeight: "70%",
  },
  paymentModalHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  paymentModalIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#0D9488",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  paymentContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  paymentServiceImageContainer: {
    marginBottom: 16,
  },
  paymentServiceImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  paymentServiceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: 20,
  },
  paymentDetails: {
    width: "100%",
    gap: 8,
  },
  paymentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  paymentActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  paymentCloseButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  paymentCloseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmPaymentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#0D9488",
    alignItems: "center",
  },
  confirmPaymentButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default Appointment;
