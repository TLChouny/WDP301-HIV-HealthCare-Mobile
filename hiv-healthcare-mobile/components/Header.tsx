// components/Layout/Header.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import { getAllCategories } from "../api/categoryApi";
import { Category } from "../types/Category";
import type { RootStackParamList } from "./Navigation";
import { getNotificationsByUserId } from "../api/notifycation";
import { Notification } from "../types/Notification";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);

  // Animation values
  const [drawerAnimation] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [overlayAnimation] = useState(new Animated.Value(0));

  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotification] = useState<Notification[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getAllCategories();
        if (res.length) {
          setCategories(res);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchNoty = async () => {
      try {
        if (user && user._id) {
          const res = await getNotificationsByUserId(user._id);
          if (res && res.data) setNotification(res.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchCategory();
    fetchNoty();
  }, [user?._id]);

  // Animation effect
  useEffect(() => {
    if (isDrawerOpen) {
      Animated.parallel([
        Animated.timing(drawerAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerAnimation, {
          toValue: -DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isDrawerOpen, drawerAnimation, overlayAnimation]);

  // Event handlers
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // Reset services expanded state when drawer closes
    setIsServicesExpanded(false);
  }, []);

  // Fixed: Separate handler for services expansion that doesn't close drawer
  const toggleServicesExpansion = useCallback((e?: any) => {
    // Stop event propagation to prevent any parent handlers
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setIsServicesExpanded(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          logout();
          closeDrawer();
          Alert.alert("Thành công", "Đăng xuất thành công!");
        },
      },
    ]);
  }, [logout, closeDrawer]);

  const navigateToScreen = useCallback((screenName: keyof RootStackParamList, params?: any) => {
    closeDrawer();
    navigation.navigate(screenName, params);
  }, [navigation, closeDrawer]);

  // Utility functions
  const formatPrice = useCallback((price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return { bg: "#D1FAE5", text: "#047857" };
      case "pending":
        return { bg: "#FEF3C7", text: "#B45309" };
      case "completed":
        return { bg: "#E0E7FF", text: "#3730A3" };
      case "checked-in":
        return { bg: "#D1FAE5", text: "#047857" };
      case "checked-out":
        return { bg: "#E0E7FF", text: "#3730A3" };
      case "cancelled":
        return { bg: "#F3F4F6", text: "#6B7280" };
      case "re-examination":  
        return { bg: "#E0E7FF", text: "#3730A3" };        
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn thành";
      case "checked-in":
        return "Đã xác nhận";
      case "checked-out":
        return "Đã thanh toán";
      case "cancelled":
        return "Đã hủy";
      case "re-examination":
        return "Tái khám";    
      default:
        return "Không xác định";
    }
  }, []);

  // Handle notification actions
  const handleNotificationPress = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
    setIsNotificationOpen(false);
  }, []);

  const closeNotificationDetail = useCallback(() => {
    setShowNotificationDetail(false);
    setSelectedNotification(null);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={toggleDrawer}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoText}>HC</Text>
            </View>
            <Text style={styles.logoTitle}>HIV Care</Text>
          </View>

          <View style={styles.rightActions}>
            {user && (
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setIsNotificationOpen(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#FFFFFF"
                />
                {notifications.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Overlay */}
      {isDrawerOpen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnimation,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeDrawer}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Drawer Menu */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: drawerAnimation }],
          },
        ]}
      >
        <SafeAreaView style={styles.drawerContent}>
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.drawerLogoContainer}>
              <View style={styles.drawerLogoIcon}>
                <Text style={styles.drawerLogoText}>HC</Text>
              </View>
              <Text style={styles.drawerLogoTitle}>HIV Care</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeDrawer}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.menuItems}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Home */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("Home")}
              activeOpacity={0.7}
            >
              <Ionicons name="home-outline" size={20} color="#0D9488" />
              <Text style={styles.menuItemText}>Trang chủ</Text>
            </TouchableOpacity>

            {/* Services - Fixed implementation */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={toggleServicesExpansion}
              activeOpacity={0.7}
            >
              <Ionicons name="medical-outline" size={20} color="#0D9488" />
              <Text style={styles.menuItemText}>Dịch vụ</Text>
              <Ionicons
                name={isServicesExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#6B7280"
                style={styles.chevronIcon}
              />
            </TouchableOpacity>

            {/* Services Submenu - Enhanced */}
            {isServicesExpanded && (
              <View style={styles.submenu}>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TouchableOpacity
                      key={category._id}
                      style={styles.submenuItem}
                      onPress={() =>
                        navigateToScreen("ServiceByCategoryId", {
                          categoryId: category._id,
                          categoryName: category.categoryName,
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.submenuItemIcon}>
                        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                      </View>
                      <Text style={styles.submenuItemText}>
                        {category.categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.submenuItemLoading}>
                    <Text style={styles.submenuItemLoadingText}>Đang tải...</Text>
                  </View>
                )}
              </View>
            )}

            {/* Other Menu Items */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("Doctors")}
              activeOpacity={0.7}
            >
              <Ionicons name="people-outline" size={20} color="#0D9488" />
              <Text style={styles.menuItemText}>Bác sĩ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("Blog")}
              activeOpacity={0.7}
            >
              <Ionicons name="book-outline" size={20} color="#0D9488" />
              <Text style={styles.menuItemText}>Blog</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("About")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#0D9488"
              />
              <Text style={styles.menuItemText}>Giới thiệu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateToScreen("Contact")}
              activeOpacity={0.7}
            >
              <Ionicons name="call-outline" size={20} color="#0D9488" />
              <Text style={styles.menuItemText}>Liên hệ</Text>
            </TouchableOpacity>

            {/* Appointment Button */}
            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={() => navigateToScreen("Appointment")}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.appointmentButtonText}>Đặt lịch khám</Text>
            </TouchableOpacity>

            {/* Auth Buttons */}
            {user ? (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.authButtons}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigateToScreen("Login")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => navigateToScreen("Register")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.registerButtonText}>Đăng ký</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>

      {/* Notification Modal */}
      <Modal
        visible={isNotificationOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.notificationModal}>
            <View style={styles.notificationModalHeader}>
              <Text style={styles.notificationModalTitle}>Thông báo</Text>
              <TouchableOpacity
                onPress={() => setIsNotificationOpen(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
              {notifications.length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <Ionicons
                    name="notifications-off-outline"
                    size={48}
                    color="#9CA3AF"
                  />
                  <Text style={styles.emptyNotificationsText}>
                    Chưa có thông báo nào
                  </Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification._id}
                    style={styles.notificationItem}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationItemContent}>
                      <Text style={styles.notificationItemTitle}>
                        {notification.notiName}
                      </Text>
                      <Text style={styles.notificationItemDescription} numberOfLines={2}>
                        {notification.notiDescription}
                      </Text>
                      <Text style={styles.notificationItemService}>
                        Dịch vụ: {notification.bookingId.serviceId.serviceName}
                      </Text>
                      <Text style={styles.notificationItemTime}>
                        {notification.bookingId.startTime} -{" "}
                        {notification.bookingId.endTime}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.notificationItemStatus,
                        {
                          backgroundColor: getStatusColor(
                            notification.bookingId.status
                          ).bg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.notificationItemStatusText,
                          {
                            color: getStatusColor(notification.bookingId.status)
                              .text,
                          },
                        ]}
                      >
                        {getStatusText(notification.bookingId.status)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Notification Detail Modal */}
      <Modal
        visible={showNotificationDetail}
        transparent
        animationType="fade"
        onRequestClose={closeNotificationDetail}
      >
        <View style={styles.modalContainer}>
          <View style={styles.notificationDetailModal}>
            <View style={styles.notificationDetailHeader}>
              <Text style={styles.notificationDetailTitle}>
                Chi tiết thông báo
              </Text>
              <TouchableOpacity
                onPress={closeNotificationDetail}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {selectedNotification && (
              <ScrollView 
                style={styles.notificationDetailContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tên thông báo:</Text>
                  <Text style={styles.detailValue}>
                    {selectedNotification.notiName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mô tả:</Text>
                  <Text style={styles.detailValue}>
                    {selectedNotification.notiDescription}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dịch vụ:</Text>
                  <Text style={styles.detailValue}>
                    {selectedNotification.bookingId.serviceId.serviceName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Bác sĩ:</Text>
                  <Text style={styles.detailValue}>
                    {selectedNotification.bookingId.doctorName ||
                      "Chưa xác định"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thời gian:</Text>
                  <Text style={styles.detailValue}>
                    {selectedNotification.bookingId.startTime} -{" "}
                    {selectedNotification.bookingId.endTime}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Giá tiền:</Text>
                  <Text style={styles.detailValue}>
                    {formatPrice(
                      selectedNotification.bookingId.serviceId.price
                    )}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Trạng thái:</Text>
                  <View
                    style={[
                      styles.detailStatusBadge,
                      {
                        backgroundColor: getStatusColor(
                          selectedNotification.bookingId.status
                        ).bg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailStatusText,
                        {
                          color: getStatusColor(
                            selectedNotification.bookingId.status
                          ).text,
                        },
                      ]}
                    >
                      {getStatusText(selectedNotification.bookingId.status)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F766E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0F766E",
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoText: {
    color: "#0F766E",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    padding: 8,
    marginRight: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 1000,
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#FFFFFF",
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  drawerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLogoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  drawerLogoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerLogoTitle: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuItems: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
    fontWeight: "500",
  },
  chevronIcon: {
    marginLeft: 8,
  },
  submenu: {
    paddingLeft: 16,
    backgroundColor: "#F9FAFB",
    marginHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#0D9488",
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  submenuItemIcon: {
    marginRight: 8,
  },
  submenuItemText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  submenuItemLoading: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  submenuItemLoadingText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  appointmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D9488",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  authButtons: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "#0D9488",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  loginButtonText: {
    color: "#0D9488",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    backgroundColor: "#0D9488",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#DC2626",
    marginLeft: 12,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 16,
  },
  notificationModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notificationModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  notificationList: {
    maxHeight: height * 0.6,
  },
  emptyNotifications: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 12,
    textAlign: "center",
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notificationItemContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  notificationItemDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationItemService: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "500",
    marginBottom: 2,
  },
  notificationItemTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  notificationItemStatus: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationItemStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notificationDetailModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: width * 0.9,
    maxHeight: height * 0.8,
    padding: 20,
  },
  notificationDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notificationDetailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  notificationDetailContent: {
    maxHeight: height * 0.6,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  detailStatusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  detailStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Header;