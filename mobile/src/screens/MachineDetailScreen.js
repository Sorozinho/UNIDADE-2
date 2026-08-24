import { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { MACHINE_TYPES, MAINTENANCE_TYPES, labelFor, COLORS } from '../constants';
import ChipSelector from '../components/ChipSelector';

const emptyForm = {
  type: 'abastecimento',
  date: new Date().toISOString().slice(0, 10),
  hoursOrKm: '',
  description: '',
  cost: '',
  notes: '',
};

export default function MachineDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadMachine = useCallback(() => {
    setLoading(true);
    api
      .get(`/machines/${id}`)
      .then((res) => {
        setMachine(res.data);
        navigation.setOptions({ title: res.data.name });
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar a máquina.'))
      .finally(() => setLoading(false));
  }, [id, navigation]);

  useFocusEffect(
    useCallback(() => {
      loadMachine();
    }, [loadMachine])
  );

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.description) {
      Alert.alert('Atenção', 'Descreva o que foi feito na manutenção.');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/machines/${id}/maintenances`, {
        ...form,
        hoursOrKm: form.hoursOrKm ? Number(form.hoursOrKm) : null,
        cost: form.cost ? Number(form.cost) : 0,
      });
      setForm(emptyForm);
      setShowForm(false);
      loadMachine();
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao registrar manutenção.');
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteMachine() {
    Alert.alert('Remover máquina', `Remover "${machine.name}"? Esta ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/machines/${id}`);
          navigation.goBack();
        },
      },
    ]);
  }

  function handleDeleteMaintenance(maintenanceId) {
    Alert.alert('Remover registro', 'Remover este registro de manutenção?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/machines/${id}/maintenances/${maintenanceId}`);
          loadMachine();
        },
      },
    ]);
  }

  if (loading || !machine) {
    return (
      <View style={styles.page}>
        <Text style={{ color: COLORS.muted }}>Carregando...</Text>
      </View>
    );
  }

  const totalCost = (machine.maintenances || []).reduce((sum, m) => sum + Number(m.cost || 0), 0);

  return (
    <View style={styles.page}>
      <View style={styles.summary}>
        <Text style={styles.tag}>{labelFor(MACHINE_TYPES, machine.type)}</Text>
        <Text style={styles.muted}>{machine.brand} {machine.model} {machine.year ? `· ${machine.year}` : ''}</Text>
        <Text style={styles.muted}>Horas/km atual: {machine.currentHours ?? 0} · Gasto total: R$ {totalCost.toFixed(2)}</Text>
      </View>

      <View style={styles.pageHeader}>
        <TouchableOpacity style={styles.smallButton} onPress={() => setShowForm((v) => !v)}>
          <Text style={styles.smallButtonText}>{showForm ? 'Cancelar' : '+ Novo registro'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteMachine}>
          <Text style={styles.smallButtonText}>Excluir máquina</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.card}>
          <Text style={styles.label}>Tipo *</Text>
          <ChipSelector options={MAINTENANCE_TYPES} value={form.type} onChange={(v) => set('type', v)} />

          <Text style={styles.label}>Data * (AAAA-MM-DD)</Text>
          <TextInput style={styles.input} value={form.date} onChangeText={(v) => set('date', v)} />

          <Text style={styles.label}>Horas / km no momento</Text>
          <TextInput style={styles.input} value={form.hoursOrKm} onChangeText={(v) => set('hoursOrKm', v)} keyboardType="numeric" />

          <Text style={styles.label}>Custo (R$)</Text>
          <TextInput style={styles.input} value={form.cost} onChangeText={(v) => set('cost', v)} keyboardType="numeric" />

          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            value={form.description}
            onChangeText={(v) => set('description', v)}
            placeholder="Ex: Troca de óleo do motor 15W40"
          />

          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, { height: 60 }]}
            value={form.notes}
            onChangeText={(v) => set('notes', v)}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar registro'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.h2}>Histórico de manutenções</Text>

      <FlatList
        data={machine.maintenances || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: COLORS.muted }}>Nenhum registro de manutenção ainda.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.recordCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tag}>{labelFor(MAINTENANCE_TYPES, item.type)}</Text>
              <Text style={styles.recordDesc}>{item.description}</Text>
              <Text style={styles.muted}>
                {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                {item.hoursOrKm != null ? ` · ${item.hoursOrKm}h/km` : ''} · R$ {Number(item.cost || 0).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteMaintenance(item.id)}>
              <Text style={styles.deleteLink}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bg, padding: 16 },
  summary: { marginBottom: 14 },
  pageHeader: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  h2: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  smallButton: { backgroundColor: COLORS.green600, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  dangerButton: { backgroundColor: COLORS.danger, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  smallButtonText: { color: 'white', fontWeight: '700', fontSize: 12.5 },
  card: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.muted, fontWeight: '600', marginBottom: 6, marginTop: 10, fontSize: 12.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 9, fontSize: 14, backgroundColor: 'white' },
  button: { backgroundColor: COLORS.green600, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: '700' },
  empty: { alignItems: 'center', padding: 30, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 12 },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  recordDesc: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginVertical: 2 },
  deleteLink: { color: COLORS.danger, fontSize: 12.5, fontWeight: '600' },
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
