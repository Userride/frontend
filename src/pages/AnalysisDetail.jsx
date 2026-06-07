import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import AgentPipeline from '../components/AgentPipeline';
import { ArrowLeft, Copy, Check } from 'lucide-react';

export default function AnalysisDetail() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [poll, setPoll] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [detail, status] = await Promise.all([
          api.get(`/analysis/${id}`),
          api.get(`/analysis/${id}/status`),
        ]);
        setAnalysis(detail.data.analysis);
        setPoll(status.data);
      } catch {
        /* ignore */
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 2500);
    return () => clearInterval(interval);
  }, [id]);

  const copyCoverLetter = () => {
    if (analysis?.coverLetter) {
      navigator.clipboard.writeText(analysis.coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!analysis) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        Loading analysis...
      </div>
    );
  }

  const ats = analysis.atsScore;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
        <ArrowLeft size={18} /> Back to dashboard
      </Link>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.25rem' }}>
        {analysis.originalFileName || 'Career Analysis'}
      </h1>
      <span className={`badge ${analysis.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
        {analysis.status}
      </span>

      <div className="grid-2" style={{ marginTop: '2rem', alignItems: 'start' }}>
        <AgentPipeline
          status={poll?.status || analysis.status}
          currentAgent={poll?.currentAgent}
          agentLog={poll?.agentLog || analysis.agentLog}
          poll={poll}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {analysis.profile && (
            <section className="card">
              <h3>Experience Analysis</h3>
              <p style={{ margin: '0.75rem 0', color: 'var(--text-muted)' }}>{analysis.profile.summary}</p>
              <p><strong>{analysis.profile.yearsExperience}+ years</strong> experience</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                {(analysis.profile.skills || []).map((s) => (
                  <span key={s} className="badge badge-info">{s}</span>
                ))}
              </div>
            </section>
          )}

          {analysis.jobMatches?.length > 0 && (
            <section className="card">
              <h3>Job Recommendations</h3>
              <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                {analysis.jobMatches.map((j, i) => (
                  <li key={i} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '1rem' }}>{j.title}</strong>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: '0.2rem' }}>
                          {j.company}{j.location ? ` · ${j.location}` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        <span className="badge badge-success">{j.matchScore}% match</span>
                        {j.jobUrl && j.jobUrl !== '#' && (
                          <a
                            href={j.jobUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.78rem',
                              color: '#fff',
                              background: 'var(--gradient)',
                              borderRadius: '6px',
                              padding: '0.3rem 0.75rem',
                              fontWeight: '700',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Apply Now ↗
                          </a>
                        )}
                      </div>
                    </div>
                    {j.reasons && j.reasons.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                        {j.reasons.slice(0, 3).map((r, ri) => (
                          <span key={ri} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{r}</span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {analysis.skillGap && (
            <section className="card">
              <h3>Skill Gap Detection</h3>
              <p style={{ margin: '0.75rem 0 0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Missing skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(analysis.skillGap.missing || []).map((s) => (
                  <span key={s} className="badge badge-warning">{s}</span>
                ))}
              </div>
              <p style={{ margin: '1rem 0 0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Matched</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(analysis.skillGap.matched || []).map((s) => (
                  <span key={s} className="badge badge-success">{s}</span>
                ))}
              </div>
            </section>
          )}

          {ats && (
            <section className="card">
              <h3>ATS Score</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                <div className="score-ring" style={{ '--pct': ats.score }}>
                  <span>{ats.score}</span>
                </div>
                <div>
                  {Object.entries(ats.breakdown || {}).map(([k, v]) => (
                    <p key={k} style={{ fontSize: '0.9rem', textTransform: 'capitalize' }}>
                      {k}: <strong>{v}</strong>
                    </p>
                  ))}
                </div>
              </div>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {(ats.suggestions || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>
          )}

          {analysis.resumeOptimization && (
            <section className="card">
              <h3>Resume Improvement</h3>
              {(analysis.resumeOptimization.improvedSections || []).map((sec, i) => (
                <div key={i} style={{ marginTop: '1rem' }}>
                  <strong>{sec.section}</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>After:</p>
                  <p style={{ fontSize: '0.9rem' }}>{sec.after}</p>
                </div>
              ))}
            </section>
          )}

          {analysis.coverLetter && (
            <section className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Cover Letter</h3>
                <button className="btn btn-ghost" onClick={copyCoverLetter} style={{ padding: '0.4rem 0.75rem' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'inherit' }}>
                {analysis.coverLetter}
              </pre>
            </section>
          )}

          {analysis.interviewPrep && (
            <section className="card">
              <h3>Interview Questions</h3>
              <h4 style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Behavioral</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {(analysis.interviewPrep.behavioral || []).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
              <h4 style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Technical</h4>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {(analysis.interviewPrep.technical || []).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </section>
          )}

          {analysis.learningRoadmap?.length > 0 && (
            <section className="card">
              <h3>Learning Roadmap</h3>
              {analysis.learningRoadmap.map((item, i) => (
                <div key={i} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                  <strong>{item.skill}</strong>
                  <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>{item.priority}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>~{item.estimatedWeeks} weeks</p>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                    {(item.resources || []).map((r, j) => (
                      <li key={j}>
                        <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> ({r.type})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
