import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

interface Author {
  _id: string;
  fullName: string;
  email: string;
  isVip?: boolean;
}

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: Author;
  tags: string[];
  date: string;
  likes: string[];
  views: number;
  replies: any[];
  isHidden?: boolean;
}

const API_BASE = 'http://localhost:5001/api/admin/forum';

export default function ForumAdminPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      await fetch(`${API_BASE}/${id}/toggle-visibility`, { method: 'PUT' });
      fetchPosts();
    } catch (err) {
      console.error('Visibility error:', err);
    }
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.author?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <AdminLayout activePage="/forum">
      <div className="page-header">
        <div className="page-tag">
          <span className="material-symbols-outlined">forum</span>
          Community
        </div>
        <h1 className="page-title">Forum <span>Management</span></h1>
        <p className="page-desc">Moderate community discussions, hide inappropriate content, and oversee engagement.</p>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <span className="card-title">
            <span className="material-symbols-outlined">article</span>
            All Posts ({filtered.length})
          </span>
          <div className="search-wrap">
            <span className="material-symbols-outlined">search</span>
            <input className="search-input" placeholder="Search posts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>refresh</span>
            <p>Loading posts from database...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Title</th>
                <th>Stats</th>
                <th>Posted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} style={{ opacity: p.isHidden ? 0.6 : 1 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar-circle" style={{ background: 'var(--primary-bg)', color: 'var(--primary)', overflow: 'hidden' }}>
                        {p.author?.fullName?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {p.author?.fullName || 'Unknown'}
                          {p.author?.isVip && <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--accent)' }}>workspace_premium</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.author?.email || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: 250 }}>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)', display: 'flex', gap: 4, marginTop: 4 }}>
                        {p.tags?.map(t => <span key={t} style={{ background: 'var(--surface-high)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-dim)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>favorite</span> {p.likes?.length || 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>chat_bubble</span> {p.replies?.length || 0}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span> {p.views || 0}</span>
                    </div>
                  </td>
                  <td>{formatDate(p.date)}</td>
                  <td>
                    <span className={`badge ${p.isHidden ? 'badge-error' : 'badge-success'}`}>
                      {p.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="action-btn" 
                        title={p.isHidden ? "Unhide Post" : "Hide Post"} 
                        onClick={() => handleToggleVisibility(p._id)}
                        style={{ color: p.isHidden ? 'var(--success)' : 'var(--error)' }}
                      >
                        <span className="material-symbols-outlined">{p.isHidden ? 'visibility' : 'visibility_off'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
