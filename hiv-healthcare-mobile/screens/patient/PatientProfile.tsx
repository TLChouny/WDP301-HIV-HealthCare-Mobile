import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../types/User';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../components/Navigation';

// Mock data for appointments and history
const mockUpcomingAppointments = [
  {
    id: '1',
    date: '2024-06-10',
    time: '09:00',
    doctor: 'BS. Nguyễn Văn B',
    service: 'Khám tổng quát',
    status: 'confirmed',
  },
  {
    id: '2',
    date: '2024-06-15',
    time: '14:00',
    doctor: 'BS. Trần Thị C',
    service: 'Tư vấn HIV',
    status: 'pending',
  },
];

const mockHistory = [
  {
    id: '3',
    date: '2024-05-01',
    time: '10:00',
    doctor: 'BS. Nguyễn Văn B',
    service: 'Khám tổng quát',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-04-20',
    time: '15:00',
    doctor: 'BS. Trần Thị C',
    service: 'Tư vấn HIV',
    status: 'completed',
  },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PatientProfile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User>({
    _id: '1',
    userName: 'nguyenvana',
    email: 'nguyenvana@example.com',
    password: '123456',
    phone_number: '0123456789',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: 'https://i.pravatar.cc/150?img=1',
    categoryId: '',
    userDescription: '',
    otp: '',
    otpExpires: '',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (field: keyof User, value: string) => {
    setUser({ ...user, [field]: value });
  };

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    const updatedUser: User = {
      ...user,
      password: newPassword || user.password,
    };
    setUser(updatedUser);
    setIsEditing(false);
    // TODO: Gọi API để cập nhật dữ liệu người dùng
    console.log('Thông tin cập nhật:', updatedUser);
  };

  // Helper for gender display
  const getGenderLabel = (gender?: string) => {
    if (gender === 'male') return 'Nam';
    if (gender === 'female') return 'Nữ';
    if (gender === 'other') return 'Khác';
    return '';
  };

  // Render item for appointment/history
  const renderAppointmentItem = ({ item }: { item: any }) => (
    <View style={styles.appointmentItem}>
      <MaterialIcons name="event-available" size={20} color="#0D9488" style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.appointmentText}>{item.date} {item.time} - {item.service}</Text>
        <Text style={styles.appointmentSubText}>Bác sĩ: {item.doctor}</Text>
      </View>
      <Text style={[styles.status, item.status === 'confirmed' ? styles.statusConfirmed : item.status === 'pending' ? styles.statusPending : styles.statusCompleted]}>
        {item.status === 'confirmed' ? 'Đã xác nhận' : item.status === 'pending' ? 'Chờ xác nhận' : 'Hoàn thành'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Thông tin cá nhân */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.fullName}>{user.userName}</Text>
          </View>
          <View style={styles.infoRow}><Text style={styles.label}>Giới tính:</Text><Text style={styles.value}>{getGenderLabel(user.gender)}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Số điện thoại:</Text><Text style={styles.value}>{user.phone_number}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{user.email}</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>Địa chỉ:</Text><Text style={styles.value}>{user.address}</Text></View>
          {isEditing && (
            <>
              <TextInput
                style={styles.input}
                value={user.userName}
                onChangeText={(text) => handleChange('userName', text)}
                placeholder="Tên người dùng"
              />
              <TextInput
                style={styles.input}
                value={user.phone_number}
                onChangeText={(text) => handleChange('phone_number', text)}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={user.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Địa chỉ"
                multiline
                numberOfLines={3}
              />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mật khẩu mới"
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Xác nhận mật khẩu"
                secureTextEntry
              />
            </>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
          </TouchableOpacity>
        </View>

        {/* Lịch hẹn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch hẹn sắp tới</Text>
          {mockUpcomingAppointments.length === 0 ? (
            <Text style={styles.emptyText}>Không có lịch hẹn nào.</Text>
          ) : (
            <FlatList
              data={mockUpcomingAppointments}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Lịch sử khám */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch sử khám</Text>
          {mockHistory.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có lịch sử khám.</Text>
          ) : (
            <FlatList
              data={mockHistory}
              renderItem={renderAppointmentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* Hồ sơ bệnh án */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hồ sơ bệnh án</Text>
          <TouchableOpacity
            style={[styles.button, styles.medicalRecordsButton]}
            onPress={() => navigation.navigate('MedicalRecords')}
          >
            <Ionicons name="medical-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Xem hồ sơ bệnh án</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 28,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0D9488',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: '#444',
    width: 110,
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  medicalRecordsButton: {
    backgroundColor: '#007AFF',
    marginTop: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  appointmentSubText: {
    fontSize: 13,
    color: '#666',
  },
  status: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: 8,
    minWidth: 80,
    textAlign: 'center',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
    color: '#047857',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  statusCompleted: {
    backgroundColor: '#E0E7FF',
    color: '#3730A3',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 8,
  },
});
