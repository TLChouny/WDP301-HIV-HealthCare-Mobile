export type Booking = {
  _id: string;
  bookingCode: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceId: any; // object khi populate hoặc string id
  serviceName?: string;
  bookingDate: string; // ISO string
  startTime: string;
  endTime?: string;
  duration?: number;
  doctorName?: string;
  originalPrice?: number;
  notes?: string;
  meetLink?: string;
  currency?: string;
  status: 'cancel' | 'cancelled' | 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'checked-out' | 'reviewed';
  isAnonymous?: boolean;
  userId?: any; // object khi populate hoặc string id
  updatedAt?: string;
};
