// screens/Home.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

const ResourceCard = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
    <TouchableOpacity>
      <Text style={styles.cardLink}>Tải xuống</Text>
    </TouchableOpacity>
  </View>
);

const BlogCard = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
    <TouchableOpacity>
      <Text style={styles.cardLink}>Đọc thêm</Text>
    </TouchableOpacity>
  </View>
);

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Hệ Thống Dịch Vụ Y Tế HIV</Text>
        <Text style={styles.heroDesc}>
          Hỗ trợ điều trị HIV toàn diện, đặt lịch khám dễ dàng, tra cứu xét nghiệm, và giảm kỳ thị.
        </Text>
        <TouchableOpacity style={styles.heroButton} onPress={() => console.log("Navigate to Appointment")}>
          <Text style={styles.heroButtonText}>Đặt Lịch Ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Educational Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài Liệu Giáo Dục</Text>
        <ResourceCard title="Hiểu Biết HIV" desc="Tài liệu cơ bản về HIV/AIDS và cách phòng ngừa." />
        <ResourceCard title="Sống Chung Với HIV" desc="Hành trình vượt qua kỳ thị và sống tích cực." />
        <ResourceCard title="Phác Đồ ARV" desc="Thông tin về các phác đồ điều trị HIV." />
      </View>

      {/* Blog Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blog Chia Sẻ</Text>
        <BlogCard title="Hành Trình Sống Chung" desc="Câu chuyện truyền cảm hứng từ bệnh nhân." />
        <BlogCard title="Giảm Kỳ Thị HIV" desc="Cách cộng đồng hỗ trợ người sống với HIV." />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  hero: { padding: 24, backgroundColor: "#dbeafe", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  heroTitle: { fontSize: 28, fontWeight: "700", color: "#2563eb", textAlign: "center" },
  heroDesc: { color: "#4b5563", textAlign: "center", marginTop: 8 },
  heroButton: { marginTop: 16, backgroundColor: "#2563eb", paddingVertical: 12, borderRadius: 8 },
  heroButtonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  section: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#1f2937", marginBottom: 16 },
  card: { padding: 16, backgroundColor: "#fff", borderRadius: 8, elevation: 2, marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#2563eb" },
  cardDesc: { color: "#4b5563", marginTop: 8 },
  cardLink: { marginTop: 8, color: "#f59e0b", fontWeight: "500" },
});