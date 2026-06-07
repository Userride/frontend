import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import api from '../api/client';

export default function ResumeUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF resume');
      return;
    }
    setLoading(true);
    setError('');
    const form = new FormData();
    form.append('resume', file);
    try {
      const { data } = await api.post('/analysis/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(data.analysisId);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 style={{ marginBottom: '0.75rem' }}>Upload Resume (PDF)</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Our AI agents will analyze your resume and run the full career pipeline.
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius)',
          padding: '2.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: file ? 'var(--accent-soft)' : 'var(--bg-elevated)',
          marginBottom: '1rem',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <>
            <FileText size={40} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
            <p>{file.name}</p>
          </>
        ) : (
          <>
            <Upload size={40} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
            <p>Click to select PDF or TXT</p>
          </>
        )}
      </div>
      {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Starting agents...' : 'Run AI Career Analysis'}
      </button>
    </form>
  );
}
