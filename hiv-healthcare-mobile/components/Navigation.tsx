import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import Home from '../screens/Home';
import PatientProfile from '../screens/PatientProfile';
import MedicationManagement from '../screens/MedicationManagement';
import Appointment from '../screens/Appointment';
import Doctor from '../screens/Doctor';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Medications') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Appointments') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Doctors') {
              iconName = focused ? 'people' : 'people-outline';
            } else {
              iconName = 'home';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Profile" component={PatientProfile} />
        <Tab.Screen name="Medications" component={MedicationManagement} />
        <Tab.Screen name="Appointments" component={Appointment} />
        <Tab.Screen name="Doctors" component={Doctor} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
