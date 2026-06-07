import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LOCATION_OPTIONS = [
  'Remote',
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'Australia',
  'Singapore',
  'Dubai (UAE)',
  'Netherlands',
  'France',
  'Japan',
  'Sweden',
  'Ireland',
  'Switzerland',
];

const TARGET_ROLE_OPTIONS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'Mobile App Developer',
  'Cloud Architect',
  'Product Manager',
  'UI/UX Designer',
  'Cybersecurity Analyst',
  'Data Analyst',
];

const EXPERIENCE_OPTIONS = [
  'Fresher / Internship',
  'Entry Level (0-2 years)',
  'Mid Level (2-5 years)',
  'Senior Level (5-8 years)',
  'Lead / Staff (8+ years)',
];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: [],
    targetIndustry: '',
    preferredJobLocation: [],
    experienceLevel: '',
    salaryExpectation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        targetRole: form.targetRole,
        preferredJobLocation: form.preferredJobLocation,
      };
      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const toggleChip = (key, value) => {
    setForm(prev => {
      const selected = prev[key];
      if (selected.includes(value)) {
        return { ...prev, [key]: selected.filter(v => v !== value) };
      }
      return { ...prev, [key]: [...selected, value] };
    });
  };

  return (
    <div className="container" style={{ maxWidth: '520px', padding: '4rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Create account</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start your AI-powered career journey</p>
      <form onSubmit={handleSubmit} className="card">
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{typeof error === 'string' ? error : 'Invalid input'}</p>}
        <label className="label">Full name</label>
        <input className="input" value={form.name} onChange={set('name')} required style={{ marginBottom: '1rem' }} />
        <label className="label">Email</label>
        <input className="input" type="email" value={form.email} onChange={set('email')} required style={{ marginBottom: '1rem' }} />
        <label className="label">Password (min 6)</label>
        <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={6} style={{ marginBottom: '1rem' }} />
        {/* Target Roles — Multi-select chips */}
        <label className="label">Target Roles</label>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border-color, #334155)',
          background: 'var(--bg-input, rgba(255,255,255,0.03))',
          marginBottom: '1rem',
          maxHeight: '160px', overflowY: 'auto',
        }}>
          {TARGET_ROLE_OPTIONS.map((role) => {
            const isSelected = form.targetRole.includes(role);
            return (
              <button
                type="button"
                key={role}
                onClick={() => toggleChip('targetRole', role)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: isSelected ? '2px solid var(--primary, #6366f1)' : '1px solid var(--border-color, #475569)',
                  background: isSelected ? 'var(--primary, #6366f1)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-muted, #94a3b8)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSelected ? '✓ ' : ''}{role}
              </button>
            );
          })}
        </div>

        {/* Preferred Locations — Multi-select chips */}
        <label className="label">Preferred Job Locations</label>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          padding: '0.75rem', borderRadius: '0.5rem',
          border: '1px solid var(--border-color, #334155)',
          background: 'var(--bg-input, rgba(255,255,255,0.03))',
          marginBottom: '1rem',
          maxHeight: '160px', overflowY: 'auto',
        }}>
          {LOCATION_OPTIONS.map((loc) => {
            const isSelected = form.preferredJobLocation.includes(loc);
            return (
              <button
                type="button"
                key={loc}
                onClick={() => toggleChip('preferredJobLocation', loc)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: isSelected ? '2px solid var(--primary, #6366f1)' : '1px solid var(--border-color, #475569)',
                  background: isSelected ? 'var(--primary, #6366f1)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-muted, #94a3b8)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {isSelected ? '✓ ' : ''}{loc}
              </button>
            );
          })}
        </div>

        {/* Experience Level — Dropdown */}
        <label className="label">Experience Level</label>
        <select
          className="input"
          value={form.experienceLevel}
          onChange={set('experienceLevel')}
          style={{
            marginBottom: '1rem',
            cursor: 'pointer',
            appearance: 'auto',
          }}
        >
          <option value="">— Select experience level —</option>
          {EXPERIENCE_OPTIONS.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <label className="label">Salary Expectation</label>
        <input className="input" placeholder="e.g. $100k - $120k, ₹10L - ₹15L" value={form.salaryExpectation} onChange={set('salaryExpectation')} style={{ marginBottom: '1rem' }} />
        <label className="label">Target industry (optional)</label>
        <input className="input" placeholder="e.g. FinTech, HealthTech" value={form.targetIndustry} onChange={set('targetIndustry')} style={{ marginBottom: '1.5rem' }} />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
        Have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
