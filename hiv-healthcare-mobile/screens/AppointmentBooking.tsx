import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  reason: string;
  symptoms: string;
  priority: 'Normal' | 'Urgent';
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const AppointmentBooking = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');

  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    doctorName: '',
    department: '',
    reason: '',
    symptoms: '',
    priority: 'Normal',
    status: 'Pending',
  });

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setNewAppointment({ ...newAppointment, date });
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const timeString = time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setSelectedTime(timeString);
      setNewAppointment({ ...newAppointment, time: timeString });
    }
  };

  const handleBookAppointment = () => {
    if (!newAppointment.doctorName || !newAppointment.department || !newAppointment.date || !newAppointment.time) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      doctorName: newAppointment.doctorName!,
      department: newAppointment.department!,
      date: newAppointment.date!,
      time: newAppointment.time!,
      reason: newAppointment.reason || '',
      symptoms: newAppointment.symptoms || '',
      priority: newAppointment.priority as 'Normal' | 'Urgent',
      status: 'Pending',
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({
      doctorName: '',
      department: '',
      reason: '',
      symptoms: '',
      priority: 'Normal',
      status: 'Pending',
    });
    setSelectedTime('');

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Appointment booked successfully',
    });
  };

  const cancelAppointment = (id: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'Cancelled' } : apt
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Book Appointment</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Appointment</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doctor Name *</Text>
            <TextInput
              style={styles.input}
              value={newAppointment.doctorName}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, doctorName: text })
              }
              placeholder="Enter doctor's name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department *</Text>
            <TextInput
              style={styles.input}
              value={newAppointment.department}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, department: text })
              }
              placeholder="Enter department"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeButtonText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeButtonText}>
                {selectedTime || 'Select time'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reason for Visit</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAppointment.reason}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, reason: text })
              }
              placeholder="Enter reason for visit"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symptoms</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAppointment.symptoms}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, symptoms: text })
              }
              placeholder="Describe your symptoms"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  newAppointment.priority === 'Normal' && styles.priorityButtonActive,
                ]}
                onPress={() =>
                  setNewAppointment({ ...newAppointment, priority: 'Normal' })
                }
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    newAppointment.priority === 'Normal' && styles.priorityButtonTextActive,
                  ]}
                >
                  Normal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.priorityButton,
                  newAppointment.priority === 'Urgent' && styles.priorityButtonActive,
                ]}
                onPress={() =>
                  setNewAppointment({ ...newAppointment, priority: 'Urgent' })
                }
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    newAppointment.priority === 'Urgent' && styles.priorityButtonTextActive,
                  ]}
                >
                  Urgent
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookAppointment}
          >
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Appointments</Text>
          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>
                  Dr. {appointment.doctorName}
                </Text>
                <Text
                  style={[
                    styles.statusBadge,
                    appointment.status === 'Confirmed' && styles.statusConfirmed,
                    appointment.status === 'Cancelled' && styles.statusCancelled,
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
              <Text style={styles.appointmentDetail}>
                Priority: {appointment.priority}
              </Text>
              {appointment.reason && (
                <Text style={styles.appointmentDetail}>
                  Reason: {appointment.reason}
                </Text>
              )}
              {appointment.status === 'Pending' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelAppointment(appointment.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#666',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  bookButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
    backgroundColor: '#FFD700',
    color: '#000',
  },
  statusConfirmed: {
    backgroundColor: '#34C759',
    color: '#fff',
  },
  statusCancelled: {
    backgroundColor: '#FF3B30',
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
});

export default AppointmentBooking; 