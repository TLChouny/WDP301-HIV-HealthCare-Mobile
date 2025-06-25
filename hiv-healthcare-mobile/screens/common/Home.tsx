import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Services: { type: string };
  Blog: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Screen dimensions
const { width } = Dimensions.get('window');

// Utility hook for in-view detection
const useInView = (ref: React.RefObject<ScrollView>, threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

// AnimatedElement component
interface AnimatedElementProps {
  children: React.ReactNode;
  style?: any;
  delay?: number;
  duration?: number;
  animationType?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'fade-in';
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  style,
  delay = 0,
  duration = 800,
  animationType = 'fade-up',
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(animationType.includes('fade-up') ? 20 : animationType.includes('fade-down') ? -20 : 0);
  const translateX = useSharedValue(
    animationType.includes('fade-left') ? -20 : animationType.includes('fade-right') ? 20 : 0
  );
  const scale = useSharedValue(animationType.includes('zoom-in') ? 0.9 : animationType.includes('zoom-out') ? 1.1 : 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration });
      translateX.value = withTiming(0, { duration });
      scale.value = withTiming(1, { duration });
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};

// ParallaxSection component
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  style?: any;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children, speed = 0.1, style }) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * speed }],
  }));

  return (
    <Animated.ScrollView style={[style, parallaxStyle]} onScroll={scrollHandler} scrollEventThrottle={16}>
      {children}
    </Animated.ScrollView>
  );
};

// StaggerContainer component
interface StaggerContainerProps {
  children: React.ReactNode;
  style?: any;
  staggerDelay?: number;
  initialDelay?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  style,
  staggerDelay = 100,
  initialDelay = 0,
}) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <AnimatedElement
            key={index}
            animationType="fade-up"
            delay={initialDelay + index * staggerDelay}
            duration={500}
          >
            {child}
          </AnimatedElement>
        ) : (
          child
        )
      )}
    </View>
  );
};

// Update image imports to use correct paths
const images = {
  doctor: require('../../assets/doingubacsi.png'),
  doctor2: require('../../assets/doingubacsi2.png'),
  // Add other images here if needed
};

// Main Home component
const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showAuthButtons, setShowAuthButtons] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Kiểm tra màn hình hiện tại để ẩn nút Đăng nhập/Đăng ký
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const currentRoute = navigation.getState().routes[navigation.getState().index].name;
      setShowAuthButtons(!['Login', 'Register', 'ForgotPassword'].includes(currentRoute));
    });
    return unsubscribe;
  }, [navigation]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const totalHeight = contentSize.height - layoutMeasurement.height;
    if (totalHeight > 0) {
      const progress = (contentOffset.y / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Login/Register Buttons */}
      {showAuthButtons && (
        <AnimatedElement animationType="fade-in" duration={800}>
          <View style={styles.header}>
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setModalVisible(true)}
              >
                <Icon name="chevron-down" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedElement>
      )}

      {/* Scroll Progress Indicator */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: `${scrollProgress}%` }]}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroBackground} />
          <View style={styles.heroContent}>
            <AnimatedElement animationType="fade-right" duration={1000}>
              <Text style={styles.heroTitle}>
                Tìm Bác Sĩ{'\n'}Chuyên Khoa HIV
              </Text>
              <AnimatedElement animationType="fade-up" delay={300} duration={800}>
                <Text style={styles.heroSubtitle}>
                  Đội ngũ y bác sĩ chuyên khoa giàu kinh nghiệm, tận tâm và không kỳ thị
                </Text>
              </AnimatedElement>
            </AnimatedElement>
            <AnimatedElement animationType="fade-left" delay={300} duration={1000}>
              <Image
                source={images.doctor}
                style={styles.heroImage}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            </AnimatedElement>
          </View>
        </View>

        {/* Services Icons Section */}
        <View style={styles.section}>
          <AnimatedElement animationType="fade-up" duration={800}>
            <Text style={styles.sectionTitle}>Dịch Vụ Nổi Bật</Text>
          </AnimatedElement>
          <View style={styles.servicesGrid}>
            {[
              {
                icon: <Icon name="file-text" size={30} color="#0D9488" />,
                title: 'Tư Vấn Xét Nghiệm',
                description: 'Tư vấn trước và sau xét nghiệm HIV miễn phí, bảo mật và không kỳ thị',
              },
              {
                icon: <Icon name="shield" size={30} color="#0D9488" />,
                title: 'Điều Trị ARV',
                description: 'Điều trị ARV hiện đại, theo dõi sát sao và hỗ trợ tuân thủ điều trị',
              },
              {
                icon: <Icon name="heart" size={30} color="#0D9488" />,
                title: 'Chăm Sóc Toàn Diện',
                description: 'Chăm sóc sức khỏe toàn diện cho người sống chung với HIV',
              },
              {
                icon: <Icon name="users" size={30} color="#0D9488" />,
                title: 'Hỗ Trợ Tâm Lý',
                description: 'Tư vấn tâm lý và hỗ trợ xã hội cho người nhiễm và gia đình',
              },
            ].map((service, index) => (
              <AnimatedElement
                key={index}
                animationType="zoom-in"
                delay={300 + index * 150}
                duration={800}
              >
                <View style={styles.serviceCard}>
                  <View style={styles.serviceIconContainer}>{service.icon}</View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
              </AnimatedElement>
            ))}
          </View>
        </View>

        {/* Home Care Section */}
        <ParallaxSection speed={0.1} style={styles.section}>
          <View style={styles.homeCareContent}>
            <AnimatedElement animationType="fade-right" duration={1000}>
              <Image
                source={images.doctor2}
                style={styles.homeCareImage}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            </AnimatedElement>
            <AnimatedElement animationType="fade-left" duration={800}>
              <Text style={styles.sectionTitle}>
                Mang Dịch Vụ Chăm Sóc Đến Tận Nhà Chỉ Với Một Cú Nhấp Chuột
              </Text>
              <AnimatedElement animationType="fade-up" delay={300} duration={800}>
                <Text style={styles.sectionDescription}>
                  Chúng tôi hiểu rằng việc di chuyển có thể khó khăn đối với một số bệnh nhân. Vì vậy, chúng tôi cung cấp dịch vụ chăm sóc tại nhà, tư vấn trực tuyến và giao thuốc tận nơi.
                </Text>
              </AnimatedElement>
              <AnimatedElement animationType="fade-up" delay={500} duration={800}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Icon name="phone" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Gọi Ngay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <Icon name="calendar" size={20} color="#0D9488" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Đặt Lịch</Text>
                  </TouchableOpacity>
                </View>
              </AnimatedElement>
            </AnimatedElement>
          </View>
        </ParallaxSection>

        {/* Experienced Staff Section */}
        <View style={styles.section}>
          <AnimatedElement animationType="fade-up" duration={800}>
            <Text style={styles.sectionTitle}>Đội Ngũ Y Bác Sĩ Giàu Kinh Nghiệm</Text>
          </AnimatedElement>
          <AnimatedElement animationType="fade-up" delay={200} duration={800}>
            <Text style={styles.sectionDescription}>
              Đội ngũ y bác sĩ của chúng tôi có nhiều năm kinh nghiệm trong lĩnh vực điều trị và chăm sóc HIV/AIDS. Họ không chỉ giỏi chuyên môn mà còn tận tâm, nhiệt tình và luôn đặt bệnh nhân lên hàng đầu.
            </Text>
          </AnimatedElement>
          <View style={styles.featuresGrid}>
            {[
              {
                icon: <Icon name="shield" size={24} color="#0D9488" />,
                title: 'Chuyên Môn Cao',
                description: 'Được đào tạo bài bản',
              },
              {
                icon: <Icon name="heart" size={24} color="#0D9488" />,
                title: 'Tận Tâm',
                description: 'Đặt bệnh nhân lên hàng đầu',
              },
              {
                icon: <Icon name="users" size={24} color="#0D9488" />,
                title: 'Không Kỳ Thị',
                description: 'Môi trường thân thiện',
              },
              {
                icon: <Icon name="info" size={24} color="#0D9488" />,
                title: 'Cập Nhật',
                description: 'Phương pháp điều trị mới nhất',
              },
            ].map((feature, index) => (
              <AnimatedElement
                key={index}
                animationType="fade-up"
                delay={400 + index * 150}
                duration={800}
              >
                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>{feature.icon}</View>
                  <View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              </AnimatedElement>
            ))}
          </View>
          <AnimatedElement animationType="fade-up" delay={800} duration={800}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>Tìm Hiểu Thêm</Text>
            </TouchableOpacity>
          </AnimatedElement>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
        >
          <Icon name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.dropdownModal}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.dropdownText}>HIV Screening & Prevention (Chưa biết tình trạng)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.dropdownText}>HIV Treatment & Monitoring (Đã xác định nhiễm)</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  registerButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  registerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    zIndex: 50,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0D9488',
  },
  heroSection: {
    backgroundColor: '#0F766E',
    paddingVertical: 32,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 60, // Thêm margin để tránh chồng lấn với header
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F766E',
    opacity: 0.1,
  },
  heroContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    marginBottom: 16,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  heroImage: {
    width: width - 32,
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2A44',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2A44',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  homeCareContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  homeCareImage: {
    width: width - 32,
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0D9488',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 6,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: (width - 40) / 2,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2A44',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: 'rgba(13,148,136,0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    width: 270,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1F2A44',
  },
});

export default Home;
export { AnimatedElement };