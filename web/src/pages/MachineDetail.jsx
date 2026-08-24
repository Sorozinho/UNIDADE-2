import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';
import { MACHINE_TYPES, MAINTENANCE_TYPES, labelFor } from '../constants';

const emptyForm = {
  type: 'abastecimento',
  date: new Date().toISOString().slice(0, 10),
  hoursOrKm: '',
  description: '',
  cost: '',
  notes: '',
};

export default function MachineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function loadMachine() {
    setLoading(true);
    api
      .get(`/machines/${id}`)
      .then((res) => setMachine(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
      setError(err.response?.data?.error || 'Erro ao registrar manutenção.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMachine() {
    if (!confirm(`Remover "${machine.name}"? Esta ação não pode ser desfeita.`)) return;
    await api.delete(`/machines/${id}`);
    navigate('/');
  }

  async function handleDeleteMaintenance(maintenanceId) {
    if (!confirm('Remover este registro de manutenção?')) return;
    await api.delete(`/machines/${id}/maintenances/${maintenanceId}`);
    loadMachine();
  }

  if (loading) return <p>Carregando...</p>;
  if (!machine) return <p>Máquina não encontrada.</p>;

  const totalCost = (machine.maintenances || []).reduce((sum, m) => sum + Number(m.cost || 0), 0);

  return (
    <div>
      <Link to="/" className="back-link">← Voltar</Link>

      <div className="page-header">
        <div>
          <h2>{machine.name}</h2>
          <p className="muted">
            {labelFor(MACHINE_TYPES, machine.type)} · {machine.brand} {machine.model} {machine.year ? `· ${machine.year}` : ''}
          </p>
          <p className="muted">Horas/km atual: {machine.currentHours ?? 0} · Gasto total: R$ {totalCost.toFixed(2)}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancelar' : '+ Novo registro'}
          </button>
          <button className="danger-button" onClick={handleDeleteMachine}>Excluir máquina</button>
        </div>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}
          <div className="form-grid">
            <label>
              Tipo *
              <select name="type" value={form.type} onChange={handleChange}>
                {MAINTENANCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label>
              Data *
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>
              Horas / km no momento
              <input type="number" step="0.1" name="hoursOrKm" value={form.hoursOrKm} onChange={handleChange} />
            </label>
            <label>
              Custo (R$)
              <input type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} />
            </label>
          </div>
          <label>
            Descrição *
            <input name="description" value={form.description} onChange={handleChange} placeholder="Ex: Troca de óleo do motor 15W40" required />
          </label>
          <label>
            Observações
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
          </label>
          <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar registro'}</button>
        </form>
      )}

      <h3>Histórico de manutenções</h3>
      {(machine.maintenances || []).length === 0 ? (
        <div className="empty-state">
          <p>Nenhum registro de manutenção ainda.</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Horas/km</th>
              <th>Custo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {machine.maintenances.map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                <td><span className="tag">{labelFor(MAINTENANCE_TYPES, m.type)}</span></td>
                <td>{m.description}</td>
                <td>{m.hoursOrKm ?? '-'}</td>
                <td>R$ {Number(m.cost || 0).toFixed(2)}</td>
                <td>
                  <button className="link-button danger" onClick={() => handleDeleteMaintenance(m.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
