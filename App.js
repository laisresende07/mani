import React from "react";
import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";
import AppLoading from 'expo-app-loading';
import RootContainer from "./src/routes";
import { StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthProvider from './src/contexts/auth';

console.disableYellowBox = true

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  if (!fontsLoaded) return <AppLoading />;
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <RootContainer />
      </AuthProvider>
    </NavigationContainer>
  );
}
