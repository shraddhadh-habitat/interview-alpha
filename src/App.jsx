import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import InterviewAlpha from './InterviewAlpha';
import AuthPage from './pages/AuthPage';
import PastSessions from './pages/PastSessions';
import Leaderboard from './pages/Leaderboard';
import PracticeQA from './pages/PracticeQA';
import UpgradePage from './pages/UpgradePage';
import AdminPanel from './pages/AdminPanel';
import Nav from './components/Nav';
import DemoTutorial from './components/DemoTutorial';
import PaywallModal from './components/PaywallModal';

const C = { bg: '#FFFFFF', text: '#1A1A1A', textMuted: '#999999', orange: '#E8650A' };

const FREE_SESSION_LIMIT  = 3;
const PRO_SESSION_LIMIT   = 100;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 16 }}>
          Interview<span style={{ color: C.orange }}>Alpha</span>
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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

    if (!data || !data.has_seen_demo) setShowDemo(true);

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
  if (!user) return <AuthPage />;

  const isAdmin = ADMIN_EMAIL && user.email === ADMIN_EMAIL;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav
        user={user}
        page={page}
        setPage={setPage}
        onReplayDemo={() => setShowDemo(true)}
        profile={profile}
        onUpgradeClick={() => setPage('upgrade')}
        isAdmin={isAdmin}
      />
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
      {page === 'leaderboard' && <Leaderboard />}
      {page === 'upgrade'     && (
        <UpgradePage
          user={user}
          profile={profile}
          onBack={() => setPage('interview')}
        />
      )}
      {page === 'admin' && isAdmin && <AdminPanel user={user} />}
      {showDemo && <DemoTutorial user={user} onClose={() => setShowDemo(false)} />}
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
