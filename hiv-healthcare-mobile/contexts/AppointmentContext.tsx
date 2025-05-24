import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AppointmentType {
  id: string;
  doctorName: string;
  date: Date;
  time: string;
  reason: string;
  symptoms: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

interface AppointmentContextType {
  appointments: AppointmentType[];
  addAppointment: (appointment: AppointmentType) => void;
  cancelAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointment must be used within AppointmentProvider');
  return context;
};

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);

  const addAppointment = (appointment: AppointmentType) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'Cancelled' } : apt)
    );
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, cancelAppointment }}>
      {children}
    </AppointmentContext.Provider>
  );
};