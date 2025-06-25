export type Service = {
  _id: string;
  serviceName: string;
  serviceDescription?: string;
  categoryId: any; // object khi populate hoặc string id
  serviceImage?: string;
  duration?: number;
  price: number;
  createdAt: string;
  updatedAt: string;
};

