// screens/DashboardScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  ActivityIndicator, Alert, StatusBar, Platform 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getToken, removeToken } from '../utils/storage'; 
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

// --- Configuration ---
const YOUR_COMPUTER_IP = '192.168.1.3';
const API_URL = `http://${YOUR_COMPUTER_IP}:8000/api/wallet/`;
// --- End Configuration ---

export default function DashboardScreen({ navigation }) {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true); 
  const isFocused = useIsFocused();

  // Helper function to format currency (Indian Rupee)
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };
  
  // Helper function to format points
  const formatPoints = (amount) => {
      return `${parseInt(amount || 0).toLocaleString()} pts`;
  };

  // Fetches wallet data from the API
  const fetchWallet = useCallback(async () => {
    try {
      setIsLoading(true); 
      const token = await getToken();
      if (!token) { navigation.replace('Login'); return; }

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Setting state with REAL data
        setWalletData({
          ...data,
          meal_plan: 150.00, // Mock sub-section data
          printing_credits: 25.50, // Mock sub-section data
          username: data.username, // REAL username
          transactions: data.transactions // REAL transactions list
        });
        
      } else {
        Alert.alert('Error', 'Your session has expired. Please log in again.');
        await removeToken(); 
        navigation.replace('Login');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Network Error', 'Could not fetch wallet data.');
    } finally {
      setIsLoading(false);
    }
  }, [navigation]); 

  useEffect(() => {
    if (isFocused) { fetchWallet(); }
  }, [isFocused, fetchWallet]);

  const handleLogout = async () => {
    await removeToken(); 
    navigation.replace('Login'); 
  };
  
  if (isLoading || !walletData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading Wallet...</Text>
      </View>
    );
  }

  // --- UI RENDERING ---

  // 1. Transaction Item Component
  const TransactionItem = ({ tx }) => {
    const isPoints = tx.transaction_type.includes('points');
    const amountFloat = isPoints ? parseInt(tx.points_amount || 0) : parseFloat(tx.amount);
    const isCredit = amountFloat >= 0;
    
    // Choose format and colors based on if it's points or money
    const amountString = isPoints 
        ? `${isCredit ? '+' : '-'}${formatPoints(Math.abs(amountFloat))}`
        : `${isCredit ? '+' : '-'}${formatCurrency(Math.abs(amountFloat))}`;
        
    const amountStyle = { 
        color: isPoints ? '#FFC107' : (isCredit ? '#69F0AE' : '#FF4081'), 
        fontWeight: 'bold' 
    };
    
    // Icon Logic
    let iconName = 'bank'; 
    if (tx.transaction_type === 'payment') iconName = 'cart';
    if (tx.transaction_type === 'deposit') iconName = 'cash-plus';
    if (tx.transaction_type === 'points_earn') iconName = 'star-circle-outline';
    if (tx.transaction_type === 'points_redeem') iconName = 'gift';
    
    const iconColor = amountStyle.color;

    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIconCircle, { backgroundColor: isCredit ? 'rgba(105, 240, 174, 0.1)' : 'rgba(255, 64, 129, 0.1)' }]}>
            <MaterialCommunityIcons 
                name={iconName} 
                size={22} 
                color={iconColor}
            />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{tx.description}</Text>
          <Text style={styles.transactionDate}>{new Date(tx.timestamp).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
          })}</Text>
        </View>
        <Text style={amountStyle}>{amountString}</Text>
      </View>
    );
  };
  
  // 2. Main Dashboard Layout
  return (
    <View style={styles.fullContainer}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeMessage}>Hey, {walletData.username}!</Text>
          <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#ddd" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.cardHeader}>Total Campus Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.cardBalance}>
              {/* Conditional Balance Display */}
              {isBalanceVisible 
                ? formatCurrency(walletData.balance) 
                : '₹XXX.XX'}
            </Text>
            
            {/* Hide/Show Button */}
            <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              <Feather 
                name={isBalanceVisible ? "eye-off" : "eye"} // Toggle the icon
                size={24} 
                color="#fff" 
                style={{ opacity: 0.8 }} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Conditional Breakdown Row */}
          {isBalanceVisible && (
              <View style={styles.breakdownRow}>
                <View>
                  <Text style={styles.breakdownValue}>{formatCurrency(walletData.meal_plan)}</Text>
                  <Text style={styles.breakdownLabel}>Meal Plan</Text>
                </View>
                <View style={styles.breakdownSeparator} />
                <View>
                  <Text style={styles.breakdownValue}>{formatPoints(walletData.loyalty_points)}</Text>
                  <Text style={styles.breakdownLabel}>Loyalty Points</Text>
                </View>
              </View>
          )}
        </View>

        {/* Quick Actions (Updated with fixed icons and QR actions) */}
        <View style={styles.actionsContainer}>
            {/* Scan QR */}
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Scan')}>
                <View style={styles.actionIconCircle}>
                    <Feather name="maximize" size={24} color="#007bff" />
                </View>
                <Text style={styles.actionText}>Scan QR</Text>
            </TouchableOpacity>
            
            {/* Show QR */}
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ShowCode', { userId: walletData.user, username: walletData.username })}>
                <View style={styles.actionIconCircle}>
                    <Feather name="square" size={24} color="#007bff" /> 
                </View>
                <Text style={styles.actionText}>Show QR</Text>
            </TouchableOpacity>
        </View>

        {/* Transactions Section */}
        <Text style={styles.transactionsHeader}>Recent Campus Transactions</Text>
        <View style={styles.transactionsList}>
          {/* Dynamic Transaction Rendering */}
          {walletData.transactions && walletData.transactions.length > 0 ? (
            walletData.transactions.map(tx => (
              <TransactionItem key={tx.id} tx={tx} />
            ))
          ) : (
            <Text style={styles.noTransactions}>No transactions yet. Top up your wallet!</Text>
          )}
        </View>
        
      </ScrollView>
      
      {/* Bottom Navigation Bar (CLEANED UP - Only 3 icons remain) */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="home" label="Home" active onPress={() => {}} />
        {/* ID Card / Show QR */}
        <BottomNavItem icon="credit-card" label="ID Card" onPress={() => Alert.alert("ID Card", "Coming Soon!")} />
        <BottomNavItem icon="user" label="Profile" onPress={() => Alert.alert("Profile", "Coming Soon!")} />
      </View>
    </View>
  );
}

// Bottom Navigation Item Component
const BottomNavItem = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
        <Feather name={icon} size={24} color={active ? '#007bff' : '#999'} />
        <Text style={[styles.navLabel, { color: active ? '#007bff' : '#999' }]}>{label}</Text>
    </TouchableOpacity>
);

// --- DARK MODE STYLES ---
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#121212', // Primary Dark Background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ddd',
  },
scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for bottom nav
    // Add space at the top using the global status bar height
    paddingTop: Platform.OS === 'android' ? 20 : 50,
},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 0 : 20,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd', 
  },

  // --- Balance Card ---
  balanceCard: {
    backgroundColor: '#333', 
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  cardHeader: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)', 
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  breakdownSeparator: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: '100%',
    marginHorizontal: 15,
  },

  // --- Quick Actions ---
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1e1e1e', 
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  actionIconCircle: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)', 
    borderRadius: 50,
    padding: 10,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ddd', 
    textAlign: 'center',
  },

  // --- Transactions ---
  transactionsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ddd', 
    marginBottom: 15,
  },
  transactionsList: {
    backgroundColor: '#1e1e1e', 
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  noTransactions: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 16,
  },
  transactionIconCircle: {
    borderRadius: 50,
    padding: 10,
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff', 
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // --- Bottom Navigation ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e1e1e', 
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 80,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});