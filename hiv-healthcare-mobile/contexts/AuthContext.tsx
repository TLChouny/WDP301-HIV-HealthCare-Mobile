// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
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
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
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
    if (!token || typeof token !== "string") {
      throw new Error("Token không hợp lệ hoặc trống");
    }

    const decoded: JwtPayload = jwtDecode(token);
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
  };

  const initializeAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        const userData = decodeAndValidateToken(token);
        setUser(userData);
      } else {
        const storedUser = await getUser();
        if (storedUser) await removeToken();
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

  useEffect(() => {
    initializeAuth();
  }, []);

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

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await apiLogin(data);
      const token = await getToken();
      if (!token) throw new Error("Không thể lưu token");
      const userData = decodeAndValidateToken(token);
      setUser(userData);
      await storeUser(userData);
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      setUser(null);
      await removeToken();
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
    await apiRegister(data);
  };

  const verifyOTP = async (data: { email: string; otp: string }) => {
    await apiVerifyOTP(data);
    const token = await getToken();
    if (token) {
      const userData = decodeAndValidateToken(token);
      setUser(userData);
    }
  };

  const resendOTP = async (data: { email: string }) => {
    await apiResendOTP(data);
  };

  const getAllUsers = async (): Promise<User[]> => {
    const response = await apiGetAllUsers();
    return response.data || response;
  };

  const forgotPassword = async (data: { email: string }) => {
    await apiForgotPassword(data);
  };

  const verifyResetOTP = async (data: {
    email: string;
    otp: string;
  }): Promise<VerifyResetOTPResponse> => {
    const response = await apiVerifyResetOTP(data);
    return response;
  };

  const resetPassword = async (data: {
    resetToken: string;
    newPassword: string;
  }) => {
    const response = await apiResetPassword(data);
    if (response.token) {
      await storeToken(response.token);
      const userData = decodeAndValidateToken(response.token);
      setUser(userData);
      await storeUser(userData);
    }
  };

  const getUserById = async (id: string): Promise<User> => {
    const response = await apiGetUserById(id);
    return response.data || response;
  };

  const updateUser = async (id: string, data: any) => {
    const response = await apiUpdateUser(id, data);
    if (user && user._id === id) {
      const updatedUser = response.data || response;
      setUser(updatedUser);
      await storeUser(updatedUser);
    }
    return response;
  };

  const deleteUser = async (id: string) => {
    await apiDeleteUser(id);
    if (user && user._id === id) {
      setUser(null);
      await removeToken();
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
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

  if (loading) return null;

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return context;
};
