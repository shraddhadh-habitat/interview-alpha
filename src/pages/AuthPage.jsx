import { useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FAFAF8', card: '#FFFFFF',
  text: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.06)',
  orange: '#F97316',
  red: '#CF222E', redLight: 'rgba(207,34,46,0.06)', redBorder: 'rgba(207,34,46,0.18)',
  success: '#1A7F37', successLight: 'rgba(26,127,55,0.06)', successBorder: 'rgba(26,127,55,0.2)',
};

const RAINBOW = 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399)';

// FNV-1a 32-bit hash of browser environment signals — used to detect same-browser re-signups.
// Not stored in plain text on the server; collision rate is acceptable for abuse prevention.
function generateFingerprint() {
  const raw = [
    screen.width, screen.height, screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language, navigator.platform, navigator.userAgent,
  ].join('||');
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = (Math.imul(h, 16777619)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const TITLES    = { login: 'Welcome back', signup: 'Create your account', forgot: 'Reset your password' };
const SUBTITLES = {
  login:  'Sign in to continue your practice.',
  signup: '1 free AI session. No credit card needed.',
  forgot: "Enter your email and we'll send you a reset link.",
};

export default function AuthPage() {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const fingerprint = useMemo(() => generateFingerprint(), []);

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'signup') {
        // Gate 1: IP rate limit (max 2 signups per IP per 24h)
        const ipRes = await fetch('/api/signup-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (ipRes.status === 429) {
          const { error: ipErr } = await ipRes.json();
          throw new Error(ipErr);
        }

        // Gate 2: browser fingerprint — blocks same-browser re-signups
        const { data: fpExists } = await supabase.rpc('check_fingerprint_exists', { fp: fingerprint });
        if (fpExists) {
          throw new Error('It looks like you already have an account. Please sign in instead.');
        }

        // Create account (Supabase handles email confirmation flow)
        const { error: signUpErr } = await supabase.auth.signUp({ email, password });
        if (signUpErr) throw signUpErr;

        // Save fingerprint to profile (fire-and-forget — profile exists via DB trigger)
        supabase.rpc('set_pending_fingerprint', { p_email: email, fp: fingerprint });

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/?reset=true',
      });
      if (error) throw error;
      setSuccess('Check your email for a password reset link.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#FFFFFF',
    border: `1.5px solid ${C.border}`, borderRadius: 12,
    padding: '14px 18px', color: C.text, fontSize: 15,
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 };
  const btnStyle = (active) => ({
    width: '100%', height: 48,
    background: active ? RAINBOW : C.border,
    border: 'none', borderRadius: 12,
    color: active ? '#fff' : C.textMuted,
    fontSize: 16, cursor: active ? 'pointer' : 'wait',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600, opacity: active ? 1 : 0.7,
  });

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: ${C.green} !important; outline: none; }
        ::selection { background: rgba(22,163,74,0.18); }
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
        padding: '48px 56px', borderRight: `1px solid ${C.border}`,
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
            padding: '16px 20px', background: '#FFFFFF', border: `1px solid ${C.border}`,
            borderRadius: 12, fontSize: 16, fontWeight: 600, color: C.text,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            1 free AI session. No credit card.
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
          padding: '40px 40px', width: '100%', maxWidth: 440,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: C.text, marginBottom: 6 }}>
            {TITLES[mode]}
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>
            {SUBTITLES[mode]}
          </p>

          {error && (
            <div style={{ padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 12, fontSize: 13, color: C.red, marginBottom: 20 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 12, fontSize: 13, color: C.success, marginBottom: 20 }}>
              {success}
            </div>
          )}

          {/* ── Forgot password form ── */}
          {mode === 'forgot' && (
            <>
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: 28 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com" style={inputStyle}
                  />
                </div>
                <button type="submit" disabled={loading} style={btnStyle(!loading)}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button
                  onClick={() => switchMode('login')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  ← <span style={{ color: C.green, fontWeight: 600 }}>Back to Sign In</span>
                </button>
              </div>
            </>
          )}

          {/* ── Login / Signup form ── */}
          {mode !== 'forgot' && (
            <>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="you@example.com" style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8,
                  }}>
                    <span>Password</span>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 12, color: C.orange, fontWeight: 600,
                          fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0,
                        }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </label>
                  <input
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    style={inputStyle}
                  />
                </div>

                <button type="submit" disabled={loading} style={btnStyle(!loading)}>
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <span style={{ color: C.green, fontWeight: 600 }}>
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </span>
                </button>
              </div>

              {mode === 'signup' && (
                <p style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  One account per person. Multiple accounts will be suspended.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
