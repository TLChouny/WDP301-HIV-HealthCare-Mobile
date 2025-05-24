// App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Navigation from "./components/Navigation";
import { AppointmentProvider } from './contexts/AppointmentContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppointmentProvider>
      <Navigation />
      <Toast />
      </AppointmentProvider>
    </SafeAreaProvider>
  );
}