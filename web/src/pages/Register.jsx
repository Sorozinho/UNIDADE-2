import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', propertyName: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🚜 Criar conta</h1>
        <p className="subtitle">Comece a organizar a manutenção das suas máquinas</p>

        {error && <div className="error-box">{error}</div>}

        <label>
          Nome
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Senha
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength={6} required />
        </label>

        <label>
          Nome da propriedade (opcional)
          <input name="propertyName" value={form.propertyName} onChange={handleChange} />
        </label>

        <label>
          Cidade (opcional)
          <input name="city" value={form.city} onChange={handleChange} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="switch-link">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
