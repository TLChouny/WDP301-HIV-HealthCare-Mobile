// screens/Appointment.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Appointments } from "../types/appointment"
// interface Appointment {
//   id: string;
//   doctorName: string;
//   department: string;
//   date: Date;
//   time: string;
//   status: 'Pending' | 'Confirmed' | 'Cancelled';
// }

export default function Appointment() {
  const navigation = useNavigation();
  const [appointments] = useState<Appointments[]>([
    {
      id: '1',
      doctorName: 'Dr. Nguyen Van A',
      department: 'HIV/AIDS',
      date: new Date(2024, 3, 15),
      time: '09:00 AM',
      status: 'Confirmed'
    },
    {
      id: '2',
      doctorName: 'Dr. Tran Thi B',
      department: 'HIV/AIDS',
      date: new Date(2024, 3, 20),
      time: '02:30 PM',
      status: 'Pending'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '#34C759';
      case 'Pending':
        return '#FFD700';
      case 'Cancelled':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Appointments</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.bookButton}
            // onPress={() => navigation.navigate('AppointmentBooking')}
          >
            <Text style={styles.bookButtonText}>Book New Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentTitle}>
                    Dr. {appointment.doctorName}
                  </Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(appointment.status) }
                    ]}
                  >
                    {appointment.status}
                  </Text>
                </View>
                <Text style={styles.appointmentDetail}>
                  Department: {appointment.department}
                </Text>
                <Text style={styles.appointmentDetail}>
                  Date: {appointment.date.toLocaleDateString()}
                </Text>
                <Text style={styles.appointmentDetail}>
                  Time: {appointment.time}
                </Text>
                {appointment.status === 'Pending' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      // Handle cancel appointment
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No upcoming appointments. Book your first appointment now!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  appointmentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});