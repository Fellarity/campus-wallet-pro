// screens/LoginScreen.js

import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, StatusBar, Alert 
} from 'react-native'; // All required components and StyleSheet are imported
import { saveToken } from '../utils/storage';

// --- Configuration ---
// Ensure this IP is correct and your Django server is running on 0.0.0.0:8000
const YOUR_COMPUTER_IP = '192.168.1.3'; 
const API_URL = `http://${YOUR_COMPUTER_IP}:8000/api/token/`;
// --- End Configuration ---

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both email/phone and password.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        await saveToken(data.access);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Could not connect to the server. Is the IP correct?');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Status Bar text is light for the dark background */}
<StatusBar barStyle="dark-content" />
      
      <View style={styles.formContainer}>
        {/* NEW: Logo now sits safely INSIDE the content view */}
        <View style={styles.logoContainer}> 
            <Text style={styles.logo}>SYNK WALLET</Text>
        </View>
        
        <Text style={styles.welcomeTitle}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to your SYNK WALLET account.</Text>

        {/* Simplified Log In Tab */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Email/Phone Input */}
        <Text style={styles.inputLabel}>Email or Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        {/* Password Input */}
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        
        {/* Main Log In Button */}
        <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
          <Text style={styles.mainButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
      
    </KeyboardAvoidingView>
  );
}

// --- DARK MODE CENTERED STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Primary Dark Background
    paddingHorizontal: 20,
    // KEY CHANGE 1: Center everything vertically
    justifyContent: 'center', 
  },
  header: {
    // Make the header float at the top for the initial design
    position: 'absolute', 
    top: 50,
    left: 20,
    zIndex: 10,
  },
  formContainer: {
    width: '100%', 
    maxWidth: 400, 
    // KEY CHANGE 2: Center the entire block in the middle
    alignSelf: 'center', 
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff', 
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center',
    marginTop: 20, 
  },
  subtitle: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 30,
  },
  
  // --- Simplified Tab Styling ---
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e', 
    borderRadius: 8,
    marginBottom: 30,
    padding: 3,
    width: '50%', 
    alignSelf: 'center', // Center the tab bar itself
  },
  activeTab: {
    flex: 1,
    backgroundColor: '#333', 
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#fff', 
  },

  // --- Input Styling ---
  inputLabel: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#1e1e1e', // Input field background
    color: '#fff', // Input text color
    borderWidth: 1,
    borderColor: '#333', // Subtle dark border
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#007bff', 
    textAlign: 'left',
    marginBottom: 25,
  },
  
  // --- Main Button ---
  mainButton: {
    backgroundColor: '#007bff', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});