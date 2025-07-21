// screens/user/PatientProfile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types/User";

type Gender = "male" | "female" | "other";

type RootStackParamList = {
  PatientProfile: undefined;
  MedicalRecords: undefined;
  MainTabs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PatientProfile: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, getUserById, updateUser, logout, loading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phone_number: "",
    gender: "",
    address: "",
    userDescription: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading || !user?._id) {
        return;
      }

      try {
        console.log("Lấy dữ liệu người dùng với ID:", user._id);
        const detailedUser: User = await getUserById(user._id);
        setUserData(detailedUser);
        setFormData({
          userName: detailedUser.userName || "",
          phone_number: detailedUser.phone_number || "",
          gender: detailedUser.gender || "",
          address: detailedUser.address || "",
          userDescription: detailedUser.userDescription || "",
        });
        setError(null);
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error.message);
        let errorMessage = "Không thể tải thông tin người dùng!";
        if (error.message?.toLowerCase().includes("authenticate")) {
          errorMessage = "Phiên đăng nhập hết hạn!";
          logout();
        }
        setError(errorMessage);
        Alert.alert("Lỗi", errorMessage);
      }
    };

    fetchUserData();
  }, [user?._id, getUserById, logout, loading]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.userName.trim()) {
      return "Vui lòng nhập tên người dùng!";
    }
    if (
      formData.gender &&
      !["male", "female", "other"].includes(formData.gender)
    ) {
      return "Giới tính phải là 'male', 'female', hoặc 'other'!";
    }
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      return "Số điện thoại phải là 10 chữ số!";
    }
    return null;
  };

  const handleUpdate = async () => {
    if (!user?._id) {
      const errorMessage = "Vui lòng đăng nhập để cập nhật!";
      setError(errorMessage);
      Alert.alert("Lỗi", errorMessage);
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      Alert.alert("Lỗi", validationError);
      return;
    }

    try {
      const updatePayload = {
        userName: formData.userName.trim(),
        phone_number: formData.phone_number || undefined,
        gender: (formData.gender as Gender) || undefined,
        address: formData.address || undefined,
        userDescription: formData.userDescription || undefined,
      };

      console.log("Payload gửi đi:", updatePayload);
      await updateUser(user._id, updatePayload);
      const refreshedUser: User = await getUserById(user._id);
      console.log("Dữ liệu người dùng sau cập nhật:", refreshedUser);

      setUserData(refreshedUser);
      setIsEditing(false);
      setError(null);
      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error.message);
      const errorMessage = error.message || "Cập nhật thông tin thất bại!";
      setError(errorMessage);
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setFormData({
      userName: userData?.userName || "",
      phone_number: userData?.phone_number || "",
      gender: userData?.gender || "",
      address: userData?.address || "",
      userDescription: userData?.userDescription || "",
    });
  };

  const getGenderDisplayText = (gender?: string) => {
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
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>Đang tải thông tin xác thực...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="person-outline" size={64} color="#9CA3AF" />
          </View>
          <Text style={styles.errorTitle}>Vui lòng đăng nhập</Text>
          <Text style={styles.errorDescription}>
            Bạn cần đăng nhập để xem thông tin cá nhân
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => {
              Alert.alert("Thông báo", "Chuyển đến trang đăng nhập");
            }}
          >
            <Text style={styles.errorButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View
            style={[styles.errorIconContainer, { backgroundColor: "#FEF2F2" }]}
          >
            <Ionicons name="close-circle-outline" size={64} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Có lỗi xảy ra</Text>
          <Text style={styles.errorDescription}>{error}</Text>
          {error.includes("đăng nhập") && (
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => {
                Alert.alert("Thông báo", "Chuyển đến trang đăng nhập");
              }}
            >
              <Text style={styles.errorButtonText}>Đăng nhập lại</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>
            Đang tải thông tin người dùng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIcon}>
                <Ionicons name="person-outline" size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
                <Text style={styles.headerSubtitle}>
                  Quản lý và cập nhật thông tin cá nhân của bạn
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.profileHeaderContent}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person-outline" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.profileHeaderText}>
                  <Text style={styles.profileName}>
                    {userData.userName || "Chưa cập nhật"}
                  </Text>
                  <Text style={styles.profileEmail}>
                    {userData.email || "Chưa cập nhật"}
                  </Text>
                </View>
              </View>
              <View style={styles.profileHeaderActions}>
                {isEditing ? (
                  <View style={styles.editingActions}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleUpdate}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="checkmark-outline"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.actionButtonText}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="close-outline"
                        size={16}
                        color="#FFFFFF"
                      />
                      <Text style={styles.actionButtonText}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Profile Form */}
            <View style={styles.profileForm}>
              {/* User Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Tên người dùng <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      !isEditing && styles.textInputReadonly,
                    ]}
                    value={formData.userName}
                    onChangeText={(value) =>
                      handleInputChange("userName", value)
                    }
                    editable={isEditing}
                    placeholder="Nhập tên người dùng"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giới tính</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  {isEditing ? (
                    <TextInput
                      style={styles.textInput}
                      value={formData.gender}
                      onChangeText={(value) =>
                        handleInputChange("gender", value)
                      }
                      placeholder="male, female, hoặc other"
                      placeholderTextColor="#9CA3AF"
                    />
                  ) : (
                    <Text style={[styles.textInput, styles.textInputReadonly]}>
                      {getGenderDisplayText(formData.gender)}
                    </Text>
                  )}
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      !isEditing && styles.textInputReadonly,
                    ]}
                    value={formData.phone_number}
                    onChangeText={(value) =>
                      handleInputChange("phone_number", value)
                    }
                    editable={isEditing}
                    placeholder="Nhập số điện thoại"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.textInput, styles.textInputReadonly]}>
                    {userData.email || "Chưa cập nhật"}
                  </Text>
                </View>
              </View>

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Địa chỉ</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      !isEditing && styles.textInputReadonly,
                    ]}
                    value={formData.address}
                    onChangeText={(value) =>
                      handleInputChange("address", value)
                    }
                    editable={isEditing}
                    placeholder="Nhập địa chỉ"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mô tả cá nhân</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#9CA3AF"
                    style={[styles.inputIcon, styles.textAreaIcon]}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.textArea,
                      !isEditing && styles.textInputReadonly,
                    ]}
                    value={formData.userDescription}
                    onChangeText={(value) =>
                      handleInputChange("userDescription", value)
                    }
                    editable={isEditing}
                    placeholder="Nhập mô tả về bản thân"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Error Display */}
              {error && (
                <View style={styles.errorDisplay}>
                  <Text style={styles.errorDisplayText}>{error}</Text>
                </View>
              )}
            </View>

            {/* Medical Records Section */}
            <View style={styles.medicalRecordsSection}>
              <View style={styles.medicalRecordsSectionHeader}>
                <View style={styles.medicalRecordsSectionHeaderLeft}>
                  <View style={styles.medicalRecordsIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#0D9488"
                    />
                  </View>
                  <View>
                    <Text style={styles.medicalRecordsSectionTitle}>
                      Hồ sơ y tế
                    </Text>
                    <Text style={styles.medicalRecordsSectionSubtitle}>
                      Xem lịch sử khám bệnh và kết quả điều trị
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#9CA3AF"
                />
              </View>

              <TouchableOpacity
                style={styles.medicalRecordsButton}
                onPress={() => navigation.navigate("MedicalRecords")}
                activeOpacity={0.8}
              >
                <View style={styles.medicalRecordsButtonContent}>
                  <View style={styles.medicalRecordsButtonLeft}>
                    <View style={styles.medicalRecordsButtonIcon}>
                      <Ionicons
                        name="medical-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.medicalRecordsButtonText}>
                      <Text style={styles.medicalRecordsButtonTitle}>
                        Xem Hồ sơ bệnh án
                      </Text>
                      <Text style={styles.medicalRecordsButtonSubtitle}>
                        Quản lý và theo dõi lịch sử khám bệnh
                      </Text>
                    </View>
                  </View>
                  <View style={styles.medicalRecordsButtonArrow}>
                    <Ionicons
                      name="arrow-forward-outline"
                      size={20}
                      color="#ffffff"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    borderRadius: 12,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerTitleContainer: {
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
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    backgroundColor: "#0D9488",
    padding: 20,
  },
  profileHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileHeaderText: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  profileHeaderActions: {
    alignItems: "flex-end",
  },
  editingActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  profileForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 12,
  },
  textAreaIcon: {
    alignSelf: "flex-start",
    marginTop: 16,
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#374151",
  },
  textInputReadonly: {
    backgroundColor: "#F9FAFB",
    color: "#6B7280",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  errorDisplay: {
    backgroundColor: "#FEF2F2",
    borderWidth: 2,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  errorDisplayText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "500",
  },
  // Medical Records Section Styles
  medicalRecordsSection: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 20,
  },
  medicalRecordsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  medicalRecordsSectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  medicalRecordsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicalRecordsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  medicalRecordsSectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  medicalRecordsButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#0D9488",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  medicalRecordsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  medicalRecordsButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  medicalRecordsButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  medicalRecordsButtonText: {
    flex: 1,
  },
  medicalRecordsButtonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  medicalRecordsButtonSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  medicalRecordsButtonArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickStatsContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickStatIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 16,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
});

export default PatientProfile;
