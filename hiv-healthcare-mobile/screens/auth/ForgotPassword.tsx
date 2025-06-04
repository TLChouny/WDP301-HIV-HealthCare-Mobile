import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../components/Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Vui lòng nhập email của bạn!',
        position: 'top',
        autoHide: true,
        visibilityTime: 3000,
      });
      return;
    }

    // TODO: Thêm logic gửi email reset password
    Toast.show({
      type: 'success',
      text1: 'Đã gửi email khôi phục mật khẩu!',
      position: 'top',
      autoHide: true,
      visibilityTime: 3000,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn..."
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Icon name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Gửi Yêu Cầu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={16} color="#0D9488" />
          <Text style={styles.backButtonText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2A44',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
  },
  inputIcon: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default ForgotPassword; 