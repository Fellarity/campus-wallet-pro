// screens/ConfirmPaymentScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator } from 'react-native';
import { getToken } from '../utils/storage';

// Your IP and API endpoint
const YOUR_COMPUTER_IP = '192.168.1.3';
const API_URL = `http://${YOUR_COMPUTER_IP}:8000/api/pay/`;

export default function ConfirmPaymentScreen({ route, navigation }) {
  // Get the scanned data from the route params
  const { qrData } = route.params; 
  const [isLoading, setIsLoading] = useState(false);

  // A simple check in case the QR code was bad
  if (!qrData || !qrData.vendor_id || !qrData.amount) {
    Alert.alert("Invalid QR Code", "This QR code is not a valid payment code.", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
    return null;
  }

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      // 1. Get the user's saved token
      const token = await getToken();
      if (!token) {
        Alert.alert("Error", "You are not logged in.", [
          { text: "OK", onPress: () => navigation.replace('Login') }
        ]);
        return;
      }

      // 2. Call the /api/pay/ endpoint
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: qrData.vendor_id,
          amount: qrData.amount,
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success!
        Alert.alert(
          "Payment Successful!",
          `You paid $${qrData.amount} to ${qrData.vendor_id}.`,
          [
            { text: "OK", onPress: () => navigation.navigate('Dashboard') }
          ]
        );
      } else {
        // 4. Handle errors (e.g., "Insufficient funds.")
        Alert.alert("Payment Failed", data.detail || "An error occurred.");
      }

    } catch (e) {
      console.error(e);
      Alert.alert("Network Error", "Could not complete payment.");
    } finally {
      setIsLoading(false);
    }
  };

  // If loading, show a spinner
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Processing Payment...</Text>
      </View>
    );
  }

  // Show the confirmation details
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Payment</Text>
      <Text style={styles.detailText}>You are about to pay:</Text>
      
      <Text style={styles.amount}>${parseFloat(qrData.amount).toFixed(2)}</Text>
      
      <Text style={styles.detailText}>To:</Text>
      <Text style={styles.vendor}>{qrData.vendor_id}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Confirm" onPress={handleConfirmPayment} color="#4CAF50" />
        <Button title="Cancel" onPress={() => navigation.goBack()} color="#f44336" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  detailText: {
    fontSize: 18,
    color: '#ddd',
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  vendor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
  },
  text: {
    fontSize: 18,
    color: '#ddd',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});