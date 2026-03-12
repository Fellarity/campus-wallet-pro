// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Saves the access token
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('accessToken', token);
  } catch (e) {
    console.error('Failed to save token.', e);
  }
};

// Gets the access token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (e) {
    console.error('Failed to get token.', e);
    return null;
  }
};

// Removes the access token (for logout)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
  } catch (e) {
    console.error('Failed to remove token.', e);
  }
};