import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/entrar');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">🚜 AgroControle</Link>
        <div className="header-user">
          <span>Olá, {user?.name?.split(' ')[0]}</span>
          <button className="link-button" onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
