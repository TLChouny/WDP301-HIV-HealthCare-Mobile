// App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Navigation from "./components/Navigation";
import { AppointmentProvider } from './contexts/AppointmentContext';
import { StatusBar } from 'react-native';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Tạo một Provider tổng hợp để quản lý tất cả các context
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <AppointmentProvider>
        {children}
      </AppointmentProvider>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => {
  return (
    <AppProviders>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <Navigation />
      <Toast />
    </AppProviders>
  );
}

export default App;