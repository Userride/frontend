import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

const AGENTS = [
  { id: 'Profile Analyzer', key: 'hasProfile', desc: 'Extract skills & experience' },
  { id: 'Job Research', key: 'hasJobs', desc: 'Match roles to your profile' },
  { id: 'Skill Gap', key: 'hasSkillGap', desc: 'Find missing skills' },
  { id: 'Resume Optimizer', key: 'atsScore', desc: 'ATS score & cover letter' },
  { id: 'Interview Prep', key: 'completed', desc: 'Questions & learning roadmap' },
];

export default function AgentPipeline({ status, currentAgent, agentLog, poll }) {
  const logMap = Object.fromEntries((agentLog || []).map((l) => [l.agent, l]));

  const getStepState = (agent, index) => {
    const log = logMap[agent.id];
    if (log?.status === 'failed') return 'failed';
    if (log?.status === 'completed') return 'done';
    if (currentAgent === agent.id || (status === 'processing' && !log && index === 0)) return 'active';
    if (status === 'processing' && currentAgent === agent.id) return 'active';
    if (status === 'completed') return 'done';
    return 'pending';
  };

  const isComplete = (agent) => {
    if (agent.id === 'Interview Prep') return status === 'completed';
    if (agent.id === 'Resume Optimizer') return poll?.atsScore != null;
    if (agent.key === 'hasProfile') return poll?.hasProfile;
    if (agent.key === 'hasJobs') return poll?.hasJobs;
    if (agent.key === 'hasSkillGap') return poll?.hasSkillGap;
    return logMap[agent.id]?.status === 'completed';
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>
        Agent Pipeline
      </h3>
      <div style={{ marginTop: '0.5rem' }}>
        {AGENTS.map((agent, i) => {
          const log = logMap[agent.id];
          const done = isComplete(agent) || log?.status === 'completed';
          const active = currentAgent === agent.id && status === 'processing';
          const failed = log?.status === 'failed';

          return (
            <div
              key={agent.id}
              className={`agent-step ${active ? 'active' : ''} ${done ? 'done' : ''} ${failed ? 'failed' : ''}`}
            >
              {failed ? (
                <XCircle size={22} color="var(--danger)" />
              ) : done ? (
                <CheckCircle2 size={22} color="var(--success)" />
              ) : active ? (
                <Loader2 size={22} color="var(--accent)" className="spin" />
              ) : (
                <Circle size={22} color="var(--text-muted)" />
              )}
              <div>
                <strong>{agent.id}</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.15rem 0' }}>
                  {agent.desc}
                </p>
                {log?.message && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{log.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
