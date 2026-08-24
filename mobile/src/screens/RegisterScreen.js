import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', propertyName: '', city: '' });
  const [loading, setLoading] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.response?.data?.error || 'Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          <Text style={styles.title}>🚜 Criar conta</Text>
          <Text style={styles.subtitle}>Comece a organizar a manutenção das suas máquinas</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={(v) => set('name', v)} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => set('email', v)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput style={styles.input} value={form.password} onChangeText={(v) => set('password', v)} secureTextEntry />

          <Text style={styles.label}>Nome da propriedade (opcional)</Text>
          <TextInput style={styles.input} value={form.propertyName} onChangeText={(v) => set('propertyName', v)} />

          <Text style={styles.label}>Cidade (opcional)</Text>
          <TextInput style={styles.input} value={form.city} onChangeText={(v) => set('city', v)} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchLink}>Já tem conta? Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.green900, padding: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.green900, marginBottom: 4 },
  subtitle: { color: COLORS.muted, marginBottom: 12 },
  label: { color: COLORS.muted, fontWeight: '600', marginBottom: 6, marginTop: 12, fontSize: 13 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 10, fontSize: 15 },
  button: { backgroundColor: COLORS.green600, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 15 },
  switchLink: { textAlign: 'center', color: COLORS.green700, marginTop: 16, fontSize: 13 },
});
