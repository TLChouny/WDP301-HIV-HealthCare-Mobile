import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PatientData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  bloodType: string;
  insuranceNumber: string;
  insuranceProvider: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship: string;
  medicalHistory: string;
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
  lastCheckup: string;
  nextAppointment: string;
}

const PatientProfile = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: '',
    bloodType: '',
    insuranceNumber: '',
    insuranceProvider: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    lastCheckup: '',
    nextAppointment: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Patient Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={patientData.fullName}
              onChangeText={(text) =>
                setPatientData({ ...patientData, fullName: text })
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              value={patientData.dateOfBirth}
              onChangeText={(text) =>
                setPatientData({ ...patientData, dateOfBirth: text })
              }
              editable={isEditing}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              value={patientData.gender}
              onChangeText={(text) =>
                setPatientData({ ...patientData, gender: text })
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={patientData.phoneNumber}
              onChangeText={(text) =>
                setPatientData({ ...patientData, phoneNumber: text })
              }
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={patientData.email}
              onChangeText={(text) =>
                setPatientData({ ...patientData, email: text })
              }
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.address}
              onChangeText={(text) =>
                setPatientData({ ...patientData, address: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance Provider</Text>
            <TextInput
              style={styles.input}
              value={patientData.insuranceProvider}
              onChangeText={(text) =>
                setPatientData({ ...patientData, insuranceProvider: text })
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance Number</Text>
            <TextInput
              style={styles.input}
              value={patientData.insuranceNumber}
              onChangeText={(text) =>
                setPatientData({ ...patientData, insuranceNumber: text })
              }
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Name</Text>
            <TextInput
              style={styles.input}
              value={patientData.emergencyContact}
              onChangeText={(text) =>
                setPatientData({ ...patientData, emergencyContact: text })
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput
              style={styles.input}
              value={patientData.emergencyPhone}
              onChangeText={(text) =>
                setPatientData({ ...patientData, emergencyPhone: text })
              }
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relationship</Text>
            <TextInput
              style={styles.input}
              value={patientData.emergencyRelationship}
              onChangeText={(text) =>
                setPatientData({ ...patientData, emergencyRelationship: text })
              }
              editable={isEditing}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Type</Text>
            <TextInput
              style={styles.input}
              value={patientData.bloodType}
              onChangeText={(text) =>
                setPatientData({ ...patientData, bloodType: text })
              }
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.medicalHistory}
              onChangeText={(text) =>
                setPatientData({ ...patientData, medicalHistory: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.allergies}
              onChangeText={(text) =>
                setPatientData({ ...patientData, allergies: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Medications</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.currentMedications}
              onChangeText={(text) =>
                setPatientData({ ...patientData, currentMedications: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chronic Conditions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.chronicConditions}
              onChangeText={(text) =>
                setPatientData({ ...patientData, chronicConditions: text })
              }
              editable={isEditing}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Checkup Date</Text>
            <TextInput
              style={styles.input}
              value={patientData.lastCheckup}
              onChangeText={(text) =>
                setPatientData({ ...patientData, lastCheckup: text })
              }
              editable={isEditing}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Next Appointment</Text>
            <TextInput
              style={styles.input}
              value={patientData.nextAppointment}
              onChangeText={(text) =>
                setPatientData({ ...patientData, nextAppointment: text })
              }
              editable={isEditing}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  saveButton: {
    backgroundColor: '#34C759',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PatientProfile; 