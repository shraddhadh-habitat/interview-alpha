import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import posthog from '../lib/analytics';

const RAINBOW = 'var(--gradient-brand)';

const C = {
  text: '#1B1B18', textMuted: 'rgba(27, 27, 24, 0.5)', textLight: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)', bg: '#FAFAF8',
  green: '#1B1B18',
  red: '#1B1B18', redLight: 'rgba(27, 27, 24, 0.08)', redBorder: 'rgba(27, 27, 24, 0.12)',
};

function AuthForm({ tab, mobile, onSuccess }) {
  const [name, setName]                   = useState('');
  const [phone, setPhone]                 = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [forgotSent, setForgotSent]       = useState(false);
  const [step, setStep]                   = useState('form'); // 'form' or 'verify-email'
  const [fieldErrors, setFieldErrors]     = useState({});

  // Reset on tab change
  useEffect(() => {
    setError('');
    setForgotSent(false);
    setStep('form');
    setFieldErrors({});
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      if (tab === 'signup') {
        posthog.capture('signup_attempted');
        // Check if user has a pending score from practice attempt
        const scoreToken = localStorage.getItem('ia:score_token');
        console.log('[LoginModal] score token at signup:', scoreToken);

        const newFieldErrors = {};

        // Validate full name
        if (name.trim().length < 2) {
          newFieldErrors.name = 'Please enter your full name (at least 2 characters).';
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          newFieldErrors.email = 'Please enter a valid email address.';
        }

        // Validate mobile number
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          newFieldErrors.phone = 'Please enter a valid 10-digit mobile number.';
        } else if (phoneDigits.length > 15) {
          newFieldErrors.phone = 'Please enter a valid mobile number.';
        }

        // Validate password
        if (password.length < 8) {
          newFieldErrors.password = 'Password must be at least 8 characters.';
        }

        // Validate confirm password
        if (password !== confirmPassword) {
          newFieldErrors.confirmPassword = 'Passwords do not match.';
        }

        // If there are field errors, show them and return
        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
          setLoading(false);
          return;
        }

        // Build redirect URL with score token if present
        const emailRedirectTo = scoreToken
          ? `https://www.interviewalpha.ai/auth/callback?next=practice&score_token=${scoreToken}`
          : 'https://www.interviewalpha.ai/auth/callback?next=practice';
        console.log('[LoginModal] emailRedirectTo:', emailRedirectTo);

        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo
          }
        });
        if (err) throw err;

        if (data?.user) {
          posthog.capture('signup_completed');
          // Store signup data in localStorage to be used after email verification
          localStorage.setItem('ia:pending_signup', JSON.stringify({
            userId: data.user.id,
            email,
            display_name: name.trim(),
            phone_number: phoneDigits
          }));

          // Get device info for new signup
          const ua = navigator.userAgent;
          const isAndroid = /android/i.test(ua);
          const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
          const deviceType = isAndroid ? 'android' : isIOS ? 'ios' : 'desktop';
          const deviceOS = isAndroid ? 'Android' : isIOS ? 'iOS' : /windows/i.test(ua) ? 'Windows' : /mac/i.test(ua) ? 'MacOS' : 'Other';

          // Save device info immediately, profile will be completed after email verification
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            display_name: name.trim(),
            phone_number: phoneDigits,
            device_type: deviceType,
            device_os: deviceOS
          });

          setStep('verify-email');
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onSuccess();
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) setError('Incorrect email or password.');
      else if (msg.includes('Email not confirmed')) setError('Please verify your email before signing in.');
      else if (msg.includes('User already registered')) setError('Account exists. Try signing in instead.');
      else setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError('Enter your email address above first.'); return; }
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email);
      if (err) throw err;
      setForgotSent(true);
    } catch {
      setError('Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      if (err) throw err;
      setError('Verification email resent. Check your inbox.');
    } catch (err) {
      setError('Could not resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${C.border}`, borderRadius: 12,
    fontSize: mobile ? 16 : 15,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: C.text, background: C.bg,
    boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.textMuted, marginBottom: 6,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  if (forgotSent) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: C.text, marginBottom: 8 }}>Check your inbox</div>
        <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
          Password reset link sent to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  if (step === 'verify-email') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📧</div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: C.text, marginBottom: 8 }}>Check your email</div>
        <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, marginBottom: 20 }}>
          We sent a verification link to <strong>{email}</strong>.<br />Click the link to activate your account and get your 3 free sessions.
        </p>
        <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Did not receive it? Check your spam folder or{' '}
          <span
            onClick={resendVerification}
            style={{ color: '#7ec8c8', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
          >
            {loading ? 'Resending...' : 'resend the email'}
          </span>
        </p>
        {error && <p style={{ fontSize: 12, color: C.text, marginTop: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          padding: '10px 14px', background: C.redLight,
          border: `1px solid ${C.redBorder}`, borderRadius: 10,
          fontSize: 13, color: C.red,
          marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {error}
        </div>
      )}

      {tab === 'signup' && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text" required value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your full name"
            minLength={2}
            style={{
              ...inputStyle,
              borderColor: fieldErrors.name ? '#ef4444' : inputStyle.borderColor
            }}
            onFocus={e => e.target.style.borderColor = fieldErrors.name ? '#ef4444' : C.green}
            onBlur={e => e.target.style.borderColor = fieldErrors.name ? '#ef4444' : C.border}
          />
          {fieldErrors.name && (
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {fieldErrors.name}
            </div>
          )}
        </div>
      )}

      {tab === 'signup' && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Mobile Number</label>
          <input
            type="tel" required value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            inputMode="tel"
            style={{
              ...inputStyle,
              borderColor: fieldErrors.phone ? '#ef4444' : inputStyle.borderColor
            }}
            onFocus={e => e.target.style.borderColor = fieldErrors.phone ? '#ef4444' : C.green}
            onBlur={e => e.target.style.borderColor = fieldErrors.phone ? '#ef4444' : C.border}
          />
          {fieldErrors.phone && (
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {fieldErrors.phone}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{
            ...inputStyle,
            borderColor: fieldErrors.email ? '#ef4444' : inputStyle.borderColor
          }}
          onFocus={e => e.target.style.borderColor = fieldErrors.email ? '#ef4444' : C.green}
          onBlur={e => e.target.style.borderColor = fieldErrors.email ? '#ef4444' : C.border}
        />
        {fieldErrors.email && (
          <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {fieldErrors.email}
          </div>
        )}
      </div>

      <div style={{ marginBottom: tab === 'signup' ? 14 : 0 }}>
        <label style={labelStyle}>Password</label>
        <input
          type="password" required value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={tab === 'signup' ? 'Min. 8 characters' : 'Your password'}
          style={{
            ...inputStyle,
            borderColor: fieldErrors.password ? '#ef4444' : inputStyle.borderColor
          }}
          onFocus={e => e.target.style.borderColor = fieldErrors.password ? '#ef4444' : C.green}
          onBlur={e => e.target.style.borderColor = fieldErrors.password ? '#ef4444' : C.border}
        />
        {fieldErrors.password && (
          <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {fieldErrors.password}
          </div>
        )}
      </div>

      {tab === 'signup' && (
        <div style={{ marginBottom: 0 }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password" required value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            style={{
              ...inputStyle,
              borderColor: fieldErrors.confirmPassword ? '#ef4444' : inputStyle.borderColor
            }}
            onFocus={e => e.target.style.borderColor = fieldErrors.confirmPassword ? '#ef4444' : C.green}
            onBlur={e => e.target.style.borderColor = fieldErrors.confirmPassword ? '#ef4444' : C.border}
          />
          {fieldErrors.confirmPassword && (
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>
      )}

      {tab === 'signin' && (
        <div style={{ textAlign: 'right', marginTop: 6, marginBottom: 4 }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            style={{
              background: 'none', border: 'none',
              fontSize: mobile ? 15 : 13, color: C.textMuted,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: mobile ? '10px 0' : '4px 0',
              minHeight: mobile ? 44 : 'auto',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            Forgot password?
          </button>
        </div>
      )}

      <div style={{ marginTop: tab === 'signup' ? 24 : 20 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', height: 48,
            background: loading ? C.border : RAINBOW,
            border: 'none', borderRadius: 12,
            color: loading ? C.textMuted : '#fff',
            fontSize: 16, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </form>
  );
}

function TabBar({ tab, setTab, mobile }) {
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
      {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([id, label]) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          style={{
            flex: mobile ? 1 : 'none',
            padding: mobile ? '12px 0' : '10px 20px',
            background: 'none', border: 'none',
            borderBottom: tab === id ? `2px solid ${C.green}` : '2px solid transparent',
            fontSize: mobile ? 15 : 14,
            fontWeight: tab === id ? 700 : 500,
            color: tab === id ? C.green : C.textMuted,
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.15s', marginBottom: -1,
            minHeight: mobile ? 44 : 'auto',
          }}
        >{label}</button>
      ))}
    </div>
  );
}

export default function LoginModal({ isOpen, onClose, onSuccess, message, defaultTab }) {
  const [tab, setTab] = useState('signin');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Escape to close (desktop)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Set tab on open, respecting defaultTab prop
  useEffect(() => {
    if (isOpen) setTab(defaultTab || 'signin');
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const Logo = () => (
    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: C.text, marginBottom: 4 }}>
      Interview<span style={{ color: C.green }}>Alpha</span>
      <sup style={{ fontSize: 9, color: C.textLight, verticalAlign: 'super' }}>™</sup>
    </div>
  );

  const Title = ({ size = 24 }) => (
    <h2 style={{
      fontFamily: "'Instrument Serif', serif", fontSize: size,
      fontWeight: 400, color: C.text, margin: '0 0 16px',
    }}>
      {message || 'Sign in to continue'}
    </h2>
  );

  if (isMobile) {
    return (
      <>
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)' }}
        />
        {/* Sheet */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2001,
          background: '#fff', borderRadius: '24px 24px 0 0',
          padding: '20px 20px 48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          animation: 'slideUp 0.3s cubic-bezier(0.22,1,0.36,1)',
          maxHeight: '92vh', overflowY: 'auto',
        }}>
          {/* Handle */}
          <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: '0 auto 16px' }} />
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 44, height: 44, minWidth: 44, minHeight: 44,
              background: '#F5F3EF', border: 'none', borderRadius: '50%',
              fontSize: 20, cursor: 'pointer', color: C.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
          <Logo />
          <Title size={22} />
          <TabBar tab={tab} setTab={setTab} mobile />
          <AuthForm key={tab} tab={tab} mobile onSuccess={onSuccess} />
        </div>
      </>
    );
  }

  // Desktop
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        {/* Card */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20, padding: '32px',
            width: '100%', maxWidth: 440,
            boxShadow: '0 16px 60px rgba(0,0,0,0.2)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32,
              background: '#F5F3EF', border: 'none', borderRadius: '50%',
              fontSize: 16, cursor: 'pointer', color: C.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
          <Logo />
          <Title size={26} />
          <TabBar tab={tab} setTab={setTab} mobile={false} />
          <AuthForm key={tab} tab={tab} mobile={false} onSuccess={onSuccess} />
        </div>
      </div>
    </>
  );
}
