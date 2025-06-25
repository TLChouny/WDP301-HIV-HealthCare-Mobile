export type Notification = {
  _id: string;
  notiName: string;
  notiDescription?: string;
  bookingId: any; // object khi populate hoặc string id
  createdAt: string;
  updatedAt: string;
};