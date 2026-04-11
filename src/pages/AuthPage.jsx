import { useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FAFAF8', card: '#FFFFFF',
  text: '#1B1B18', textMuted: '#5C5C57',
  border: '#E8E6E1',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.06)',
  red: '#CF222E', redLight: 'rgba(207,34,46,0.06)', redBorder: 'rgba(207,34,46,0.18)',
  green: '#1A7F37', greenLight: 'rgba(26,127,55,0.06)', greenBorder: 'rgba(26,127,55,0.2)',
};

const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
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
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.text,
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: ${C.orange} !important; outline: none; }
        ::selection { background: rgba(232,101,10,0.18); }
        @media (max-width: 768px) {
          .auth-left { display: none !important; }
          .auth-right { min-width: 0 !important; }
        }
      `}</style>

      {/* Left panel */}
      <div className="auth-left" style={{
        flex: 1, minWidth: 0,
        background: 'linear-gradient(135deg, #FAFAF8, #F5F3EF)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px',
        borderRight: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400,
            marginBottom: 32, lineHeight: 1.1,
            background: RAINBOW, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            InterviewAlpha™
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
            {[
              { icon: '🎯', text: '1,100+ Expert PM Questions' },
              { icon: '🤖', text: 'AI Interviewer with Real-Time Feedback' },
              { icon: '📊', text: 'Personalized Scorecard & Study Plan' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px 20px',
            background: '#FFFFFF', border: `1px solid ${C.border}`,
            borderRadius: 12, fontSize: 16, fontWeight: 600, color: C.text,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            3 free AI sessions. No credit card.
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right" style={{
        flex: 1, minWidth: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px',
      }}>
        <div style={{
          background: '#FFFFFF', borderRadius: 24,
          border: `1px solid ${C.border}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
          padding: '40px 40px',
          width: '100%', maxWidth: 440,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400,
            color: C.text, marginBottom: 6,
          }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to continue your practice.' : 'Start with 3 free AI interview sessions.'}
          </p>

          {error && (
            <div style={{ padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 12, fontSize: 13, color: C.red, marginBottom: 20 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 12, fontSize: 13, color: C.green, marginBottom: 20 }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', background: '#FFFFFF',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12, padding: '14px 18px',
                  color: C.text, fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                style={{
                  width: '100%', background: '#FFFFFF',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12, padding: '14px 18px',
                  color: C.text, fontSize: 15,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48,
                background: loading ? C.border : RAINBOW,
                border: 'none', borderRadius: 12,
                color: loading ? C.textMuted : '#fff',
                fontSize: 16,
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span style={{ color: C.orange, fontWeight: 600 }}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
