import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { createBooking } from "../../api/bookingApi";
import { getServiceById } from "../../api/categoryApi";
import { getAllUsers } from "../../api/userApi";
import { useAuth } from "../../contexts/AuthContext";
import { Service } from "../../types/Service";
import { User } from "../../types/User";

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

type RootStackParamList = {
  AppointmentBooking: undefined;
  MainTabs: { screen: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const AppointmentBooking: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  // State management
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });
  const route = useRoute<any>();
  const { serviceId } = route.params;

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const users = await getAllUsers();
        const doctors = users.filter((u: User) => u.role === "doctor");
        setDoctors(doctors);
      } catch (err) {
        console.error("Doctors error:", err);
        showToast("Không thể tải danh sách bác sĩ!");
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);
  useEffect(() => {
    if (serviceId) {
      setServiceLoading(true);
      getServiceById(serviceId)
        .then((data) => setService(data))
        .catch((err) => {
          console.error("Service error:", err);
          showToast("Không thể tải thông tin dịch vụ!");
        })
        .finally(() => setServiceLoading(false));
    }
  }, [serviceId]);

  // Utility functions
  const generateTimeSlots = (
    start: string,
    end: string,
    interval = 30
  ): string[] => {
    const slots: string[] = [];
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0, 0);

    while (current <= endTime) {
      slots.push(
        `${current.getHours().toString().padStart(2, "0")}:${current
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      );
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

  const filterDoctorsByDate = (doctors: User[], date: Date): User[] => {
    const selectedDay = date.toLocaleDateString("en-US", { weekday: "long" });
    return doctors.filter((doctor) => {
      if (!doctor.dayOfWeek || !doctor.startDay || !doctor.endDay) return false;
      const startDay = new Date(doctor.startDay);
      const endDay = new Date(doctor.endDay);
      return (
        doctor.dayOfWeek.includes(selectedDay) &&
        date >= startDay &&
        date <= endDay
      );
    });
  };

  const showToast = (message: string, type: "success" | "error" = "error") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Thành công" : "Lỗi",
      text2: message,
      position: "top",
      autoHide: true,
      visibilityTime: 3000,
    });
  };

  // Event handlers
  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      showToast("Vui lòng chọn ngày, giờ và bác sĩ!");
      return;
    }

    if (!isAnonymous && (!formData.customerName || !formData.customerPhone)) {
      showToast("Vui lòng điền họ tên và số điện thoại!");
      return;
    }

    try {
      setLoading(true);
      const selectedDoctorObj = doctors.find(
        (doc) => doc._id === selectedDoctor
      );

      const bookingData = {
        bookingDate: selectedDate.toISOString().split("T")[0],
        startTime: selectedTime,
        fullName: isAnonymous ? undefined : formData.customerName,
        phone: isAnonymous ? undefined : formData.customerPhone,
        email: isAnonymous ? undefined : formData.customerEmail,
        doctorName: selectedDoctorObj?.userName ?? undefined,
        notes: formData.notes,
        serviceId: service?._id ?? undefined,
        currency: "VND",
        status: "pending" as const,
        isAnonymous,
        userId: user?._id,
      };

      if (!user || !user._id) {
        showToast("Vui lòng đăng nhập để đặt lịch!");
        return;
      }

      await createBooking(bookingData).then((data) => {
        showToast("Đặt lịch khám thành công!", "success");
        navigation.navigate("MainTabs");
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      showToast(err.message || "Đặt lịch thất bại.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedDate && doctors.length > 0) {
      const filtered = filterDoctorsByDate(doctors, selectedDate);
      setFilteredDoctors(filtered);
      if (filtered.length === 0) {
        setSelectedDoctor("");
      }
    } else {
      setFilteredDoctors(doctors);
    }
  }, [selectedDate, doctors]);

  useEffect(() => {
    const doctorObj = doctors.find((d) => d._id === selectedDoctor);
    if (doctorObj && doctorObj.startTimeInDay && doctorObj.endTimeInDay) {
      const slots = generateTimeSlots(
        doctorObj.startTimeInDay,
        doctorObj.endTimeInDay
      );
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
    setSelectedTime("");
  }, [selectedDoctor, doctors]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="calendar-outline" size={32} color="#ffffff" />
            </View>
            <Text style={styles.headerTitle}>Đặt Lịch Khám HIV</Text>
            <Text style={styles.headerSubtitle}>
              Vui lòng điền đầy đủ thông tin để đặt lịch khám với bác sĩ chuyên
              khoa HIV. Mọi thông tin sẽ được bảo mật tuyệt đối.
            </Text>
          </View>
        </View>

        {/* Service Information */}
        {serviceLoading ? (
          <View style={styles.serviceCard}>
            <ActivityIndicator size="large" color="#0D9488" />
            <Text style={styles.loadingText}>
              Đang tải thông tin dịch vụ...
            </Text>
          </View>
        ) : service ? (
          <View style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.serviceName}</Text>
            {service.price && (
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(service.price)}
                </Text>
              </View>
            )}
            <Text style={styles.serviceDescription}>
              {service.serviceDescription}
            </Text>
          </View>
        ) : null}

        {/* Main Form */}
        <View style={styles.formContainer}>
          {/* Anonymous Toggle */}
          <View style={styles.anonymousSection}>
            <View style={styles.switchContainer}>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                trackColor={{ false: "#E5E7EB", true: "#0D9488" }}
                thumbColor={isAnonymous ? "#ffffff" : "#ffffff"}
              />
              <View style={styles.switchLabel}>
                <Text style={styles.switchTitle}>Đặt lịch ẩn danh</Text>
                <Text style={styles.switchSubtitle}>
                  Bảo vệ thông tin cá nhân với tùy chọn đặt lịch ẩn danh
                </Text>
              </View>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={24} color="#0D9488" />
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Họ và tên{" "}
                {!isAnonymous && <Text style={styles.required}>*</Text>}
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, isAnonymous && styles.inputDisabled]}
                  value={formData.customerName}
                  onChangeText={(text) =>
                    handleInputChange("customerName", text)
                  }
                  placeholder="Nhập họ và tên"
                  editable={!isAnonymous}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Số điện thoại{" "}
                {!isAnonymous && <Text style={styles.required}>*</Text>}
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, isAnonymous && styles.inputDisabled]}
                  value={formData.customerPhone}
                  onChangeText={(text) =>
                    handleInputChange("customerPhone", text)
                  }
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  editable={!isAnonymous}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, isAnonymous && styles.inputDisabled]}
                  value={formData.customerEmail}
                  onChangeText={(text) =>
                    handleInputChange("customerEmail", text)
                  }
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  editable={!isAnonymous}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Appointment Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={24} color="#0D9488" />
              <Text style={styles.sectionTitle}>Chi tiết lịch hẹn</Text>
            </View>

            {/* User Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Chọn bác sĩ <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pickerContainer}>
                {loadingDoctors ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#0D9488" />
                    <Text style={styles.loadingText}>
                      Đang tải danh sách bác sĩ...
                    </Text>
                  </View>
                ) : (
                  <>
                    {filteredDoctors.length === 0 ? (
                      <Text style={styles.noDataText}>
                        Không có bác sĩ nào khả dụng vào ngày này
                      </Text>
                    ) : (
                      <View style={styles.doctorList}>
                        {filteredDoctors.map((doctor) => (
                          <TouchableOpacity
                            key={doctor._id}
                            style={[
                              styles.doctorOption,
                              selectedDoctor === doctor._id &&
                                styles.doctorOptionSelected,
                            ]}
                            onPress={() => setSelectedDoctor(doctor._id)}
                          >
                            <View style={styles.doctorInfo}>
                              <Text
                                style={[
                                  styles.doctorName,
                                  selectedDoctor === doctor._id &&
                                    styles.doctorNameSelected,
                                ]}
                              >
                                {doctor.userName}
                              </Text>
                              <Text
                                style={[
                                  styles.doctorDescription,
                                  selectedDoctor === doctor._id &&
                                    styles.doctorDescriptionSelected,
                                ]}
                              >
                                {doctor.userDescription}
                              </Text>
                            </View>
                            {selectedDoctor === doctor._id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color="#0D9488"
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            </View>

            {/* Date Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Chọn ngày <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#0D9488"
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.dateButtonText,
                    !selectedDate && styles.placeholderText,
                  ]}
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString("vi-VN")
                    : "Chọn ngày khám"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Time Selection */}
            <View style={styles.inputGroup}>
              <View style={styles.timeLabelContainer}>
                <Ionicons name="time-outline" size={20} color="#0D9488" />
                <Text style={styles.label}>
                  Chọn giờ <Text style={styles.required}>*</Text>
                </Text>
              </View>

              {timeSlots.length > 0 ? (
                <View style={styles.timeSlotContainer}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.timeSlotSelected,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          selectedTime === time && styles.timeSlotTextSelected,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noTimeSlots}>
                  <Ionicons name="time-outline" size={48} color="#E5E7EB" />
                  <Text style={styles.noTimeSlotsText}>
                    Vui lòng chọn bác sĩ để xem giờ khả dụng
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#0D9488"
              />
              <Text style={styles.sectionTitle}>Ghi chú</Text>
            </View>

            <TextInput
              style={styles.textArea}
              value={formData.notes}
              onChangeText={(text) => handleInputChange("notes", text)}
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Security Notices */}
          <View style={styles.noticeContainer}>
            <View style={styles.securityNotice}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#3B82F6"
              />
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Bảo mật thông tin</Text>
                <Text style={styles.noticeText}>
                  Mọi thông tin của bạn sẽ được bảo mật tuyệt đối theo tiêu
                  chuẩn y tế.
                  {isAnonymous &&
                    " Khi đặt lịch ẩn danh, chúng tôi chỉ sử dụng thông tin cần thiết để liên hệ xác nhận lịch hẹn."}
                </Text>
              </View>
            </View>

            <View style={[styles.securityNotice, styles.confirmNotice]}>
              <Ionicons name="alert-circle-outline" size={24} color="#10B981" />
              <View style={styles.noticeContent}>
                <Text style={styles.noticeTitle}>Xác nhận lịch hẹn</Text>
                <Text style={styles.noticeText}>
                  Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ với bạn
                  trong vòng 24 giờ để xác nhận lịch hẹn và cung cấp hướng dẫn
                  chuẩn bị.
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Đặt Lịch Khám Ngay</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#0D9488",
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 40,
  },
  headerIcon: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#A7F3D0",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  priceTag: {
    alignSelf: "flex-start",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065F46",
  },
  serviceDescription: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  anonymousSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 16,
    flex: 1,
  },
  switchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  switchSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
    color: "#9CA3AF",
  },
  inputIcon: {
    marginLeft: 16,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    fontStyle: "italic",
  },
  doctorList: {
    gap: 12,
  },
  doctorOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  doctorOptionSelected: {
    borderColor: "#0D9488",
    backgroundColor: "#F0FDFA",
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  doctorNameSelected: {
    color: "#0D9488",
  },
  doctorDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  doctorDescriptionSelected: {
    color: "#0D9488",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  timeLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    minWidth: 80,
    alignItems: "center",
  },
  timeSlotSelected: {
    borderColor: "#0D9488",
    backgroundColor: "#0D9488",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  timeSlotTextSelected: {
    color: "#ffffff",
  },
  noTimeSlots: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  noTimeSlotsText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
  },
  textArea: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#ffffff",
    minHeight: 100,
  },
  noticeContainer: {
    marginBottom: 24,
  },
  securityNotice: {
    flexDirection: "row",
    backgroundColor: "#EBF8FF",
    borderWidth: 2,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  confirmNotice: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  noticeContent: {
    marginLeft: 12,
    flex: 1,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#0D9488",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default AppointmentBooking;
