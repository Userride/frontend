import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileSearch,
  Target,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Award,
} from 'lucide-react';

const features = [
  { icon: FileSearch, title: 'Resume Analysis', desc: 'Upload PDF — AI extracts skills and experience' },
  { icon: Target, title: 'Job Matching', desc: 'Personalized job recommendations via vector search' },
  { icon: TrendingUp, title: 'Skill Gap Detection', desc: 'See what you need to land your dream role' },
  { icon: Award, title: 'ATS Score', desc: 'Optimize resume for applicant tracking systems' },
  { icon: MessageSquare, title: 'Cover Letter & Interview', desc: 'AI-generated prep materials' },
  { icon: BookOpen, title: 'Learning Roadmap', desc: 'Curated path to close skill gaps' },
];

const flow = [
  'Profile Analyzer Agent',
  'Job Research Agent',
  'Skill Gap Agent',
  'Resume Optimizer Agent',
  'Interview Preparation Agent',
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      <section
        style={{
          padding: '5rem 0 4rem',
          background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(61, 158, 255, 0.2), transparent)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <p className="badge badge-info" style={{ marginBottom: '1rem' }}>
            LangGraph Agentic AI · MERN Stack
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            Your AI Career Copilot
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '2rem' }}>
            Discover which jobs suit you, what skills you&apos;re missing, and how to prepare — powered by
            a multi-agent AI pipeline.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={user ? '/dashboard' : '/register'} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              {user ? 'Go to Dashboard' : 'Start Free Analysis'}
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '0.85rem 1.75rem' }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>
          Agentic Flow
        </h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom: '3rem',
          }}
        >
          {flow.map((step, i) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="card" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{step}</span>
              {i < flow.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
            </span>
          ))}
        </div>

        <div className="grid-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <Icon size={28} color="var(--accent)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ marginBottom: '0.35rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
