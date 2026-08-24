import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { MACHINE_TYPES, labelFor } from '../constants';

const emptyForm = { name: '', type: 'trator', brand: '', model: '', year: '', identifier: '', currentHours: '' };

export default function Dashboard() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function loadMachines() {
    setLoading(true);
    api
      .get('/machines')
      .then((res) => setMachines(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMachines();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
      setError(err.response?.data?.error || 'Erro ao cadastrar máquina.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Minhas máquinas e veículos</h2>
        <button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancelar' : '+ Nova máquina'}
        </button>
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={handleSubmit}>
          {error && <div className="error-box">{error}</div>}
          <div className="form-grid">
            <label>
              Nome *
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: Trator MF 275" required />
            </label>
            <label>
              Tipo
              <select name="type" value={form.type} onChange={handleChange}>
                {MACHINE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </label>
            <label>
              Marca
              <input name="brand" value={form.brand} onChange={handleChange} />
            </label>
            <label>
              Modelo
              <input name="model" value={form.model} onChange={handleChange} />
            </label>
            <label>
              Ano
              <input type="number" name="year" value={form.year} onChange={handleChange} />
            </label>
            <label>
              Placa / identificação
              <input name="identifier" value={form.identifier} onChange={handleChange} />
            </label>
            <label>
              Horas / km atual
              <input type="number" step="0.1" name="currentHours" value={form.currentHours} onChange={handleChange} />
            </label>
          </div>
          <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar máquina'}</button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : machines.length === 0 ? (
        <div className="empty-state">
          <p>Você ainda não cadastrou nenhuma máquina.</p>
        </div>
      ) : (
        <div className="grid">
          {machines.map((m) => (
            <Link to={`/maquinas/${m.id}`} key={m.id} className="card machine-card">
              <h3>{m.name}</h3>
              <p className="tag">{labelFor(MACHINE_TYPES, m.type)}</p>
              <p>{m.brand} {m.model} {m.year ? `· ${m.year}` : ''}</p>
              {m.identifier && <p className="muted">Ident.: {m.identifier}</p>}
              <p className="muted">Horas/km: {m.currentHours ?? 0}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
