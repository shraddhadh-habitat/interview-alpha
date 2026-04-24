import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './lib/supabase';
import InterviewAlpha from './InterviewAlpha';
import AuthPage from './pages/AuthPage';
import PastSessions from './pages/PastSessions';
import PracticeQA from './pages/PracticeQA';
import MyProgress from './pages/MyProgress';
import SalaryGuide from './pages/SalaryGuide';
import LearningResources from './pages/LearningResources';
import CompanyQuestions from './pages/CompanyQuestions';
import UpgradePage from './pages/UpgradePage';
import AdminPanel from './pages/AdminPanel';
import Scorecard from './pages/Scorecard';
import Nav from './components/Nav';
import Footer from './components/Footer';
import DemoTutorial from './components/DemoTutorial';
import PaywallModal from './components/PaywallModal';

const C = { bg: '#FAFAF8', text: '#0A0A0A', textMuted: '#9C9C97', green: '#16A34A' };

const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';
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

      {/* Left panel */}
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
            InterviewAlpha™
          </h1>
          <p style={{ fontSize: 16, color: RC.textMuted, lineHeight: 1.7 }}>
            Almost there — set a strong new password to get back to your practice.
          </p>
        </div>
      </div>

      {/* Right panel */}
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
            Choose a strong password — minimum 8 characters.
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
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: RC.textMuted, marginBottom: 8 }}>
                  New Password
                </label>
                <input
                  type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  required placeholder="Min. 8 characters" style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: RC.textMuted, marginBottom: 8 }}>
                  Confirm Password
                </label>
                <input
                  type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  required placeholder="Repeat password" style={inputStyle}
                />
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
  // Prevent re-triggering demo on repeated loadProfile calls (TOKEN_REFRESHED etc.)
  const demoShownRef = useRef(false);

  const [profile, setProfile] = useState({
    subscription_status:       'free',
    subscription_plan:         null,
    subscription_expires_at:   null,
    free_sessions_used:        0,
    monthly_sessions_used:     0,
    monthly_sessions_reset_at: null,
  });

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

  const loadProfile = useCallback(async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        has_seen_demo,
        subscription_status,
        subscription_plan,
        subscription_expires_at,
        free_sessions_used,
        monthly_sessions_used,
        monthly_sessions_reset_at
      `)
      .eq('id', uid)
      .single();

    // Show demo only if DB says unseen AND we haven't shown it this session.
    // Write has_seen_demo:true to DB immediately so a refresh mid-demo never re-shows it.
    if (!data?.has_seen_demo && !demoShownRef.current) {
      demoShownRef.current = true;
      setShowDemo(true);
      supabase.from('profiles').upsert({ id: uid, has_seen_demo: true }, { onConflict: 'id' });
      // First login → skip high-friction Interview page, land on Practice Q&A
      setPage('practice');
      sessionStorage.setItem('ia:welcome', '1');
    }

    // Auto-expire: if active but past expiry, mark as expired locally
    let status = data?.subscription_status ?? 'free';
    if (status === 'active' && data?.subscription_expires_at) {
      if (new Date(data.subscription_expires_at) < new Date()) {
        status = 'expired';
        // Write back asynchronously — don't block render
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
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    loadProfile(user.id);
  }, [user, loadProfile]);

  // Increment session counter (called after session gate passes)
  const onSessionUsed = useCallback(async () => {
    if (!user) return;
    const status = profile.subscription_status;

    if (status === 'active') {
      // Check monthly reset (if reset_at is over 30 days ago, reset counter)
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

  // Called when user closes or completes the demo — saves flag so it never auto-shows again
  const handleDemoClose = useCallback(async () => {
    setShowDemo(false);
    if (!user) return;
    await supabase
      .from('profiles')
      .upsert({ id: user.id, has_seen_demo: true }, { onConflict: 'id' });
  }, [user]);

  // Returns true if session can proceed; otherwise navigates to upgrade and returns false
  const checkSession = useCallback(() => {
    const { subscription_status: status, free_sessions_used: used, monthly_sessions_used: monthly } = profile;

    if (status === 'active') {
      if ((monthly ?? 0) >= PRO_SESSION_LIMIT) { setPage('upgrade'); return false; }
      return true;
    }
    if (status === 'pending') { setPage('upgrade'); return false; }
    if (status === 'expired') { setPage('upgrade'); return false; }
    // free
    if (used < FREE_SESSION_LIMIT) return true;
    setShowPaywall(true);
    return false;
  }, [profile]);

  if (authLoading) return <LoadingScreen />;

  if (showResetPassword) return <ResetPasswordPage onDone={() => { setShowResetPassword(false); supabase.auth.signOut(); }} />;

  if (!user) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}><AuthPage /></div>
      <Footer />
    </div>
  );

  const isAdmin = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email.toLowerCase());

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Nav
        user={user}
        page={page}
        setPage={setPage}
        onReplayDemo={() => setShowDemo(true)}
        profile={profile}
        onUpgradeClick={() => setPage('upgrade')}
        isAdmin={isAdmin}
      />
      <div style={{ flex: 1 }}>
        {page === 'interview'   && (
          <InterviewAlpha
            user={user}
            profile={profile}
            checkSession={checkSession}
            onSessionUsed={onSessionUsed}
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
        {page === 'company'     && <CompanyQuestions setPage={setPage} />}
        {page === 'scorecard'   && <Scorecard user={user} />}
        {page === 'salary'      && <SalaryGuide />}
        {page === 'resources'   && <LearningResources />}
        {page === 'upgrade'     && (
          <UpgradePage
            user={user}
            profile={profile}
            onBack={() => setPage('interview')}
          />
        )}
        {page === 'admin' && isAdmin && <AdminPanel user={user} />}
      </div>
      <Footer />
      {showDemo && <DemoTutorial onClose={handleDemoClose} />}
      {showPaywall && (
        <PaywallModal
          lastSession
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => { setShowPaywall(false); setPage('upgrade'); }}
        />
      )}
    </div>
  );
}
