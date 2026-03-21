import { useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#555555', textMuted: '#999999',
  border: '#E5E5E5',
  orange: '#E8650A', orangeHover: '#D45800', orangeLight: 'rgba(232,101,10,0.08)',
  red: '#D32F2F', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
};

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Account created — check your email to confirm, then log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // App.jsx auth listener will handle the redirect
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: C.bgSoft,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: '14px 18px',
    color: C.text,
    fontSize: 14,
    fontFamily: "'Source Serif 4', serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
      color: C.text,
      padding: 32,
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: ${C.orange} !important; }
        ::selection { background: rgba(232,101,10,0.18); }
      `}</style>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.orangeHover})` }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, letterSpacing: -1.5, color: C.text }}>
            Interview<span style={{ color: C.orange }}>Alpha</span>
          </h1>
          <div style={{ width: 36, height: 3, background: C.orange, margin: '16px auto 0', borderRadius: 2 }} />
        </div>

        {/* Card */}
        <div style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 36,
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, marginBottom: 8 }}>
              {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 6, fontSize: 12, color: C.red, marginBottom: 20 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 6, fontSize: 12, color: C.green, marginBottom: 20 }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: loading ? C.bgMuted : C.orange,
                border: 'none',
                borderRadius: 8,
                color: loading ? C.textMuted : '#fff',
                fontSize: 11,
                letterSpacing: 3,
                textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.orangeHover; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = C.orange; }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span style={{ color: C.orange, textDecoration: 'underline' }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
