import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './lib/supabase';
import InterviewAlpha from './InterviewAlpha';
import LandingPage from './components/LandingPage';
import PastSessions from './pages/PastSessions';
import PracticeQA from './pages/PracticeQA';
import MyProgress from './pages/MyProgress';
import SalaryGuide from './pages/SalaryGuide';
import ATSChecker from './pages/ATSChecker';
import ResumeOptimizer from './pages/ResumeOptimizer';
import ResumeTemplates from './pages/ResumeTemplates';
import ResumeToolsHub from './pages/ResumeToolsHub';
import LearningResources from './pages/LearningResources';
import CompanyQuestions from './pages/CompanyQuestions';
import UpgradePage from './pages/UpgradePage';
import AdminPanel from './pages/AdminPanel';
import Scorecard from './pages/Scorecard';
import About from './pages/About';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Nav from './components/Nav';
import Footer from './components/Footer';
import DemoTutorial from './components/DemoTutorial';
import PaywallModal from './components/PaywallModal';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './contexts/AuthContext';
import QuickStart from './components/QuickStart';
import ReviewWidget from './components/ReviewWidget';

const C = { bg: '#FAFAF8', text: '#0A0A0A', textMuted: '#9C9C97', green: '#16A34A' };

const RAINBOW = 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FDCD34)';
const RC = {
  bg: '#FAFAF8', text: '#0A0A0A', textMuted: '#5C5C57', border: '#E8E6E1',
  green: '#16A34A',
  red: '#CF222E', redLight: 'rgba(207,34,46,0.06)', redBorder: 'rgba(207,34,46,0.18)',
  success: '#1A7F37', successLight: 'rgba(26,127,55,0.06)', successBorder: 'rgba(26,127,55,0.2)',
};

function ResetPasswordPage({ onDone }) {
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess(true);
      setTimeout(onDone, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#FFFFFF',
    border: `1.5px solid ${RC.border}`, borderRadius: 12,
    padding: '14px 18px', color: RC.text, fontSize: 15,
    fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: RC.bg, display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif", color: RC.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: ${RC.green} !important; outline: none; }
        @media (max-width: 768px) { .rp-left { display: none !important; } }
      `}</style>

      <div className="rp-left" style={{
        flex: 1, minWidth: 0,
        background: 'linear-gradient(135deg, #FAFAF8, #F5F3EF)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 56px', borderRight: `1px solid ${RC.border}`,
      }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400,
            marginBottom: 24, lineHeight: 1.1,
            background: RAINBOW, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            InterviewAlpha.ai™
          </h1>
          <p style={{ fontSize: 16, color: RC.textMuted, lineHeight: 1.7 }}>
            Almost there. Set a strong new password to get back to your practice.
          </p>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{
          background: '#FFFFFF', borderRadius: 24,
          border: `1px solid ${RC.border}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
          padding: '40px 40px', width: '100%', maxWidth: 440,
          animation: 'fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: RC.text, marginBottom: 6 }}>
            Set new password
          </h2>
          <p style={{ fontSize: 14, color: RC.textMuted, marginBottom: 28 }}>
            Choose a strong password: minimum 8 characters.
          </p>

          {error && (
            <div style={{ padding: '10px 14px', background: RC.redLight, border: `1px solid ${RC.redBorder}`, borderRadius: 12, fontSize: 13, color: RC.red, marginBottom: 20 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '10px 14px', background: RC.successLight, border: `1px solid ${RC.successBorder}`, borderRadius: 12, fontSize: 13, color: RC.success, marginBottom: 20 }}>
              Password updated successfully! Redirecting to sign in...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: RC.textMuted, marginBottom: 8 }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Min. 8 characters" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: RC.textMuted, marginBottom: 8 }}>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat password" style={inputStyle} />
              </div>
              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', height: 48,
                  background: loading ? RC.border : RAINBOW,
                  border: 'none', borderRadius: 12,
                  color: loading ? RC.textMuted : '#fff',
                  fontSize: 16, cursor: loading ? 'wait' : 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const FREE_SESSION_LIMIT  = 3;
const PRO_SESSION_LIMIT   = 100;
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());

function MissingNameModal({ user, onSave }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) { setError('Please enter at least 2 characters.'); return; }
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase.from('profiles').upsert({
        id: user.id, email: user.email, display_name: name.trim(),
      });
      if (err) throw err;
      onSave(name.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`@keyframes mnFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 32px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        animation: 'mnFadeUp 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400, color: '#0A0A0A', marginBottom: 8 }}>
          Welcome back!
        </div>
        <p style={{ fontSize: 14, color: '#5C5C57', marginBottom: 28, lineHeight: 1.6 }}>
          Please add your name to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5C57', marginBottom: 8 }}>
              Full Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              minLength={2}
              required
              style={{
                width: '100%', padding: '13px 16px',
                border: '1.5px solid #E8E6E1', borderRadius: 12,
                fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#0A0A0A', background: '#FAFAF8',
                boxSizing: 'border-box', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E8E6E1'}
            />
          </div>
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(207,34,46,0.06)', border: '1px solid rgba(207,34,46,0.18)', borderRadius: 10, fontSize: 13, color: '#CF222E' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%', height: 48,
              background: saving ? '#E8E6E1' : '#16A34A',
              border: 'none', borderRadius: 12,
              color: saving ? '#5C5C57' : '#fff',
              fontSize: 16, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

function MissingPhoneModal({ user, onSave }) {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) { setError('Please enter a valid mobile number.'); return; }
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase.from('profiles').upsert({
        id: user.id, email: user.email, phone_number: phoneDigits,
      });
      if (err) throw err;
      onSave(phoneDigits);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`@keyframes mnFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '36px 32px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        animation: 'mnFadeUp 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 400, color: '#0A0A0A', marginBottom: 8 }}>
          Phone Number Required
        </div>
        <p style={{ fontSize: 14, color: '#5C5C57', marginBottom: 28, lineHeight: 1.6 }}>
          Please add your mobile number to continue.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#5C5C57', marginBottom: 8 }}>
              Mobile Number
            </label>
            <input
              autoFocus
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              inputMode="tel"
              required
              style={{
                width: '100%', padding: '13px 16px',
                border: '1.5px solid #E8E6E1', borderRadius: 12,
                fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#0A0A0A', background: '#FAFAF8',
                boxSizing: 'border-box', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E8E6E1'}
            />
          </div>
          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(207,34,46,0.06)', border: '1px solid rgba(207,34,46,0.18)', borderRadius: 10, fontSize: 13, color: '#CF222E' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%', height: 48,
              background: saving ? '#E8E6E1' : '#16A34A',
              border: 'none', borderRadius: 12,
              color: saving ? '#5C5C57' : '#fff',
              fontSize: 16, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: C.text, marginBottom: 16 }}>
          Interview<span style={{ color: C.green }}>Alpha</span><span style={{ fontSize: 13, verticalAlign: 'super', color: C.textMuted }}>™</span>
        </div>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase' }}>Loading...</div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('interview');
  const [showDemo, setShowDemo] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [postLoginDestination, setPostLoginDestination] = useState(null);
  const [profileLoaded, setProfileLoaded]   = useState(false);
  const quickStartCheckedRef = useRef(false);

  const [profile, setProfile] = useState({
    subscription_status:       'free',
    subscription_plan:         null,
    subscription_expires_at:   null,
    free_sessions_used:        0,
    monthly_sessions_used:     0,
    monthly_sessions_reset_at: null,
    display_name:              null,
    phone_number:              null,
  });
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setShowResetPassword(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener('ia:navigate', handler);
    return () => window.removeEventListener('ia:navigate', handler);
  }, []);

  // Set body background to warm grey frame
  useEffect(() => {
    document.body.style.background = '#E8E6E1';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    return () => {
      document.body.style.background = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  const loadProfile = useCallback(async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        subscription_status,
        subscription_plan,
        subscription_expires_at,
        free_sessions_used,
        monthly_sessions_used,
        monthly_sessions_reset_at,
        display_name,
        phone_number
      `)
      .eq('id', uid)
      .single();

    let status = data?.subscription_status ?? 'free';
    if (status === 'active' && data?.subscription_expires_at) {
      if (new Date(data.subscription_expires_at) < new Date()) {
        status = 'expired';
        supabase.from('profiles').update({ subscription_status: 'expired' }).eq('id', uid);
      }
    }

    setProfile({
      subscription_status:       status,
      subscription_plan:         data?.subscription_plan         ?? null,
      subscription_expires_at:   data?.subscription_expires_at   ?? null,
      free_sessions_used:        data?.free_sessions_used        ?? 0,
      monthly_sessions_used:     data?.monthly_sessions_used     ?? 0,
      monthly_sessions_reset_at: data?.monthly_sessions_reset_at ?? null,
      display_name:              data?.display_name              ?? null,
      phone_number:              data?.phone_number              ?? null,
    });
    setProfileLoaded(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setProfileLoaded(false);
      quickStartCheckedRef.current = false;
      return;
    }
    loadProfile(user.id);
  }, [user, loadProfile]);

  // Update last_seen_at on every page load/session restore
  useEffect(() => {
    if (!user) return;
    const updateLastSeen = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', user.id);
      } catch (err) {
        console.error('Failed to update last_seen_at:', err);
      }
    };
    updateLastSeen();
  }, [user]);

  const onSessionUsed = useCallback(async () => {
    if (!user) return;
    const status = profile.subscription_status;

    if (status === 'active') {
      let newMonthly = profile.monthly_sessions_used + 1;
      let resetAt    = profile.monthly_sessions_reset_at;
      if (resetAt && new Date(resetAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        newMonthly = 1;
        resetAt    = new Date().toISOString();
      }
      setProfile(prev => ({ ...prev, monthly_sessions_used: newMonthly, monthly_sessions_reset_at: resetAt }));
      await supabase.from('profiles').update({
        monthly_sessions_used:     newMonthly,
        monthly_sessions_reset_at: resetAt ?? new Date().toISOString(),
      }).eq('id', user.id);
    } else if (status === 'free') {
      const newCount = profile.free_sessions_used + 1;
      setProfile(prev => ({ ...prev, free_sessions_used: newCount }));
      await supabase.from('profiles').update({ free_sessions_used: newCount }).eq('id', user.id);
    }
  }, [user, profile]);

  // Show QuickStart once for first-time users (0 sessions, never seen before).
  // Only runs after profile is confirmed loaded from Supabase (profileLoaded flag).
  useEffect(() => {
    if (!user || !profileLoaded || quickStartCheckedRef.current) return;
    quickStartCheckedRef.current = true;
    if (profile.free_sessions_used === 0 && profile.monthly_sessions_used === 0) {
      const key = 'ia:qs_' + user.id;
      if (!localStorage.getItem(key)) {
        setShowQuickStart(true);
      }
    }
  }, [user, profileLoaded, profile.free_sessions_used, profile.monthly_sessions_used]);

  // Show name prompt for existing users who haven't set a display_name yet.
  // Skip if user just signed up (flag set by LoginModal signup flow).
  // Skip if user is an admin.
  useEffect(() => {
    if (!user || !profileLoaded) return;
    const isAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email?.toLowerCase());
    if (isAdmin) return;
    if (!profile.display_name) {
      const justSignedUp = localStorage.getItem('ia:just_signed_up');
      if (justSignedUp) {
        localStorage.removeItem('ia:just_signed_up');
        return;
      }
      setShowNamePrompt(true);
    }
  }, [user, profileLoaded, profile.display_name]);

  // Show phone prompt for existing users who haven't set a phone_number yet.
  // Skip if user just signed up (flag set by LoginModal signup flow).
  // Skip if user is an admin.
  useEffect(() => {
    if (!user || !profileLoaded) return;
    const isAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email?.toLowerCase());
    if (isAdmin) return;
    if (!profile.phone_number) {
      const justSignedUp = localStorage.getItem('ia:just_signed_up');
      if (justSignedUp) {
        localStorage.removeItem('ia:just_signed_up');
        return;
      }
      setShowPhonePrompt(true);
    }
  }, [user, profileLoaded, profile.phone_number]);

  const handleQuickStartDismiss = useCallback(() => {
    if (user) localStorage.setItem('ia:qs_' + user.id, '1');
    setShowQuickStart(false);
  }, [user]);

  const handleQuickStartExplore = useCallback(() => {
    if (user) localStorage.setItem('ia:qs_' + user.id, '1');
    setShowQuickStart(false);
    setPage('practice');
  }, [user]);

  const handleDemoClose = useCallback(async () => {
    setShowDemo(false);
    if (!user) return;
    await supabase.from('profiles').upsert({ id: user.id, has_seen_demo: true }, { onConflict: 'id' });
  }, [user]);

  const checkSession = useCallback(() => {
    const { subscription_status: status, free_sessions_used: used, monthly_sessions_used: monthly } = profile;

    if (status === 'active') {
      if ((monthly ?? 0) >= PRO_SESSION_LIMIT) { setPage('upgrade'); return false; }
      return true;
    }
    if (status === 'pending') { setPage('upgrade'); return false; }
    if (status === 'expired') { setPage('upgrade'); return false; }
    if (used < FREE_SESSION_LIMIT) return true;
    setShowPaywall(true);
    return false;
  }, [profile]);

  // LandingPage handlers
  const handleLandingPrimaryCTA = useCallback(() => {
    if (!user) {
      setPostLoginDestination('practice');
      setLoginMessage('Sign up to get AI feedback');
      setShowLoginModal(true);
    } else {
      setPage('practice');
    }
  }, [user]);

  const handleLandingBrowse = useCallback(() => {
    setPage('practice');
  }, []);

  const handleLandingPath = useCallback((pathType) => {
    if (pathType === 'product-sense' && !user) {
      setLoginMessage('Sign up to get AI feedback');
      setShowLoginModal(true);
    } else {
      setPage('practice');
    }
  }, [user]);

  if (authLoading) return <LoadingScreen />;
  if (showResetPassword) return <ResetPasswordPage onDone={() => { setShowResetPassword(false); supabase.auth.signOut(); }} />;

  const isAdmin = user && ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  return (
    <AuthProvider user={user}>
      {showNamePrompt && user && (
        <MissingNameModal
          user={user}
          onSave={(savedName) => {
            setProfile(prev => ({ ...prev, display_name: savedName }));
            setShowNamePrompt(false);
          }}
        />
      )}
      {showPhonePrompt && user && (
        <MissingPhoneModal
          user={user}
          onSave={(phoneNumber) => {
            setProfile(prev => ({ ...prev, phone_number: phoneNumber }));
            setShowPhonePrompt(false);
          }}
        />
      )}
      <style>{`
        @media (max-width: 768px) {
          .app-container { margin: 8px auto !important; }
        }
      `}</style>
      <div className="app-container" style={{ maxWidth: '1200px', margin: '20px auto', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', minHeight: 'calc(100vh - 40px)', overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Nav
          user={user}
          page={page}
          setPage={setPage}
          onReplayDemo={user ? () => setShowDemo(true) : null}
          profile={profile}
          onUpgradeClick={() => setPage('upgrade')}
          isAdmin={isAdmin}
        />
        <div style={{ flex: 1 }}>
          {page === 'interview'   && (
            <LandingPage
              user={user}
              onNavigate={(destination) => setPage(destination)}
              onLogin={() => { setPostLoginDestination('practice'); setLoginMessage('Sign up to get AI feedback'); setShowLoginModal(true); }}
            />
          )}
          {page === 'practice'    && (
            <PracticeQA
              user={user}
              profile={profile}
              checkSession={checkSession}
              onSessionUsed={onSessionUsed}
            />
          )}
          {page === 'sessions'    && <PastSessions user={user} />}
          {page === 'progress'    && <MyProgress user={user} />}
          {page === 'scorecard'   && <Scorecard user={user} />}
          {page === 'salary'      && <SalaryGuide user={user} onPracticeCTA={handleLandingPrimaryCTA} />}
          {page === 'resume-tools' && <ResumeToolsHub user={user} />}
          {page === 'resources'   && <LearningResources />}
          {page === 'upgrade'     && (
            <UpgradePage
              user={user}
              profile={profile}
              onBack={() => setPage('interview')}
            />
          )}
          {page === 'admin' && isAdmin && <AdminPanel user={user} />}
          {page === 'about'     && <About />}
          {page === 'careers'   && <Careers />}
          {page === 'blog'      && <Blog />}
          {page === 'blog-feedback-black-hole' && <BlogPost />}
          {page === 'terms' && <TermsOfService />}
          {page === 'privacy' && <PrivacyPolicy />}
        </div>
        <Footer />
        {user && !showQuickStart && <ReviewWidget user={user} profile={profile} />}
        {user && showQuickStart && (
          <QuickStart
            onDismiss={handleQuickStartDismiss}
            onSessionUsed={onSessionUsed}
            onExplore={handleQuickStartExplore}
          />
        )}
        {user && showDemo && <DemoTutorial onClose={handleDemoClose} />}
        {user && showPaywall && (
          <PaywallModal
            lastSession
            onClose={() => setShowPaywall(false)}
            onUpgrade={() => { setShowPaywall(false); setPage('upgrade'); }}
          />
        )}
        {showLoginModal && (
          <LoginModal
            message={loginMessage}
            onClose={() => {
              setShowLoginModal(false);
              setLoginMessage('');
              setPostLoginDestination(null);
              setLandingPracticeQuestion(null);
            }}
            onSuccess={() => {
              setShowLoginModal(false);
              setLoginMessage('');
              if (postLoginDestination) {
                setPage(postLoginDestination);
                setPostLoginDestination(null);
              }
            }}
          />
        )}
      </div>
    </AuthProvider>
  );
}
