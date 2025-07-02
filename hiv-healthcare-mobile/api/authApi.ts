import axios from "axios";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../constants/api";
import {
  getToken,
  removeToken,
  storeToken,
  storeUser,
} from "../utils/constant";
export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.LOGIN, data);

    if (res.data.token) {
      await storeToken(res.data.token);
    }
    if (res.data.user) {
      await storeUser(res.data.user);
    }

    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đăng nhập");
  }
};

export const logout = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Không tìm thấy token xác thực");
    }

    const res = await apiClient.post(
      API_ENDPOINTS.LOGOUT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await removeToken();

    return res.data;
  } catch (error: any) {
    await removeToken();

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

    // Lưu token và user info sau khi verify thành công
    if (res.data.token) {
      await storeToken(res.data.token);
    }
    if (res.data.user) {
      await storeUser(res.data.user);
    }

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

export const forgotPassword = async (data: { email: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Yêu cầu đặt lại mật khẩu thất bại"
      );
    }
    throw new Error(
      "Đã xảy ra lỗi không mong muốn khi yêu cầu đặt lại mật khẩu"
    );
  }
};

export const verifyResetOTP = async (data: { email: string; otp: string }) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.VERIFY_RESET_OTP, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Xác minh OTP đặt lại mật khẩu thất bại"
      );
    }
    throw new Error(
      "Đã xảy ra lỗi không mong muốn khi xác minh OTP đặt lại mật khẩu"
    );
  }
};

export const resetPassword = async (data: {
  resetToken: string;
  newPassword: string;
}) => {
  try {
    const res = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, data);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại"
      );
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi đặt lại mật khẩu");
  }
};
