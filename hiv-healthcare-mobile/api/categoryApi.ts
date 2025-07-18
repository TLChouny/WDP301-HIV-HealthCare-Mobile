import axios from "axios";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../constants/api";
import {
  getToken,
  removeToken,
  storeToken,
  storeUser,
} from "../utils/constant";
import { Category } from "../types/Category";
import { Service } from "../types/Service";
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
    throw new Error("An unexpected error occurred while fetching categories");
  }
};
export const getCategoryByIdApi = async (id: string): Promise<Category> => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
    throw new Error("An unexpected error occurred while fetching categories");
  }
};
export const getServicesByCategoryId = async (
  categoryId: string
): Promise<Service[]> => {
  try {
    const res = await apiClient.get(
      API_ENDPOINTS.SERVICES_BY_CATEGORY(categoryId)
    );
    return res.data.services || res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch services by category"
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching services by category"
    );
  }
};
export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const res = await apiClient.get(API_ENDPOINTS.SERVICE_BY_ID(id));
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch service by ID"
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching service by ID"
    );
  }
};
