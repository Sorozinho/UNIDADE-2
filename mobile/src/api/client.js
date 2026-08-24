import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ao testar em dispositivo fisico ou emulador, troque pelo IP da maquina
// que esta rodando o backend na sua rede local (ex: http://192.168.0.10:3000).
// No emulador Android, "http://10.0.2.2:3000" aponta para o localhost do PC.
export const API_URL = 'http://localhost:3000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('agrocontrole_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
