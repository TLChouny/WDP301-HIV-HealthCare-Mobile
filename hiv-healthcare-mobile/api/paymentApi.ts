import axios from "axios";
import { Payment } from "../types/payment";
import { API_ENDPOINTS, BASE_URL } from "../constants/api";

export const createPaymentLink = async (
  paymentData: Omit<Payment, "_id" | "createdAt" | "updatedAt">
): Promise<Payment> => {
  const res = await axios.post(
    `${BASE_URL}${API_ENDPOINTS.CREATE_PAYMENT_LINK}`,
    paymentData
  );

  if (res.data.error === 0) {
    return {
      ...paymentData,
      checkoutUrl: res.data.data.checkoutUrl,
      qrCode: res.data.data.qrCode,
      orderCode: res.data.data.orderCode,
      status: "pending",
    };
  } else {
    throw new Error(res.data.message || "Tạo thanh toán thất bại");
  }
};
