import { API_ENDPOINTS, BASE_URL } from "../constants/api";
import { Notification } from "../types/Notification";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: number | string;
}

export const getNotificationsByUserId = async (
  userId: string
): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await fetch(
      `${BASE_URL}${API_ENDPOINTS.NOTIFICATIONS_BY_USER_ID(userId)}`
    );

    if (!response.ok)
      throw new Error("Failed to fetch notifications by user ID");

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
