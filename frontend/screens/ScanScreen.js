// screens/ScanScreen.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
// New, correct imports for the modern 'expo-camera'
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen({ navigation }) {
  // Use the new 'useCameraPermissions' hook
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); // To prevent scanning multiple times

  // Ask for permission
  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, []);

  // Handle what happens when a QR code is scanned
  const handleBarCodeScanned = (scanningResult) => {
    if (scanned) return; // If already scanned, do nothing
    setScanned(true); // Mark as scanned
    
    const { data } = scanningResult; // Get data from the event

    try {
      // 1. Try to parse the data as JSON
      const qrData = JSON.parse(data);

      // 2. Check if it has our required fields
      if (qrData.vendor_id && qrData.amount) {
        // 3. Navigate to the confirm screen, passing the data
        navigation.navigate('ConfirmPayment', { qrData: qrData });
      } else {
        // It's a valid QR, but not a payment code
        Alert.alert("Invalid QR Code", "This is not a valid payment code.", [
          { text: "OK", onPress: () => setScanned(false) }
        ]);
      }
    } catch (e) {
      // It's not JSON, just a plain text QR code
      Alert.alert("Invalid QR Code", `Scanned data: ${data}`, [
        { text: "OK", onPress: () => setScanned(false) }
      ]);
    }
  };

  // Show different views based on permission status
  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text style={styles.text}>Requesting camera permission...</Text></View>;
  }
  if (!permission.granted) {
    // Camera permissions are not granted
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  // If we have permission, show the camera
  return (
    <View style={styles.container}>
      {/* Use the new <CameraView> component */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        // Use the new prop 'onBarcodeScanned' (lowercase 'c')
        onBarcodeScanned={handleBarCodeScanned}
        // We must now specify what to scan for
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  }
});