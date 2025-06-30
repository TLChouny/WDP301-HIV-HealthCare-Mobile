import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import type { User } from "../types/User";

// Cấu hình Axios mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10 giây
  withCredentials: true, // Hỗ trợ gửi cookie/credentials cho CORS
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGIN, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng nhập");
  }
};

export const logout = async (token: string) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGOUT, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng xuất thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng xuất");
  }
};

export const register = async (data: {
  userName?: string;
  email: string;
  password: string;
  phone_number?: string;
  role?: string;
}) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.SIGNUP, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng ký");
  }
};

export const verifyOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xác minh OTP thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xác minh OTP");
  }
};

export const resendOTP = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESEND_OTP, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Gửi lại OTP thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi gửi lại OTP");
  }
};

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Lấy danh sách người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi lấy danh sách người dùng");
  }
};

export const forgotPassword = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi yêu cầu đặt lại mật khẩu");
  }
};

export const verifyResetOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_RESET_OTP, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xác minh OTP đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xác minh OTP đặt lại mật khẩu");
  }
};

export const resetPassword = async (data: { resetToken: string; newPassword: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đặt lại mật khẩu");
  }
};

export const getUserById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.get(`${API_ENDPOINTS.USER_BY_ID(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Lấy thông tin người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi lấy thông tin người dùng");
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.put(`${API_ENDPOINTS.UPDATE_USER(id)}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Cập nhật người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi cập nhật người dùng");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await apiClient.delete(`${API_ENDPOINTS.DELETE_USER(id)}`);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Xóa người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xóa người dùng");
  }
};

export const createUser = async (data: Partial<User>) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }
    const res = await apiClient.post(API_ENDPOINTS.SIGNUP, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Thêm người dùng thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi thêm người dùng");
  }
};