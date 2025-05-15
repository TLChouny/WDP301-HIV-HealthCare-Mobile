// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
// import type { IconProps } from "@expo/vector-icons/build/createIconSet";
import Toast from "react-native-toast-message";

// Import các màn hình
import Home from "./screens/Home";
import Appointment from "./screens/Appointment";
import Doctor from "./screens/Doctor";
import TestResults from "./screens/TestResults";
import ARVTreatment from "./screens/ARVTreatment";



// Khai báo kiểu cho Tab Navigator
type TabParamList = {
  Home: undefined;
  Appointment: undefined;
  Doctor: undefined;
  TestResults: undefined;
  ARVTreatment: undefined;
};

// Khai báo kiểu cho iconName
type FontAwesomeIconNames =
  | "home"
  | "calendar"
  | "user-md"
  | "file-text"
  | "medkit"
  | "circle";

const Tab = createBottomTabNavigator<TabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }: { color: string; size: number }) => {
            let iconName: FontAwesomeIconNames; // Khai báo kiểu cụ thể
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Appointment") iconName = "calendar";
            else if (route.name === "Doctor") iconName = "user-md";
            else if (route.name === "TestResults") iconName = "file-text";
            else if (route.name === "ARVTreatment") iconName = "medkit";
            else iconName = "circle";
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{ title: "Trang Chủ" }} />
        <Tab.Screen name="Appointment" component={Appointment} options={{ title: "Đặt Lịch" }} />
        <Tab.Screen name="Doctor" component={Doctor} options={{ title: "Bác Sĩ" }} />
        <Tab.Screen name="TestResults" component={TestResults} options={{ title: "Kết Quả" }} />
        <Tab.Screen name="ARVTreatment" component={ARVTreatment} options={{ title: "Phác Đồ" }} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}