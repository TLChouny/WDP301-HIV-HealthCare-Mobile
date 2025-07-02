import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/User";

import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  verifyOTP as apiVerifyOTP,
  resendOTP as apiResendOTP,
  forgotPassword as apiForgotPassword,
  verifyResetOTP as apiVerifyResetOTP,
  resetPassword as apiResetPassword,
} from "../api/authApi";

import {
  getAllUsers as apiGetAllUsers,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "../api/userApi";
import {
  getToken,
  getUser,
  removeToken,
  storeToken,
  storeUser,
} from "../utils/constant";

interface JwtPayload {
  user?: User;
  id?: string;
  _id?: string;
  userName?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  exp?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    data: { email: string; password: string },
    navigation?: any
  ) => Promise<void>;
  logout: (navigation?: any) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isStaff: boolean;
  register: (data: {
    userName?: string;
    email: string;
    password: string;
    phone_number?: string;
    role?: string;
  }) => Promise<void>;
  verifyOTP: (data: { email: string; otp: string }) => Promise<void>;
  resendOTP: (data: { email: string }) => Promise<void>;
  getAllUsers: () => Promise<User[]>;
  forgotPassword: (data: { email: string }) => Promise<void>;
  verifyResetOTP: (data: {
    email: string;
    otp: string;
  }) => Promise<VerifyResetOTPResponse>;
  resetPassword: (data: {
    resetToken: string;
    newPassword: string;
  }) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface VerifyResetOTPResponse {
  resetToken: string;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeAndValidateToken = (token: string): User => {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Token không hợp lệ hoặc trống");
      }

      const decoded: JwtPayload = jwtDecode(token);
      console.log("Decoded token:", decoded);

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token đã hết hạn");
      }

      const userData = decoded.user || {
        _id: decoded.id || decoded._id || "unknown",
        userName: decoded.userName || "Unknown User",
        email: decoded.email || "no-email@example.com",
        role: decoded.role || "user",
        isVerified: decoded.isVerified ?? false,
        createdAt: decoded.createdAt || new Date().toISOString(),
        updatedAt: decoded.updatedAt || new Date().toISOString(),
      };

      return userData as User;
    } catch (error: any) {
      console.error("Lỗi xác thực token:", error.message);
      throw error;
    }
  };

  const initializeAuth = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      console.log("Token từ AsyncStorage:", token);

      if (token) {
        // Validate token
        const userData = decodeAndValidateToken(token);
        setUser(userData);
      } else {
        // Nếu không có token, kiểm tra user data đã lưu
        const storedUser = await getUser();
        if (storedUser) {
          // Nếu có user data nhưng không có token, clear data
          await removeToken();
        }
        setUser(null);
      }
    } catch (error: any) {
      console.error("Lỗi khởi tạo xác thực:", error.message);
      await removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await getToken();
      if (token) {
        const userData = decodeAndValidateToken(token);
        setUser(userData);
        await storeUser(userData);
      }
    } catch (error: any) {
      console.error("Lỗi refresh user data:", error.message);
      await removeToken();
      setUser(null);
    }
  };

  const navigateBasedOnRole = (userData: User, navigation?: any) => {
    if (!navigation) return;

    switch (userData.role) {
      case "admin":
        navigation.navigate("AdminDashboard");
        break;
      case "doctor":
        navigation.navigate("DoctorDashboard");
        break;
      case "staff":
        navigation.navigate("StaffDashboard");
        break;
      default:
        navigation.navigate("MainTabs");
        break;
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading) {
    return null;
  }

  const login = async (
    data: { email: string; password: string },
    navigation?: any
  ) => {
    try {
      setLoading(true);
      const response = await apiLogin(data);

      const token = await getToken();
      if (!token) throw new Error("Không thể lưu token");

      const userData = decodeAndValidateToken(token);
      setUser(userData);

      navigateBasedOnRole(userData, navigation);
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigation?: any) => {
    try {
      setLoading(true);
      await apiLogout();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      setUser(null);
      if (navigation) {
        navigation.navigate("Login");
      }
      setLoading(false);
    }
  };

  const register = async (data: {
    userName?: string;
    email: string;
    password: string;
    phone_number?: string;
    role?: string;
  }) => {
    try {
      await apiRegister(data);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.message);
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otp: string }) => {
    try {
      const response = await apiVerifyOTP(data);

      const token = await getToken();
      if (token) {
        const userData = decodeAndValidateToken(token);
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Lỗi xác minh OTP:", error.message);
      throw error;
    }
  };

  const resendOTP = async (data: { email: string }) => {
    try {
      await apiResendOTP(data);
    } catch (error: any) {
      console.error("Lỗi gửi lại OTP:", error.message);
      throw error;
    }
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await apiGetAllUsers();
      return response.data || response;
    } catch (error: any) {
      console.error("Lỗi lấy danh sách người dùng:", error.message);
      throw error;
    }
  };

  const forgotPassword = async (data: { email: string }) => {
    try {
       await apiForgotPassword(data);
    } catch (error: any) {
      console.error("Lỗi yêu cầu đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const verifyResetOTP = async (data: {
    email: string;
    otp: string;
  }): Promise<VerifyResetOTPResponse> => {
    try {
      const response = await apiVerifyResetOTP(data);
      return response;
    } catch (error: any) {
      console.error("Lỗi xác minh OTP đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const resetPassword = async (data: {
    resetToken: string;
    newPassword: string;
  }) => {
    try {
      const response = await apiResetPassword(data);

      if (response.token) {
        await storeToken(response.token);
        const userData = decodeAndValidateToken(response.token);
        setUser(userData);
        await storeUser(userData);
      }
    } catch (error: any) {
      console.error("Lỗi đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    try {
      const response = await apiGetUserById(id);
      return response.data || response;
    } catch (error: any) {
      console.error("Lỗi lấy thông tin người dùng:", error.message);
      throw error;
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      const response = await apiUpdateUser(id, data);

      if (user && user._id === id) {
        const updatedUser = response.data || response;
        setUser(updatedUser);
        await storeUser(updatedUser);
      }

      return response;
    } catch (error: any) {
      console.error("Lỗi cập nhật người dùng:", error.message);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiDeleteUser(id);

      if (user && user._id === id) {
        console.log("Xóa người dùng hiện tại, thực hiện logout");
        setUser(null);
        await removeToken();
      }
    } catch (error: any) {
      console.error("Lỗi xóa người dùng:", error.message);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isDoctor: user?.role === "doctor",
    isStaff: user?.role === "staff",
    register,
    verifyOTP,
    resendOTP,
    getAllUsers,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    getUserById,
    updateUser,
    deleteUser,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
