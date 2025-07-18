import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../components/Navigation";

interface Blog {
  _id: string;
  blogTitle: string;
  blogContent?: string;
  blogImage?: string;
  blogAuthor?: string;
  categoryId: string | { _id: string; categoryName: string };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  categoryName: string;
  categoryDescription?: string;
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const postsPerPage = 6;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Blog'>>();

  // Mock API functions - replace with actual API calls
  const getAllBlogs = async (): Promise<Blog[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBlogs: Blog[] = [
          {
            _id: "1",
            blogTitle: "Hiểu biết cơ bản về HIV/AIDS",
            blogContent:
              "HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Virus này tấn công hệ thống miễn dịch của cơ thể, làm suy yếu khả năng chống lại các bệnh nhiễm trùng và một số loại ung thư.",
            blogImage:
              "https://via.placeholder.com/300x200/0D9488/FFFFFF?text=HIV+Education",
            blogAuthor: "BS. Nguyễn Văn A",
            categoryId: "1",
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z",
          },
          {
            _id: "2",
            blogTitle: "Phương pháp điều trị ARV hiện đại",
            blogContent:
              "Liệu pháp kháng virus ngược (ARV) là phương pháp điều trị chính cho HIV. Các thuốc ARV không thể chữa khỏi HIV nhưng có thể kiểm soát virus và giúp người nhiễm HIV sống một cuộc sống khỏe mạnh.",
            blogImage:
              "https://via.placeholder.com/300x200/10B981/FFFFFF?text=ARV+Treatment",
            blogAuthor: "BS. Trần Thị B",
            categoryId: "2",
            createdAt: "2024-01-10T00:00:00Z",
            updatedAt: "2024-01-10T00:00:00Z",
          },
          {
            _id: "3",
            blogTitle: "Tầm quan trọng của xét nghiệm HIV",
            blogContent:
              "Xét nghiệm HIV là bước đầu tiên quan trọng để phát hiện sớm và điều trị kịp thời. Việc xét nghiệm định kỳ giúp bảo vệ bản thân và cộng đồng.",
            blogImage:
              "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=HIV+Testing",
            blogAuthor: "BS. Lê Văn C",
            categoryId: "1",
            createdAt: "2024-01-05T00:00:00Z",
            updatedAt: "2024-01-05T00:00:00Z",
          },
          {
            _id: "4",
            blogTitle: "Hỗ trợ tâm lý cho người nhiễm HIV",
            blogContent:
              "Hỗ trợ tâm lý đóng vai trò quan trọng trong việc giúp người nhiễm HIV thích ứng với tình trạng bệnh và duy trì chất lượng cuộc sống tốt.",
            blogImage:
              "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Mental+Health",
            blogAuthor: "ThS. Nguyễn Thị D",
            categoryId: "3",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
        ];
        resolve(mockBlogs);
      }, 1000);
    });
  };

  const getAllCategories = async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCategories: Category[] = [
          { _id: "1", categoryName: "Giáo dục sức khỏe" },
          { _id: "2", categoryName: "Điều trị" },
          { _id: "3", categoryName: "Hỗ trợ tâm lý" },
          { _id: "4", categoryName: "Nghiên cứu" },
        ];
        resolve(mockCategories);
      }, 500);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogData, categoryData] = await Promise.all([
          getAllBlogs(),
          getAllCategories(),
        ]);
        setBlogs(blogData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu blog/category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter((post) => {
      const matchesSearch =
        post.blogTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.blogContent?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false);

      let matchesCategory = false;
      if (selectedCategory === "all") {
        matchesCategory = true;
      } else if (typeof post.categoryId === "string") {
        matchesCategory = post.categoryId === selectedCategory;
      } else if (typeof post.categoryId === "object") {
        matchesCategory = post.categoryId._id === selectedCategory;
      }

      return matchesSearch && matchesCategory;
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogs, searchTerm, selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const [blogData, categoryData] = await Promise.all([
        getAllBlogs(),
        getAllCategories(),
      ]);
      setBlogs(blogData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Lỗi khi refresh dữ liệu:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const getCategoryName = (
    categoryId: string | { _id: string; categoryName: string }
  ): string => {
    if (typeof categoryId === "object" && categoryId !== null) {
      return categoryId.categoryName;
    } else {
      const found = categories.find((cat) => cat._id === categoryId);
      return found ? found.categoryName : "";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const categoryOptions = [
    { value: "all", label: "Tất cả" },
    ...categories.map((cat) => ({ value: cat._id, label: cat.categoryName })),
  ];

  const selectedCategoryLabel =
    categoryOptions.find((cat) => cat.value === selectedCategory)?.label ||
    "Tất cả";

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  const renderBlogCard = ({ item, index }: { item: Blog; index: number }) => {
    return (
      <View style={styles.blogCard}>
        <TouchableOpacity
          style={styles.blogCardContent}
          activeOpacity={0.8}
          onPress={() => {
            // Navigate to blog detail - implement based on your navigation
            console.log("Navigate to blog detail:", item._id);
          }}
        >
          {item.blogImage && (
            <Image
              source={{ uri: item.blogImage }}
              style={styles.blogImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.blogCardBody}>
            <Text style={styles.blogTitle} numberOfLines={2}>
              {item.blogTitle}
            </Text>
            <Text style={styles.blogContent} numberOfLines={3}>
              {item.blogContent?.slice(0, 120) || ""}
              {item.blogContent && item.blogContent.length > 120 ? "..." : ""}
            </Text>
            <View style={styles.blogMeta}>
              <Text style={styles.blogAuthor}>
                {item.blogAuthor || "Ẩn danh"}
              </Text>
              <Text style={styles.blogDate}>{formatDate(item.createdAt)}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>
                {getCategoryName(item.categoryId)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePages = pages.filter((page) => {
      if (totalPages <= 5) return true;
      if (page === 1 || page === totalPages) return true;
      if (page >= currentPage - 1 && page <= currentPage + 1) return true;
      return false;
    });

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={currentPage === 1 ? "#9CA3AF" : "#0D9488"}
          />
        </TouchableOpacity>

        {visiblePages.map((page, index) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.paginationButton,
              currentPage === page && styles.paginationButtonActive,
            ]}
            onPress={() => setCurrentPage(page)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.paginationButtonText,
                currentPage === page && styles.paginationButtonTextActive,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={currentPage === totalPages ? "#9CA3AF" : "#0D9488"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D9488" />
          <Text style={styles.loadingText}>Đang tải bài viết...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0D9488"]}
            tintColor="#0D9488"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blog</Text>
          <Text style={styles.headerSubtitle}>
            Cập nhật kiến thức, chia sẻ thông tin và câu chuyện về sức khỏe và
            cộng đồng.
          </Text>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#9CA3AF"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchTerm("")}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryPicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryButtonText}>
              {selectedCategoryLabel}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#0D9488" />
          </TouchableOpacity>
        </View>

        {/* Blog Grid */}
        {currentPosts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Không có bài viết nào</Text>
            <Text style={styles.emptyDescription}>
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentPosts}
            renderItem={renderBlogCard}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.blogRow}
            contentContainerStyle={styles.blogGrid}
            scrollEnabled={false}
          />
        )}

        {/* Pagination */}
        {renderPagination()}
      </ScrollView>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryPicker(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categoryOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    selectedCategory === item.value &&
                      styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(item.value);
                    setShowCategoryPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedCategory === item.value &&
                        styles.categoryOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedCategory === item.value && (
                    <Ionicons name="checkmark" size={20} color="#0D9488" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 1,
  },
  searchFilterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#374151",
  },
  clearButton: {
    padding: 4,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDFA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#0D9488",
    gap: 8,
    minWidth: 120,
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#0D9488",
    fontWeight: "500",
  },
  blogGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  blogRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  blogCard: {
    width: cardWidth,
  },
  blogCardContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: 120,
  },
  blogCardBody: {
    padding: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    lineHeight: 22,
  },
  blogContent: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  blogMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  blogAuthor: {
    fontSize: 12,
    color: "#9CA3AF",
    flex: 1,
  },
  blogDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 12,
    color: "#0D9488",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationButtonActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  paginationButtonTextActive: {
    color: "#FFFFFF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  categoryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryOptionSelected: {
    backgroundColor: "#F0FDFA",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  categoryOptionTextSelected: {
    color: "#0D9488",
    fontWeight: "600",
  },
});

export default BlogPage;
