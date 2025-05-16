export interface Appointments {
  id: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}
