import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types/User';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../components/Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PatientProfile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User>({
    userName: 'nguyenvana',
    email: 'nguyenvana@example.com',
    password: '123456',
    phone_number: '0123456789',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?img=1',
    categoryId: '',
    userDescription: '',
    otp: '',
    otpExpires: '',
    isVerified: true,
    token: '',
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.fullName}>{user.userName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Giới tính</Text>
          <TextInput
            style={styles.input}
            value={user.gender}
            editable={isEditing}
            onChangeText={(text) => handleChange('gender', text)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={user.phone_number}
            editable={isEditing}
            onChangeText={(text) => handleChange('phone_number', text)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            editable={isEditing}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={user.address}
            editable={isEditing}
            onChangeText={(text) => handleChange('address', text)}
            multiline
            numberOfLines={3}
          />
        </View>

        {isEditing && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.buttonText}>{isEditing ? 'Lưu' : 'Chỉnh sửa'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.medicalRecordsButton]}
          onPress={() => navigation.navigate('MedicalRecords')}
        >
          <Ionicons name="medical-outline" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Hồ sơ y tế</Text>
        </TouchableOpacity>
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
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  medicalRecordsButton: {
    backgroundColor: '#007AFF',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
