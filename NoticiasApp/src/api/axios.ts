// src/api/axios.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const instance = axios.create({
  baseURL: 'http://192.168.43.34:3000/api', // Cambia por tu API
});

instance.interceptors.request.use(
  async (config) => {
    // Obtener el token desde AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
