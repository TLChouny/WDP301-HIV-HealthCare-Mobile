import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/common/Home';
import PatientProfile from '../screens/patient/PatientProfile';
import Appointment from '../screens/appointment/Appointment';
import AppointmentBooking from '../screens/appointment/AppointmentBooking';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import OnlineConsultation from '../screens/appointment/OnlineConsultation';
import MedicalRecords from '../screens/medical/MedicalRecords';

// Define navigation types
export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AppointmentBooking: undefined;
  OnlineConsultation: undefined;
  MedicalRecords: undefined;
  PatientProfile: undefined;
  MedicationManagement: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointment: undefined;
  MedicalRecords: undefined;
  Profile: undefined;
  MedicationManagement: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointment') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MedicalRecords') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'MedicationManagement') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0D9488',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Appointment" component={Appointment} />
      <Tab.Screen name="MedicalRecords" component={MedicalRecords} />
      <Tab.Screen name="Profile" component={PatientProfile} />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};

// Root Navigator
export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={AuthStackNavigator} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} />
        <Stack.Screen name="OnlineConsultation" component={OnlineConsultation} />
        <Stack.Screen name="MedicalRecords" component={MedicalRecords} />
        <Stack.Screen name="PatientProfile" component={PatientProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
