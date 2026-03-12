// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShowCodeScreen from './screens/ShowCodeScreen';
import ScanScreen from './screens/ScanScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ConfirmPaymentScreen from './screens/ConfirmPaymentScreen';

const Stack = createStackNavigator();

export default function App() {
  // TODO: Add logic here to check if user is already logged in
  const isLoggedIn = false; // For now, we'll force login

  return (
    <NavigationContainer>
      <Stack.Navigator 
        // We can hide the header for our simple app
        screenOptions={{ headerShown: false }}
        // This tells the app which screen to show first
        initialRouteName={isLoggedIn ? "Dashboard" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen 
          name="ShowCode" 
          component={ShowCodeScreen} 
          // This makes it slide up from the bottom, which looks nice
          options={{ presentation: 'modal' }} 
        />
        <Stack.Screen 
        name="Scan" 
        component={ScanScreen}
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen 
    name="ConfirmPayment" 
    component={ConfirmPaymentScreen}
    options={{ presentation: 'modal' }} 
  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// We don't need any styles in this file anymore!