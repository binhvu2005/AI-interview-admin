import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.tsx';

interface Candidate {
  id: number;
  name: string;
  role: string;
  score: number;
  atsMatch: number;
  interviews: number;
  rank: string;
  badge: string;
  location: string;
  avatar?: string;
}

const API_BASE = 'http://localhost:5001/api/admin/talent';

export default function TalentPoolPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchTalent();
  }, []);

  const fetchTalent = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      console.error('Fetch talent error:', err);
    } finally {
      setLoading(false);
    }
  };

  const ROLES = ['All', ...Array.from(new Set(candidates.map(c => c.role)))];

  const filtered = candidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'All' || c.role === filterRole;
    return matchSearch && matchRole;
  });

  const badgeClass = (b: string) =>
    b === 'Top 1%' ? 'badge-success' : b === 'Top 5%' ? 'badge-primary' : b === 'Top 10%' ? 'badge-amber' : 'badge-secondary';

  const scoreColor = (s: number) =>
    s >= 90 ? 'var(--success)' : s >= 80 ? 'var(--primary)' : s >= 70 ? 'var(--amber)' : 'var(--error)';

  return (
    <AdminLayout activePage="/talent-pool">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">military_tech</span>
          Talent Pool
        </div>
        <h1 className="page-title">Top <span>Candidates</span></h1>
        <p className="page-desc">Discover and track top-performing candidates ranked by AI interview score and ATS compatibility.</p>
      </div>

      {/* Top 3 podium */}
      {!loading && candidates.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 36 }}>
          {candidates.slice(0, 3).map((c, i) => (
            <div
              key={c.id || i}
              className="card"
              style={{
                textAlign: 'center', cursor: 'pointer',
                borderColor: i === 0 ? 'rgba(251,191,36,0.4)' : i === 1 ? 'rgba(148,163,184,0.4)' : 'rgba(180,120,80,0.3)',
                background: i === 0 ? 'linear-gradient(135deg, rgba(251,191,36,0.06), var(--surface-lo))' : 'var(--surface-lo)',
              }}
              onClick={() => setSelectedCandidate(c)}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>
              <div className="avatar-circle" style={{
                width: 56, height: 56, fontSize: 20, margin: '0 auto 12px',
                background: 'var(--primary-bg)', color: 'var(--primary)', overflow: 'hidden'
              }}>
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : c.name[0]}
              </div>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{c.role}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, color: scoreColor(c.score) }}>{c.score}%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Score</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, color: 'var(--secondary)' }}>{c.atsMatch}%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ATS Match</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Table */}
      <div className="table-wrap">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span className="card-title">
            <span className="material-symbols-outlined">leaderboard</span>
            Full Leaderboard
          </span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-wrap">
              <span className="material-symbols-outlined">search</span>
              <input className="search-input" placeholder="Search candidates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 180 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate</th>
              <th>Role</th>
              <th>AI Score</th>
              <th>ATS Match</th>
              <th>Interviews</th>
              <th>Percentile</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading talent pool data...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No candidates found.</td>
              </tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id || i} style={{ cursor: 'pointer' }} onClick={() => setSelectedCandidate(c)}>
                <td>
                  <strong style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--text-dim)' }}>{c.rank}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: 13, background: 'var(--primary-bg)', color: 'var(--primary)', flexShrink: 0, overflow: 'hidden' }}>
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : c.name[0]}
                    </div>
                    <div>
                      <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.location}</div>
                    </div>
                  </div>
                </td>
                <td>{c.role}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 60 }}>
                      <div className="progress-fill" style={{ width: `${c.score}%`, background: scoreColor(c.score) }} />
                    </div>
                    <strong style={{ color: scoreColor(c.score) }}>{c.score}%</strong>
                  </div>
                </td>
                <td>
                  <strong style={{ color: 'var(--secondary)' }}>{c.atsMatch}%</strong>
                </td>
                <td>{c.interviews} sessions</td>
                <td><span className={`badge ${badgeClass(c.badge)}`}>{c.badge}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedCandidate && (
        <div className="modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Candidate Profile</h3>
              <button className="modal-close" onClick={() => setSelectedCandidate(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <div className="avatar-circle" style={{ width: 64, height: 64, fontSize: 24, background: 'var(--primary-bg)', color: 'var(--primary)', overflow: 'hidden' }}>
                {selectedCandidate.avatar ? (
                  <img src={selectedCandidate.avatar} alt={selectedCandidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : selectedCandidate.name[0]}
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>{selectedCandidate.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{selectedCandidate.role} · {selectedCandidate.location}</p>
                <span className={`badge ${badgeClass(selectedCandidate.badge)}`} style={{ marginTop: 6 }}>{selectedCandidate.badge}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'AI Score', value: `${selectedCandidate.score}%`, color: scoreColor(selectedCandidate.score) },
                { label: 'ATS Match', value: `${selectedCandidate.atsMatch}%`, color: 'var(--secondary)' },
                { label: 'Interviews', value: selectedCandidate.interviews, color: 'var(--tertiary)' },
              ].map(s => (
                <div key={s.label} className="stat-card" style={{ padding: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedCandidate(null)}>Close</button>
              <button className="btn btn-primary">
                <span className="material-symbols-outlined">email</span>
                Contact Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
