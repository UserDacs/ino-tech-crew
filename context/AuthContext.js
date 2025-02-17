import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '@env';
import CustomAlert from '../components/CustomAlert'; // Import your custom alert

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      if (response.data.status === 200 && response.data.data?.token) {
        const token = response.data.data.token;
        const user = response.data.data.user;

        // Store token
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
        // Store user info as a string
        await AsyncStorage.setItem('user_info', JSON.stringify(user));

        console.log("User info stored:", JSON.stringify(user));

        setAlert({ visible: true, type: 'success', message: 'Login Successful!' });
      } else if (response.data.status === 404) {
        setAlert({ visible: true, type: 'error', message: response.data.message });
      } else {
        setAlert({ visible: true, type: 'error', message: 'Unexpected error occurred.' });
      }
    } catch (error) {
      setAlert({ visible: true, type: 'error', message: 'Network error. Please try again.' });
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
      if (response.data.status === 200) {
        await AsyncStorage.setItem('userToken', response.data.token);
        setUserToken(response.data.token);
        setAlert({ visible: true, type: 'success', message: 'Registration Successful!' });
      } else {
        setAlert({ visible: true, type: 'error', message: response.data.message });
      }
    } catch (error) {
      setAlert({ visible: true, type: 'error', message: 'Registration failed. Try again.' });
    }
  };

  const updateProfileImage = async (imageUri, user_id) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setAlert({
          visible: true,
          type: "error",
          message: "User not authenticated!",
        });
        return;
      }
  
      const formData = new FormData();
      
      // Append the image file
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg", // Adjust if necessary
        name: "profile.jpg",
      });
  
      // Append user_id as a separate field
      formData.append("user_id", user_id); 
  
      console.log("FormData before sending:", formData); // 🛑 Debug log
  
      const response = await axios.post(`${API_BASE_URL}/update-profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response.data); // 🛑 Debug log

      await AsyncStorage.removeItem('user_info');
  
      if (response.data.status === 200) {
        await AsyncStorage.setItem('user_info', JSON.stringify(response.data.user));
        setAlert({
          visible: true,
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        setAlert({
          visible: true,
          type: "error",
          message: response.data.message,
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message); // 🛑 Debug log
      setAlert({
        visible: true,
        type: "error",
        message: `Profile update failed. Try again. ${error.message}`,
      });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    await AsyncStorage.removeItem('user_info');

    setAlert({ visible: true, type: 'success', message: 'You have been logged out!' });
  };

  return (
    <AuthContext.Provider value={{ userToken, login, register, logout, loading, updateProfileImage }}>
      {children}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ visible: false })}
      />
    </AuthContext.Provider>
  );
};
