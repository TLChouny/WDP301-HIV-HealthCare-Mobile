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
import AppointmentBooking from '../screens/AppointmentBooking';
import Login from '../screens/Login';
import Register from '../screens/Register';

// Define types for navigation
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AppointmentBooking: undefined;
  Home: undefined;
  PatientProfile: undefined;
  MedicationManagement: undefined;
  Appointment: undefined;
  Doctor: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'PatientProfile') iconName = focused ? 'person' : 'person-outline';
          else if (route.name === 'MedicationManagement') iconName = focused ? 'medical' : 'medical-outline';
          else if (route.name === 'Appointment') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Doctor') iconName = focused ? 'people' : 'people-outline';
          else iconName = 'home';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="PatientProfile" component={PatientProfile} options={{ title: 'Hồ sơ' }} />
      <Tab.Screen name="MedicationManagement" component={MedicationManagement} options={{ title: 'Thuốc' }} />
      <Tab.Screen name="Appointment" component={Appointment} options={{ title: 'Đặt lịch' }} />
      <Tab.Screen name="Doctor" component={Doctor} options={{ title: 'Bác sĩ' }} />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
