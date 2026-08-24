import { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { MACHINE_TYPES, labelFor, COLORS } from '../constants';
import ChipSelector from '../components/ChipSelector';

const emptyForm = { name: '', type: 'trator', brand: '', model: '', year: '', identifier: '', currentHours: '' };

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadMachines = useCallback(() => {
    setLoading(true);
    api
      .get('/machines')
      .then((res) => setMachines(res.data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar as máquinas.'))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMachines();
    }, [loadMachines])
  );

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name) {
      Alert.alert('Atenção', 'Informe o nome da máquina.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/machines', {
        ...form,
        year: form.year ? Number(form.year) : null,
        currentHours: form.currentHours ? Number(form.currentHours) : 0,
      });
      setForm(emptyForm);
      setShowForm(false);
      loadMachines();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao cadastrar máquina.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Olá, {user?.name?.split(' ')[0]}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.h2}>Minhas máquinas</Text>
        <TouchableOpacity style={styles.smallButton} onPress={() => setShowForm((v) => !v)}>
          <Text style={styles.smallButtonText}>{showForm ? 'Cancelar' : '+ Nova'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.card}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={(v) => set('name', v)} placeholder="Ex: Trator MF 275" />

          <Text style={styles.label}>Tipo</Text>
          <ChipSelector options={MACHINE_TYPES} value={form.type} onChange={(v) => set('type', v)} />

          <Text style={styles.label}>Marca</Text>
          <TextInput style={styles.input} value={form.brand} onChangeText={(v) => set('brand', v)} />

          <Text style={styles.label}>Modelo</Text>
          <TextInput style={styles.input} value={form.model} onChangeText={(v) => set('model', v)} />

          <Text style={styles.label}>Ano</Text>
          <TextInput style={styles.input} value={form.year} onChangeText={(v) => set('year', v)} keyboardType="numeric" />

          <Text style={styles.label}>Placa / identificação</Text>
          <TextInput style={styles.input} value={form.identifier} onChangeText={(v) => set('identifier', v)} />

          <Text style={styles.label}>Horas / km atual</Text>
          <TextInput style={styles.input} value={form.currentHours} onChangeText={(v) => set('currentHours', v)} keyboardType="numeric" />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar máquina'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={loadMachines}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={{ color: COLORS.muted }}>Você ainda não cadastrou nenhuma máquina.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.machineCard} onPress={() => navigation.navigate('MachineDetail', { id: item.id })}>
            <Text style={styles.machineName}>{item.name}</Text>
            <Text style={styles.tag}>{labelFor(MACHINE_TYPES, item.type)}</Text>
            <Text style={styles.muted}>{item.brand} {item.model} {item.year ? `· ${item.year}` : ''}</Text>
            <Text style={styles.muted}>Horas/km: {item.currentHours ?? 0}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.green900 },
  logout: { color: COLORS.green700, fontWeight: '600' },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  smallButton: { backgroundColor: COLORS.green600, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  smallButtonText: { color: 'white', fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.muted, fontWeight: '600', marginBottom: 6, marginTop: 10, fontSize: 12.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 9, fontSize: 14, backgroundColor: 'white' },
  button: { backgroundColor: COLORS.green600, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: '700' },
  empty: { alignItems: 'center', padding: 40, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 12 },
  machineCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  machineName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.green100,
    color: COLORS.green700,
    fontSize: 11,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    marginBottom: 4,
    overflow: 'hidden',
  },
  muted: { color: COLORS.muted, fontSize: 12.5 },
});
