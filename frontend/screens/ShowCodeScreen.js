// screens/ShowCodeScreen.js
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

// This screen will receive your user data as a 'prop'
export default function ShowCodeScreen({ route, navigation }) {
  const { userId, username } = route.params;

  // This is the data we'll put in the QR code
  // We'll just use the user's ID
  const qrData = JSON.stringify({ userId: userId });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Show to Vendor</Text>
      <Text style={styles.text}>Have the vendor scan this code.</Text>

      <View style={styles.qrContainer}>
        {/* The QR Code Generator */}
        <QRCode
          value={qrData}
          size={250}
          backgroundColor="white"
          color="black"
        />
      </View>

      <Text style={styles.userText}>User: {username}</Text>

      <Button title="Done" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 30,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  userText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    marginBottom: 40,
  },
});