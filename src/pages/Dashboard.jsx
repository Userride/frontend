import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import ResumeUpload from '../components/ResumeUpload';
import { Clock, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const navigate = useNavigate();

  const load = () => {
    api.get('/analysis').then((res) => setAnalyses(res.data.analyses)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', marginBottom: '0.5rem' }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Upload your resume to trigger the 5-agent career analysis pipeline.
      </p>

      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent analyses</h2>
          {analyses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No analyses yet. Upload a resume to get started.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analyses.map((a) => (
                <li
                  key={a._id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/analysis/${a._id}`)}
                >
                  <div>
                    <strong>{a.originalFileName || 'Resume analysis'}</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} />
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`badge ${a.status === 'completed' ? 'badge-success' : a.status === 'failed' ? 'badge-warning' : 'badge-info'}`}>
                    {a.status}
                  </span>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <ResumeUpload
          onUploaded={(id) => {
            load();
            navigate(`/analysis/${id}`);
          }}
        />
      </div>
    </div>
  );
}
