// screens/Appointment.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const doctors = [
    { id: "1", name: "BS. Nguyễn Văn A", specialty: "HIV/AIDS", schedule: "Thứ 2-6" },
    { id: "2", name: "BS. Trần Thị B", specialty: "HIV/AIDS", schedule: "Thứ 3-7" },
  ];

  const handleSubmit = () => {
    if (!selectedDate || !selectedDoctor) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng chọn ngày khám và bác sĩ.",
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Thành công",
      text2: "Đặt lịch thành công!",
    });
    console.log({ date: selectedDate, doctor: selectedDoctor, anonymous: isAnonymous });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Đặt Lịch Khám</Text>
      <View style={styles.card}>
        {/* Chọn ngày khám */}
        <Text style={styles.label}>Chọn ngày khám</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>{selectedDate ? selectedDate.toLocaleDateString() : "Chọn ngày"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        {/* Chọn bác sĩ */}
        <Text style={styles.label}>Chọn bác sĩ</Text>
        <View style={styles.input}>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              onPress={() => setSelectedDoctor(doctor.id)}
              style={[
                styles.doctorItem,
                selectedDoctor === doctor.id && { backgroundColor: "rgba(37, 99, 235, 0.1)" },
              ]}
            >
              <Text>{doctor.name} - {doctor.specialty}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Đăng ký ẩn danh */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)}>
            <View style={[styles.checkbox, isAnonymous && { backgroundColor: "#2563eb" }]} />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Đăng ký ẩn danh</Text>
        </View>

        {/* Nút đặt lịch */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Đặt Lịch</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#2563eb", textAlign: "center", marginBottom: 24 },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 8, elevation: 2 },
  label: { color: "#4b5563", fontWeight: "500", marginBottom: 8 },
  input: { padding: 12, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, marginBottom: 16 },
  doctorItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4 },
  checkboxLabel: { marginLeft: 8, color: "#4b5563" },
  button: { backgroundColor: "#2563eb", paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});