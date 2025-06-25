export type User = {
  _id: string;
  userName: string;
  email?: string;
  password?: string;
  phone_number?: string;
  gender?: 'male' | 'female' | 'other';
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
};
