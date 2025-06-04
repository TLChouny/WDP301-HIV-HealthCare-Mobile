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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/Navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MedicalRecords = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('history');
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [insuranceInfo, setInsuranceInfo] = useState({
    insuranceNumber: '',
    insuranceType: '',
    expiryDate: '',
    hospital: '',
  });

  // Mock data - In real app, this would come from an API
  const medicalHistory = [
    {
      id: '1',
      date: '2024-03-15',
      doctor: 'BS. Nguyễn Văn A',
      diagnosis: 'Viêm họng cấp',
      treatment: 'Kháng sinh, thuốc giảm đau',
      followUp: '2024-03-22',
    },
    {
      id: '2',
      date: '2024-02-28',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Cao huyết áp',
      treatment: 'Thuốc huyết áp',
      followUp: '2024-03-28',
    },
  ];

  const prescriptions = [
    {
      id: '1',
      date: '2024-03-15',
      doctor: 'BS. Nguyễn Văn A',
      medications: [
        { name: 'Amoxicillin 500mg', dosage: '1 viên x 3 lần/ngày', duration: '7 ngày' },
        { name: 'Paracetamol 500mg', dosage: '1 viên khi sốt', duration: '3 ngày' },
      ],
    },
  ];

  const diagnosisResults = [
    {
      id: '1',
      date: '2024-03-15',
      type: 'Xét nghiệm máu',
      doctor: 'BS. Nguyễn Văn A',
      results: 'Chỉ số bình thường',
      notes: 'Không có bất thường',
    },
  ];

  const renderMedicalHistory = () => (
    <View style={styles.section}>
      {medicalHistory.map((record) => (
        <View key={record.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{record.date}</Text>
            <Text style={styles.doctor}>{record.doctor}</Text>
          </View>
          <Text style={styles.label}>Chẩn đoán:</Text>
          <Text style={styles.contentText}>{record.diagnosis}</Text>
          <Text style={styles.label}>Điều trị:</Text>
          <Text style={styles.contentText}>{record.treatment}</Text>
          <Text style={styles.label}>Lịch tái khám:</Text>
          <Text style={styles.contentText}>{record.followUp}</Text>
        </View>
      ))}
    </View>
  );

  const renderPrescriptions = () => (
    <View style={styles.section}>
      {prescriptions.map((prescription) => (
        <View key={prescription.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{prescription.date}</Text>
            <Text style={styles.doctor}>{prescription.doctor}</Text>
          </View>
          <Text style={styles.label}>Đơn thuốc:</Text>
          {prescription.medications.map((med, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationName}>{med.name}</Text>
              <Text style={styles.medicationDosage}>Liều dùng: {med.dosage}</Text>
              <Text style={styles.medicationDuration}>Thời gian: {med.duration}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderDiagnosisResults = () => (
    <View style={styles.section}>
      {diagnosisResults.map((result) => (
        <View key={result.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{result.date}</Text>
            <Text style={styles.doctor}>{result.doctor}</Text>
          </View>
          <Text style={styles.label}>Loại xét nghiệm:</Text>
          <Text style={styles.contentText}>{result.type}</Text>
          <Text style={styles.label}>Kết quả:</Text>
          <Text style={styles.contentText}>{result.results}</Text>
          <Text style={styles.label}>Ghi chú:</Text>
          <Text style={styles.contentText}>{result.notes}</Text>
        </View>
      ))}
    </View>
  );

  const renderInsuranceInfo = () => (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>Thông tin bảo hiểm</Text>
          <TouchableOpacity onPress={() => setShowInsuranceModal(true)}>
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Số bảo hiểm:</Text>
        <Text style={styles.contentText}>{insuranceInfo.insuranceNumber || 'Chưa cập nhật'}</Text>
        <Text style={styles.label}>Loại bảo hiểm:</Text>
        <Text style={styles.contentText}>{insuranceInfo.insuranceType || 'Chưa cập nhật'}</Text>
        <Text style={styles.label}>Ngày hết hạn:</Text>
        <Text style={styles.contentText}>{insuranceInfo.expiryDate || 'Chưa cập nhật'}</Text>
        <Text style={styles.label}>Bệnh viện đăng ký:</Text>
        <Text style={styles.contentText}>{insuranceInfo.hospital || 'Chưa cập nhật'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Hồ sơ y tế</Text>
        <TouchableOpacity 
          style={styles.medicationButton}
          onPress={() => navigation.navigate('MedicationManagement')}
        >
          <Ionicons name="medkit-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Bệnh án
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'prescriptions' && styles.activeTab]}
          onPress={() => setActiveTab('prescriptions')}
        >
          <Text style={[styles.tabText, activeTab === 'prescriptions' && styles.activeTabText]}>
            Đơn thuốc
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'results' && styles.activeTab]}
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.tabText, activeTab === 'results' && styles.activeTabText]}>
            Kết quả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insurance' && styles.activeTab]}
          onPress={() => setActiveTab('insurance')}
        >
          <Text style={[styles.tabText, activeTab === 'insurance' && styles.activeTabText]}>
            Bảo hiểm
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'history' && renderMedicalHistory()}
        {activeTab === 'prescriptions' && renderPrescriptions()}
        {activeTab === 'results' && renderDiagnosisResults()}
        {activeTab === 'insurance' && renderInsuranceInfo()}
      </ScrollView>

      <Modal
        visible={showInsuranceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInsuranceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin bảo hiểm</Text>
            <TextInput
              style={styles.input}
              placeholder="Số bảo hiểm"
              value={insuranceInfo.insuranceNumber}
              onChangeText={(text) => setInsuranceInfo({ ...insuranceInfo, insuranceNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Loại bảo hiểm"
              value={insuranceInfo.insuranceType}
              onChangeText={(text) => setInsuranceInfo({ ...insuranceInfo, insuranceType: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Ngày hết hạn (YYYY-MM-DD)"
              value={insuranceInfo.expiryDate}
              onChangeText={(text) => setInsuranceInfo({ ...insuranceInfo, expiryDate: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Bệnh viện đăng ký"
              value={insuranceInfo.hospital}
              onChangeText={(text) => setInsuranceInfo({ ...insuranceInfo, hospital: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowInsuranceModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // TODO: Save insurance info to backend
                  setShowInsuranceModal(false);
                }}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  doctor: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  medicationItem: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  medicationDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
  medicationButton: {
    padding: 8,
  },
});

export default MedicalRecords; 