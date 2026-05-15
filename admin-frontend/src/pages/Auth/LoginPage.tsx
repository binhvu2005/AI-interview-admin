import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    // Temporary: simple hardcoded check; replace with real API later
    await new Promise(r => setTimeout(r, 600));
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_token', 'mock_token_' + Date.now());
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try admin / admin123');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--primary-bg)', border: '1px solid var(--primary-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 28 }}>shield</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Obsidian AI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Admin Control Panel</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Enter your administrator credentials</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ background: 'var(--error-bg)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, padding: '10px 14px', color: 'var(--error)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ justifyContent: 'center', padding: '12px' }}>
              {loading ? (
                <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite', fontSize: 18 }}>refresh</span>
              ) : (
                <span className="material-symbols-outlined">login</span>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
