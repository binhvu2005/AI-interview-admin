import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.tsx';

interface Interview {
  _id: string;
  createdAt: string;
  position: string;
  level: string;
  evaluation: {
    totalScore: number;
    detailedFeedback: {
      question: string;
      answer: string;
      feedback: string;
      score: number;
    }[];
  };
  cvName?: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  interviewCount: number;
  isLocked?: boolean;
  avatar?: string;
}

const API_BASE = 'http://localhost:5001/api/admin/users';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userInterviews, setUserInterviews] = useState<Interview[]>([]);
  const [viewingInterview, setViewingInterview] = useState<Interview | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (userId: string) => {
    setModalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}`);
      const data = await res.json();
      setUserInterviews(data.interviews);
    } catch (err) {
      console.error('Fetch detail error:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenUser = (user: User) => {
    setSelectedUser(user);
    fetchUserDetail(user._id);
  };

  const handleToggleLock = async (id: string) => {
    try {
      await fetch(`${API_BASE}/${id}/toggle-lock`, { method: 'PUT' });
      fetchUsers();
    } catch (err) {
      console.error('Lock error:', err);
    }
  };

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout activePage="/users">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">group</span>
          User Management
        </div>
        <h1 className="page-title">Platform <span>Users</span></h1>
        <p className="page-desc">View details, monitor interview performance, and manage account access.</p>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <span className="card-title">
            <span className="material-symbols-outlined">manage_accounts</span>
            All Users ({filtered.length})
          </span>
          <div className="search-wrap">
            <span className="material-symbols-outlined">search</span>
            <input className="search-input" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>refresh</span>
            <p>Loading users from database...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Joined</th>
                <th>Interviews</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar-circle" style={{ background: 'var(--primary-bg)', color: 'var(--primary)', overflow: 'hidden' }}>
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : u.fullName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.fullName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td><span className="badge badge-primary">{u.interviewCount} sessions</span></td>
                  <td>
                    <span className={`badge ${u.isLocked ? 'badge-error' : 'badge-success'}`}>
                      {u.isLocked ? 'Locked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" title="View Details" onClick={() => handleOpenUser(u)}>
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button 
                        className="action-btn" 
                        title={u.isLocked ? "Unlock" : "Lock"} 
                        onClick={() => handleToggleLock(u._id)}
                        style={{ color: u.isLocked ? 'var(--success)' : 'var(--error)' }}
                      >
                        <span className="material-symbols-outlined">{u.isLocked ? 'lock_open' : 'lock'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" style={{ maxWidth: 800, width: '95%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">User Details</h3>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div style={{ padding: 24, maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: 24, marginBottom: 32, padding: 20, background: 'var(--surface-mid)', borderRadius: 16 }}>
                <div className="avatar-circle" style={{ width: 64, height: 64, fontSize: 24, overflow: 'hidden' }}>
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : selectedUser.fullName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800 }}>{selectedUser.fullName}</h2>
                  <p style={{ color: 'var(--text-dim)' }}>{selectedUser.email}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Joined: {formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 800 }}>Interview History</h4>
              {modalLoading ? (
                 <p>Loading history...</p>
              ) : userInterviews.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No interview sessions recorded yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {userInterviews.map(int => (
                    <div key={int._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{int.position}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{int.level} • {formatDate(int.createdAt)}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>{int.evaluation?.totalScore || 0}%</div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', borderRadius: 8 }} onClick={() => setViewingInterview(int)}>
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interview Detail Modal */}
      {viewingInterview && (
        <div className="modal-overlay" style={{ zIndex: 1100 }} onClick={() => setViewingInterview(null)}>
          <div className="modal" style={{ maxWidth: 900, width: '98%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{viewingInterview.position} Review</h3>
              <button className="modal-close" onClick={() => setViewingInterview(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ padding: 24, maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {viewingInterview.evaluation?.detailedFeedback?.map((d, i) => (
                  <div key={i} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 13 }}>Q{i + 1} ({d.score} pts)</span>
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 16 }}>{d.question}</p>
                    <div style={{ padding: 12, background: 'var(--primary-bg)', borderRadius: 8 }}>
                      <p style={{ fontSize: 14 }}>{d.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
