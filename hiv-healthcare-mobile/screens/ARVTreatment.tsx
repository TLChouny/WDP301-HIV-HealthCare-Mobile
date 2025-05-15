// screens/ARVTreatment.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function ARVTreatment() {
  const treatmentPlan = {
    startDate: "01/03/2025",
    medication: "Tenofovir/Emtricitabine + Dolutegravir",
    dosage: "1 viên/ngày",
    nextVisit: "15/06/2025",
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Phác Đồ Điều Trị ARV</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Ngày bắt đầu: {treatmentPlan.startDate}</Text>
        <Text style={styles.text}>Thuốc: {treatmentPlan.medication}</Text>
        <Text style={styles.text}>Liều lượng: {treatmentPlan.dosage}</Text>
        <Text style={styles.textBold}>Lần khám tiếp theo: {treatmentPlan.nextVisit}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#2563eb", textAlign: "center", marginBottom: 24 },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 8, elevation: 2 },
  text: { color: "#4b5563" },
  textBold: { color: "#4b5563", fontWeight: "500" },
});