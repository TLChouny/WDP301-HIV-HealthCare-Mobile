// screens/TestResults.tsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function TestResults() {
  const results = [
    { id: "1", date: "15/05/2025", type: "HIV Test", result: "Negative" },
    { id: "2", date: "10/04/2025", type: "CD4 Count", result: "450 cells/mm³" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kết Quả Xét Nghiệm</Text>
      <View style={styles.card}>
        {results.map((result) => (
          <View key={result.id} style={styles.resultItem}>
            <Text style={styles.resultText}>Ngày: {result.date}</Text>
            <Text style={styles.resultText}>Loại: {result.type}</Text>
            <Text style={styles.resultTextBold}>Kết quả: {result.result}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  title: { fontSize: 24, fontWeight: "600", color: "#2563eb", textAlign: "center", marginBottom: 24 },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 8, elevation: 2 },
  resultItem: { marginBottom: 16 },
  resultText: { color: "#4b5563" },
  resultTextBold: { color: "#4b5563", fontWeight: "500" },
});