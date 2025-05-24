import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/Home';
import PatientProfile from '../screens/PatientProfile';
import MedicationManagement from '../screens/MedicationManagement';
import Appointment from '../screens/Appointment';
import Doctor from '../screens/Doctor';
import AppointmentBooking from '../screens/AppointmentBooking'; // Thêm dòng này

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Trang chủ') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Hồ sơ') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'Medications') iconName = focused ? 'medical' : 'medical-outline';
          else if (route.name === 'Đặt lịch') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Bác sĩ') iconName = focused ? 'people' : 'people-outline';
          else iconName = 'home';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Trang chủ" component={Home} />
      <Tab.Screen name="Hồ sơ" component={PatientProfile} />
      <Tab.Screen name="Medications" component={MedicationManagement} />
      <Tab.Screen name="Đặt lịch" component={Appointment} />
      <Tab.Screen name="Bác sĩ" component={Doctor} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
