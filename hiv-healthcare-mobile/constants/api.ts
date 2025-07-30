export const BASE_URL = "https://wdp301-hiv-healthcare-be.onrender.com/api";

export const API_ENDPOINTS = {
  // ===== USER =====
  SIGNUP: "/users",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  VERIFY_OTP: "/users/verify-otp",
  RESEND_OTP: "/users/resend-otp",
  FORGOT_PASSWORD: "/users/forgot-password",
  VERIFY_RESET_OTP: "/users/verify-reset-otp",
  RESET_PASSWORD: "/users/reset-password",
  GET_ALL_USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  UPDATE_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `/users/${id}`,
  // Cate
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  // ===== SERVICE =====
  SERVICES: "/services",
  SERVICE_BY_ID: (id: string) => `/services/${id}`,
  SERVICES_BY_CATEGORY: (categoryId: string) =>
    `/services/category/${categoryId}`,
  // ===== BOOKING =====
  BOOKINGS: "/bookings",
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  BOOKINGS_BY_DOCTOR_NAME: (doctorName: string) =>
    `/bookings/doctor/${doctorName}`,
  BOOKINGS_BY_USER_ID: (userId: string) => `/bookings/user/${userId}`,
  BOOKINGS_CHECK: "/bookings/check",

  // ===== NOTIFICATION =====
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
  NOTIFICATIONS_BY_USER_ID: (userId: string) => `/notifications/user/${userId}`,
  //
  RESULTS_BY_USER_ID: (userId: string) => `/results/user/${userId}`,
  CREATE_PAYMENT_LINK: "/create-payment-link",
  GET_PAYMENT_BY_ORDER_CODE: (orderId: string | number) => `/order/${orderId}`,
  UPDATE_PAYMENT_STATUS: (orderCode: string | number) => `/order/${orderCode}`,
  GET_ALL_PAYMENTS: "/all",
};
