import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('agrocontrole_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        await AsyncStorage.removeItem('agrocontrole_token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('agrocontrole_token', res.data.token);
    setUser(res.data.user);
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    await AsyncStorage.setItem('agrocontrole_token', res.data.token);
    setUser(res.data.user);
  }

  async function logout() {
    await AsyncStorage.removeItem('agrocontrole_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
