import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../constants/api";
import { Result } from "../types/Result";

export const getResultsByUserId = async (userId: string): Promise<Result[]> => {
  const res = await apiClient.get(API_ENDPOINTS.RESULTS_BY_USER_ID(userId));
  return res.data;
};
