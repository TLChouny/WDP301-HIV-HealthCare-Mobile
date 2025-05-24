import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useAppointment } from '../contexts/AppointmentContext';
import { Ionicons } from '@expo/vector-icons'; // Nếu bạn dùng Expo, hoặc dùng react-native-vector-icons

const AppointmentBooking = () => {
  const { addAppointment } = useAppointment();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [doctorValue, setDoctorValue] = useState('');
  const [doctorItems] = useState([
    { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
    { label: 'Trần Thị B', value: 'Trần Thị B' },
    { label: 'Lê Văn C', value: 'Lê Văn C' },
  ]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    doctorName: '',
    reason: '',
    symptoms: '',
  });

  // Handle date selection
  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time selection
  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      const timeString = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
      setSelectedTime(timeString);
    }
  };

  // Book new appointment
  const bookAppointment = () => {
    const date = selectedDate;
    const time = selectedTime;

    if (!newAppointment.doctorName || !date || !time) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng điền đầy đủ các trường bắt buộc',
      });
      return;
    }

    addAppointment({
      id: Date.now().toString(),
      doctorName: newAppointment.doctorName,
      date: date,
      time: time,
      reason: newAppointment.reason,
      symptoms: newAppointment.symptoms,
      status: 'Pending',
    });

    setNewAppointment({
      doctorName: '',
      reason: '',
      symptoms: '',
    });
    setSelectedTime('');

    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Đặt lịch thành công',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Đặt lịch khám</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tạo lịch hẹn mới</Text>

          {/* Dropdown chọn bác sĩ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bác sĩ *</Text>
            <TouchableOpacity
              style={styles.dateTimeButtonCustom}
              onPress={() => setShowDoctorModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={20} color="#34C759" style={{ marginRight: 10 }} />
              <Text style={[styles.dateTimeButtonText, !doctorValue && { color: '#aaa' }]}>
                {doctorValue || 'Chọn bác sĩ'}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showDoctorModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDoctorModal(false)}
          >
            <View style={{
              flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'
            }}>
              <View style={{
                backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%'
              }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Chọn bác sĩ</Text>
                <FlatList
                  data={doctorItems}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      style={{ paddingVertical: 12 }}
                      onPress={() => {
                        setDoctorValue(item.value);
                        setNewAppointment({ ...newAppointment, doctorName: item.value });
                        setShowDoctorModal(false);
                      }}
                    >
                      <Text style={{ fontSize: 16, color: doctorValue === item.value ? '#34C759' : '#222' }}>
                        {item.label}
                      </Text>
                    </Pressable>
                  )}
                />
                <TouchableOpacity onPress={() => setShowDoctorModal(false)} style={{ marginTop: 10 }}>
                  <Text style={{ color: '#007AFF', textAlign: 'right' }}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày khám *</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButtonCustom,
                showDatePicker && styles.dateTimeButtonActive
              ]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={22} color="#34C759" style={{ marginRight: 10 }} />
              <Text style={[
                styles.dateTimeButtonText,
                !selectedDate && { color: '#aaa' }
              ]}>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={{ backgroundColor: '#fff' }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giờ khám *</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButtonCustom,
                showTimePicker && styles.dateTimeButtonActive
              ]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={22} color="#34C759" style={{ marginRight: 10 }} />
              <Text style={[
                styles.dateTimeButtonText,
                !selectedTime && { color: '#aaa' }
              ]}>
                {selectedTime || 'Chọn giờ'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ backgroundColor: '#fff' }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lý do khám</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAppointment.reason}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, reason: text })
              }
              placeholder="Nhập lý do khám"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Triệu chứng</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newAppointment.symptoms}
              onChangeText={(text) =>
                setNewAppointment({ ...newAppointment, symptoms: text })
              }
              placeholder="Nhập triệu chứng"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={bookAppointment}
          >
            <Text style={styles.bookButtonText}>Đặt lịch</Text>
          </TouchableOpacity>
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
  dateTimeButtonCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f6fff8',
    marginBottom: 4,
    shadowColor: '#34C759',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dateTimeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  dateTimeButtonText: {
    fontSize: 17,
    color: '#222',
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fff',
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginTop: 2,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 36,
    minHeight: 36,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
    height: 36,
  },
});

export default AppointmentBooking;