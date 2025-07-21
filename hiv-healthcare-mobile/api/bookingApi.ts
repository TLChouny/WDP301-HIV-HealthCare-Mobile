import axios from "axios";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";
import { Booking } from "../types/Booking";
import apiClient from "../config/apiClient";

export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await apiClient.get(API_ENDPOINTS.BOOKINGS);
  return res.data;
};

export const getBookingsByUserId = async (
  userId: string
): Promise<Booking[]> => {
  const res = await apiClient.get(`${API_ENDPOINTS.BOOKINGS}/user/${userId}`);
  return res.data;
};

export const createBooking = async (
  booking: Partial<Booking>
): Promise<Booking> => {
  const res = await apiClient.post(API_ENDPOINTS.BOOKINGS, booking);
  return res.data;
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const res = await apiClient.get(API_ENDPOINTS.BOOKING_BY_ID(id));
  return res.data;
};

export const updateBooking = async (
  id: string,
  data: Partial<Booking>
): Promise<Booking> => {
  const res = await apiClient.put(API_ENDPOINTS.BOOKING_BY_ID(id), data);
  return res.data;
};

export const deleteBooking = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.BOOKING_BY_ID(id));
};
export const getBookingsByDoctorName = async (
  doctorName: string
): Promise<Booking[]> => {
  console.log("Doctor Name:", doctorName);
  const encodedName = encodeURIComponent(doctorName);
  console.log(
    "Request URL:",
    `${BASE_URL}${API_ENDPOINTS.BOOKINGS_BY_DOCTOR_NAME(encodedName)}`
  );
  try {
    const res = await apiClient.get(
      API_ENDPOINTS.BOOKINGS_BY_DOCTOR_NAME(encodedName)
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    throw error;
  }
};
