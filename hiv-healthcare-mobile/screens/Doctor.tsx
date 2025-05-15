// screens/Doctor.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  schedule: string;
}

const DoctorCard = ({ doctor }: { doctor: Doctor }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{doctor.name}</Text>
    <Text style={styles.cardDesc}>Chuyên môn: {doctor.specialty}</Text>
    <Text style={styles.cardDesc}>Lịch làm việc: {doctor.schedule}</Text>
  </View>
);

export default function Doctor() {
  const [search, setSearch] = useState<string>("");

  const doctors: Doctor[] = [
    { id: "1", name: "BS. Nguyễn Văn A", specialty: "HIV/AIDS", schedule: "Thứ 2 - Thứ 6: 8:00 - 17:00" },
    { id: "2", name: "BS. Trần Thị B", specialty: "HIV/AIDS", schedule: "Thứ 3 - Thứ 7: 9:00 - 18:00" },
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản Lý Thông Tin Bác Sĩ</Text>
      <TextInput
        placeholder="Tìm kiếm bác sĩ..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#2563eb", textAlign: "center", marginBottom: 24 },
  input: { padding: 12, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, marginBottom: 16 },
  card: { padding: 16, backgroundColor: "#fff", borderRadius: 8, elevation: 2, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#2563eb" },
  cardDesc: { color: "#4b5563", marginTop: 4 },
});