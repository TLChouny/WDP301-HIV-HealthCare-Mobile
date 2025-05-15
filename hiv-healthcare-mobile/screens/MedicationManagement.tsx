import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  reminder: boolean;
}

const MedicationManagement = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    reminder: true,
  });

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([
        ...medications,
        { ...newMedication, id: Date.now().toString() },
      ]);
      setNewMedication({
        id: '',
        name: '',
        dosage: '',
        frequency: '',
        time: '',
        reminder: true,
      });
    }
  };

  const toggleReminder = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, reminder: !med.reminder } : med
      )
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Medication Management</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Medication</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medication Name</Text>
            <TextInput
              style={styles.input}
              value={newMedication.name}
              onChangeText={(text) =>
                setNewMedication({ ...newMedication, name: text })
              }
              placeholder="Enter medication name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={newMedication.dosage}
              onChangeText={(text) =>
                setNewMedication({ ...newMedication, dosage: text })
              }
              placeholder="Enter dosage"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <TextInput
              style={styles.input}
              value={newMedication.frequency}
              onChangeText={(text) =>
                setNewMedication({ ...newMedication, frequency: text })
              }
              placeholder="e.g., Once daily, Twice daily"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={newMedication.time}
              onChangeText={(text) =>
                setNewMedication({ ...newMedication, time: text })
              }
              placeholder="e.g., 8:00 AM, 8:00 PM"
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addMedication}>
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {medications.map((medication) => (
            <View key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <TouchableOpacity
                  onPress={() => deleteMedication(medication.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.medicationDetail}>
                Dosage: {medication.dosage}
              </Text>
              <Text style={styles.medicationDetail}>
                Frequency: {medication.frequency}
              </Text>
              <Text style={styles.medicationDetail}>
                Time: {medication.time}
              </Text>
              <View style={styles.reminderToggle}>
                <Text style={styles.reminderText}>Reminder</Text>
                <Switch
                  value={medication.reminder}
                  onValueChange={() => toggleReminder(medication.id)}
                />
              </View>
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
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  medicationCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  medicationDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
  },
});

export default MedicationManagement; 