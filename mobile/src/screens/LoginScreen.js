import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Erro ao entrar', err.response?.data?.error || 'Verifique seus dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>🚜 AgroControle</Text>
        <Text style={styles.subtitle}>Controle de manutenção das suas máquinas</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchLink}>Ainda não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.green900, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.green900, marginBottom: 4 },
  subtitle: { color: COLORS.muted, marginBottom: 20 },
  label: { color: COLORS.muted, fontWeight: '600', marginBottom: 6, marginTop: 12, fontSize: 13 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 15 },
  button: { backgroundColor: COLORS.green600, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 15 },
  switchLink: { textAlign: 'center', color: COLORS.green700, marginTop: 16, fontSize: 13 },
});
