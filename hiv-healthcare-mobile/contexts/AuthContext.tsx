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
  getAllUsers as apiGetAllUsers,
  forgotPassword as apiForgotPassword,
  verifyResetOTP as apiVerifyResetOTP,
  resetPassword as apiResetPassword,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "../api/authApi";

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
  login: (data: { email: string; password: string }, navigation?: any) => Promise<void>;
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
  verifyResetOTP: (data: { email: string; otp: string }) => Promise<VerifyResetOTPResponse>;
  resetPassword: (data: { resetToken: string; newPassword: string }) => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  updateUser: (id: string, data: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token từ AsyncStorage:", token);
        if (token) {
          const userData = decodeAndValidateToken(token);
          setUser(userData);
        }
      } catch (error: any) {
        console.error("Lỗi khởi tạo xác thực:", error.message);
        await AsyncStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  if (loading) {
    return null; // Hoặc loading component
  }

  const login = async (data: { email: string; password: string }, navigation?: any) => {
    try {
      const res: { token: string } = await apiLogin(data);
      const token = res.token;
      if (!token || typeof token !== "string") throw new Error("Token không hợp lệ");
      console.log("Token sau khi đăng nhập:", token);
      const userData = decodeAndValidateToken(token);
      await AsyncStorage.setItem("token", token);
      setUser(userData);
      
      // Navigation logic
      if (navigation) {
        if (userData.role === "admin") {
          navigation.navigate("AdminDashboard");
        } else if (userData.role === "doctor") {
          navigation.navigate("DoctorDashboard");
        } else if (userData.role === "staff") {
          navigation.navigate("StaffDashboard");
        } else {
          navigation.navigate("UserDashboard");
        }
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      throw error;
    }
  };

  const logout = async (navigation?: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await apiLogout(token);
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      await AsyncStorage.removeItem("token");
      setUser(null);
      if (navigation) {
        navigation.navigate("Login");
      }
    }
  };

  const register = async (data: { userName?: string; email: string; password: string; phone_number?: string; role?: string }) => {
    try {
      await apiRegister(data);
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.message);
      throw error;
    }
  };

  const verifyOTP = async (data: { email: string; otp: string }) => {
    try {
      const res = await apiVerifyOTP(data);
      if (res.token) {
        const token = res.token;
        console.log("Token sau khi xác minh OTP:", token);
        const userData = decodeAndValidateToken(token);
        await AsyncStorage.setItem("token", token);
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

  const getAllUsers = async () => {
    try {
      const res = await apiGetAllUsers();
      return res;
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

  const verifyResetOTP = async (data: { email: string; otp: string }) => {
    try {
      const response = await apiVerifyResetOTP(data);
      return response;
    } catch (error: any) {
      console.error("Lỗi xác minh OTP đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const resetPassword = async (data: { resetToken: string; newPassword: string }) => {
    try {
      const response = await apiResetPassword(data);
      if (response.token) {
        await AsyncStorage.setItem("token", response.token);
        const userData = decodeAndValidateToken(response.token);
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Lỗi đặt lại mật khẩu:", error.message);
      throw error;
    }
  };

  const getUserById = async (id: string) => {
    try {
      const res = await apiGetUserById(id);
      return res;
    } catch (error: any) {
      console.error("Lỗi lấy thông tin người dùng:", error.message);
      throw error;
    }
  };

  const updateUser = async (id: string, data: any) => {
    try {
      const res = await apiUpdateUser(id, data);
      if (user && user._id === id) setUser(res);
    } catch (error: any) {
      console.error("Lỗi cập nhật người dùng:", error.message);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await apiDeleteUser(id);
      if (user && user._id === id) {
        console.log("Xóa người dùng hiện tại, xóa token");
        setUser(null);
        await AsyncStorage.removeItem("token");
      }
    } catch (error: any) {
      console.error("Lỗi xóa người dùng:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return ctx;
};