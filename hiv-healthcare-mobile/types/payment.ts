export type PaymentStatus = "pending" | "success" | "failed" | "cancelled";

export interface Payment {
  _id?: string; // MongoDB document ID
  paymentID: string;
  orderCode: number;
  orderName: string;
  amount: number;
  description?: string;
  status: PaymentStatus;
  returnUrl?: string;
  cancelUrl?: string;
  checkoutUrl?: string;
  qrCode?: string;
  bookingIds?: (string | { _id: string })[]; // hỗ trợ populate luôn nếu cần
  createdAt?: string; // ISO string (Date.toISOString())
  updatedAt?: string;
}
