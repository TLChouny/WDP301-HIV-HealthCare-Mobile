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

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        
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
          style={[styles.tab, activeTab === 'results' && styles.activeTab]}
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.tabText, activeTab === 'results' && styles.activeTabText]}>
            Kết quả
          </Text>
        </TouchableOpacity>
        
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'history' && renderMedicalHistory()}
        {activeTab === 'results' && renderDiagnosisResults()}
      </ScrollView>

      <Modal
        visible={showInsuranceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInsuranceModal(false)}
      >
        
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D9488',
    textAlign: 'center',
    flex: 1,
  },
  medicationButton: {
    position: 'absolute',
    right: 20,
    top: 24,
    padding: 8,
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F4F8FB',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#0D9488',
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  section: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E7EF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  doctor: {
    fontSize: 15,
    color: '#0D9488',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    fontWeight: '500',
  },
  contentText: {
    fontSize: 16,
    color: '#222',
    marginTop: 2,
    fontWeight: '400',
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
});

export default MedicalRecords; 