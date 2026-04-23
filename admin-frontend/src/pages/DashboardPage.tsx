import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout.tsx';

interface Stats {
  totalUsers: number;
  totalQuestions: number;
  totalInterviews: number;
  avgScore: number;
}

const RECENT_ACTIVITIES = [
  { user: 'Nguyen Van A', action: 'Completed interview', role: 'Frontend Dev', score: 88, time: '5m ago' },
  { user: 'Tran Thi B', action: 'Uploaded CV', role: 'Backend Engineer', score: null, time: '12m ago' },
  { user: 'Le Minh C', action: 'Completed interview', role: 'Full Stack', score: 72, time: '28m ago' },
  { user: 'Pham Quoc D', action: 'Registered', role: 'DevOps', score: null, time: '1h ago' },
  { user: 'Hoang Lan E', action: 'Completed interview', role: 'UI/UX Designer', score: 95, time: '2h ago' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalQuestions: 0, totalInterviews: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch real stats; fallback to mock data
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout activePage="/dashboard">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">dashboard</span>
          Overview
        </div>
        <h1 className="page-title">System <span>Dashboard</span></h1>
        <p className="page-desc">Real-time overview of platform activity, user performance, and AI engine metrics.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-bg)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>group</span>
          </div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            +12% this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(96,165,250,0.12)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>quiz</span>
          </div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.totalQuestions}</div>
            <div className="stat-label">Questions in Bank</div>
          </div>
          <div className="stat-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            +8 this week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.12)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>mic</span>
          </div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.totalInterviews}</div>
            <div className="stat-label">Interviews Conducted</div>
          </div>
          <div className="stat-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            +34 today
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.12)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--success)' }}>auto_graph</span>
          </div>
          <div>
            <div className="stat-value">{loading ? '—' : stats.avgScore}%</div>
            <div className="stat-label">Avg Interview Score</div>
          </div>
          <div className="stat-trend up">
            <span className="material-symbols-outlined">trending_up</span>
            +2.4% vs last month
          </div>
        </div>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginTop: 8 }}>
        {/* Recent Activity */}
        <div className="table-wrap">
          <div className="table-toolbar">
            <span className="card-title">
              <span className="material-symbols-outlined">history</span>
              Recent Activity
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITIES.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar-circle" style={{
                        background: 'var(--primary-bg)', color: 'var(--primary)',
                        width: 32, height: 32, fontSize: 12, flexShrink: 0
                      }}>
                        {a.user[0]}
                      </div>
                      <div>
                        <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{a.user}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{a.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{a.action}</td>
                  <td>
                    {a.score !== null ? (
                      <span className={`badge ${a.score >= 85 ? 'badge-success' : a.score >= 70 ? 'badge-primary' : 'badge-amber'}`}>
                        {a.score}%
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="text-muted">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>
              <span className="material-symbols-outlined">bar_chart</span>
              Score Distribution
            </div>
            {[
              { label: 'Excellent (90-100%)', pct: 22, color: 'var(--success)' },
              { label: 'Good (70-89%)', pct: 48, color: 'var(--primary)' },
              { label: 'Average (50-69%)', pct: 20, color: 'var(--amber)' },
              { label: 'Poor (<50%)', pct: 10, color: 'var(--error)' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'var(--text-dim)' }}>{s.label}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 700 }}>{s.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>
              <span className="material-symbols-outlined">trending_up</span>
              Popular Roles
            </div>
            {[
              { role: 'Frontend Developer', count: 89 },
              { role: 'Full Stack Engineer', count: 64 },
              { role: 'Backend Developer', count: 51 },
              { role: 'DevOps / Cloud', count: 38 },
            ].map(r => (
              <div key={r.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{r.role}</span>
                <span className="badge badge-primary">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
