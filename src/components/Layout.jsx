import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut, LayoutDashboard } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(12, 15, 20, 0.9)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text)',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            <Sparkles size={22} color="var(--accent)" />
            AI Career Copilot
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.name}</span>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '0.5rem' }}
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/register" className="btn btn-primary">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
