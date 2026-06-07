import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Welcome back</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to your Career Copilot</p>
      <form onSubmit={handleSubmit} className="card">
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: '1rem' }} />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: '1.5rem' }} />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
