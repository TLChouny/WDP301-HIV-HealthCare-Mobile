import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../components/Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OnlineConsultation = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [doctorValue, setDoctorValue] = useState('');
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [consultationType, setConsultationType] = useState('');

  const [doctorItems] = useState([
    { label: 'BS. Nguyễn Văn A', value: 'BS. Nguyễn Văn A' },
    { label: 'BS. Trần Thị B', value: 'BS. Trần Thị B' },
    { label: 'BS. Lê Văn C', value: 'BS. Lê Văn C' },
  ]);

  const [newConsultation, setNewConsultation] = useState({
    doctorName: '',
    reason: '',
    symptoms: '',
    type: '',
    notes: '',
  });

  const consultationTypes = [
    { label: 'Video Call', value: 'video' },
    { label: 'Voice Call', value: 'voice' },
    { label: 'Chat', value: 'chat' },
  ];

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
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
    }
  };

  const bookConsultation = () => {
    if (!newConsultation.doctorName || !selectedDate || !selectedTime || !consultationType) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng điền đầy đủ các trường bắt buộc',
      });
      return;
    }

    // TODO: Thêm logic xử lý đặt lịch tư vấn
    Toast.show({
      type: 'success',
      text1: 'Thành công',
      text2: 'Đặt lịch tư vấn thành công',
    });

    // Reset form
    setNewConsultation({
      doctorName: '',
      reason: '',
      symptoms: '',
      type: '',
      notes: '',
    });
    setSelectedTime('');
    setConsultationType('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Đặt lịch tư vấn trực tuyến</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin tư vấn</Text>

          {/* Chọn bác sĩ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bác sĩ tư vấn *</Text>
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

          {/* Modal chọn bác sĩ */}
          <Modal
            visible={showDoctorModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDoctorModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Chọn bác sĩ</Text>
                <FlatList
                  data={doctorItems}
                  keyExtractor={item => item.value}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.modalItem}
                      onPress={() => {
                        setDoctorValue(item.value);
                        setNewConsultation({ ...newConsultation, doctorName: item.value });
                        setShowDoctorModal(false);
                      }}
                    >
                      <Text style={[
                        styles.modalItemText,
                        doctorValue === item.value && styles.modalItemTextSelected
                      ]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  )}
                />
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowDoctorModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Chọn loại tư vấn */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình thức tư vấn *</Text>
            <View style={styles.consultationTypeContainer}>
              {consultationTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.consultationTypeButton,
                    consultationType === type.value && styles.consultationTypeButtonSelected
                  ]}
                  onPress={() => {
                    setConsultationType(type.value);
                    setNewConsultation({ ...newConsultation, type: type.value });
                  }}
                >
                  <Ionicons
                    name={
                      type.value === 'video' ? 'videocam-outline' :
                      type.value === 'voice' ? 'call-outline' :
                      'chatbubble-outline'
                    }
                    size={24}
                    color={consultationType === type.value ? '#fff' : '#34C759'}
                  />
                  <Text style={[
                    styles.consultationTypeText,
                    consultationType === type.value && styles.consultationTypeTextSelected
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chọn ngày */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày tư vấn *</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButtonCustom,
                showDatePicker && styles.dateTimeButtonActive
              ]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={22} color="#34C759" style={{ marginRight: 10 }} />
              <Text style={styles.dateTimeButtonText}>
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

          {/* Chọn giờ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giờ tư vấn *</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButtonCustom,
                showTimePicker && styles.dateTimeButtonActive
              ]}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="time-outline" size={22} color="#34C759" style={{ marginRight: 10 }} />
              <Text style={styles.dateTimeButtonText}>
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

          {/* Lý do tư vấn */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lý do tư vấn</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newConsultation.reason}
              onChangeText={(text) =>
                setNewConsultation({ ...newConsultation, reason: text })
              }
              placeholder="Nhập lý do tư vấn"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Triệu chứng */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Triệu chứng</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newConsultation.symptoms}
              onChangeText={(text) =>
                setNewConsultation({ ...newConsultation, symptoms: text })
              }
              placeholder="Nhập triệu chứng"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Ghi chú */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ghi chú thêm</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newConsultation.notes}
              onChangeText={(text) =>
                setNewConsultation({ ...newConsultation, notes: text })
              }
              placeholder="Nhập ghi chú thêm (nếu có)"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={bookConsultation}
          >
            <Text style={styles.bookButtonText}>Đặt lịch tư vấn</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
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
  },
  dateTimeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  consultationTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  consultationTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#34C759',
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f6fff8',
  },
  consultationTypeButtonSelected: {
    backgroundColor: '#34C759',
  },
  consultationTypeText: {
    marginTop: 8,
    color: '#34C759',
    fontSize: 12,
    fontWeight: '500',
  },
  consultationTypeTextSelected: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#222',
  },
  modalItemTextSelected: {
    color: '#34C759',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#007AFF',
    textAlign: 'right',
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
});

export default OnlineConsultation; 