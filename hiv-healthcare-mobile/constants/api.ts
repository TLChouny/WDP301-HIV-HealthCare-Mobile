export const BASE_URL = "http://172.168.99.20:5000/api";

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
};
