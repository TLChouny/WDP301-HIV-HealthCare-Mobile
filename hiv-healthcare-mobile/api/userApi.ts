import axios from "axios";
import { API_ENDPOINTS } from "../constants/api";
import apiClient from "../config/apiClient";
import { getToken } from "../utils/constant";
import { User } from "../types/User";

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.GET_ALL_USERS);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Lấy danh sách người dùng thất bại"
      );
    }
    throw new Error(
      "Đã xảy ra lỗi không mong muốn khi lấy danh sách người dùng"
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const token = await getToken();
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
      throw new Error(
        error.response?.data?.message || "Lấy thông tin người dùng thất bại"
      );
    }
    throw new Error(
      "Đã xảy ra lỗi không mong muốn khi lấy thông tin người dùng"
    );
  }
};

export const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const token = await getToken();
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
      throw new Error(
        error.response?.data?.message || "Cập nhật người dùng thất bại"
      );
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
      throw new Error(
        error.response?.data?.message || "Xóa người dùng thất bại"
      );
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi xóa người dùng");
  }
};

export const createUser = async (data: Partial<User>) => {
  try {
    const token = await getToken();
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
      throw new Error(
        error.response?.data?.message || "Thêm người dùng thất bại"
      );
    }
    throw new Error("Đã xảy ra lỗi không mong muốn khi thêm người dùng");
  }
};
