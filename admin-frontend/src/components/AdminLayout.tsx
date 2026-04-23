import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const ADMIN_TOKEN_KEY = 'admin_token';
const THEME_KEY = 'admin_theme';

interface AdminLayoutProps {
  children: ReactNode;
  activePage: string;
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Questions', icon: 'quiz', path: '/questions' },
  { label: 'Users', icon: 'group', path: '/users' },
  { label: 'Talent Pool', icon: 'military_tech', path: '/talent-pool' },
  { label: 'System Data', icon: 'settings_input_component', path: '/system-data' },
];

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [adminName] = useState('Admin');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) !== 'light');

  useEffect(() => {
    if (isDark) {
      document.documentElement.style.setProperty('--bg', '#0f1115');
      document.documentElement.style.setProperty('--surface', '#16191f');
      document.documentElement.style.setProperty('--surface-lo', '#1c2027');
      document.documentElement.style.setProperty('--surface-mid', '#252a33');
      document.documentElement.style.setProperty('--surface-hi', '#2d333d');
      document.documentElement.style.setProperty('--surface-highest', '#383f4d');
      document.documentElement.style.setProperty('--text', '#f8fafc');
      document.documentElement.style.setProperty('--text-dim', '#94a3b8');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.06)');
      document.documentElement.style.setProperty('--border-mid', 'rgba(255,255,255,0.12)');
      document.documentElement.style.setProperty('--topnav-bg', 'rgba(15, 17, 21, 0.8)');
    } else {
      document.documentElement.style.setProperty('--bg', '#fcfcfd');
      document.documentElement.style.setProperty('--surface', '#ffffff');
      document.documentElement.style.setProperty('--surface-lo', '#ffffff');
      document.documentElement.style.setProperty('--surface-mid', '#f1f5f9');
      document.documentElement.style.setProperty('--surface-hi', '#e2e8f0');
      document.documentElement.style.setProperty('--surface-highest', '#cbd5e1');
      document.documentElement.style.setProperty('--text', '#0f172a');
      document.documentElement.style.setProperty('--text-dim', '#334155');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.documentElement.style.setProperty('--border', '#e2e8f0');
      document.documentElement.style.setProperty('--border-mid', '#cbd5e1');
      document.documentElement.style.setProperty('--topnav-bg', 'rgba(255, 255, 255, 0.8)');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate('/login');
  };

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <div className="admin-shell">
      <Toaster position="top-right" />
      {/* TopNav */}
      <header className="topnav">
        <div className="topnav-brand">
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>shield</span>
          Obsidian AI
          <span className="topnav-brand-badge">Admin</span>
        </div>

        <div className="topnav-actions">
          <button className="btn-icon" title="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-mid)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 12px 6px 8px', cursor: 'pointer' }}
            >
              <div className="avatar-circle" style={{ background: 'var(--primary-bg)', color: 'var(--primary)', width: 28, height: 28, fontSize: 11 }}>A</div>
              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{adminName}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--text-muted)' }}>expand_more</span>
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 44, right: 0, width: 180,
                background: 'var(--surface-lo)', border: '1px solid var(--border)',
                borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.4)', padding: 8, zIndex: 200
              }}>
                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 9, background: 'transparent', border: 'none', color: 'var(--error)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <span className="sidebar-section-label">Navigation</span>
        {NAV_ITEMS.map(item => (
          <div
            key={item.path}
            className={`sidebar-item ${activePage === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="divider" />
          <div className="sidebar-item" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            Logout
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
