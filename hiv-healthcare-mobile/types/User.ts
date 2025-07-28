export type User = {
  _id: string;
  userName: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  avatar?: string;
  userDescription?: string;
  categoryId?: any; // object khi populate hoặc string id
  otp?: string;
  otpExpires?: string;
  resetOtp?: string;
  resetOtpExpires?: string;
  isVerified: boolean;
  accessToken?: string;
  tokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  dayOfWeek?: string[];
  startDay?: string;
  endDay?: string;
  startTimeInDay?: string;
  endTimeInDay?: string;
  role: string;
  dateOfBirth: string;
};

export interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  description: string;
  fileUrl: string;
  status?: "pending" | "approved" | "rejected";
}

export interface Experience {
  _id?: string;
  hospital: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional
  description?: string;
  status?: "pending" | "approved" | "rejected";
}
