import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import InterviewAlpha from './InterviewAlpha';
import AuthPage from './pages/AuthPage';
import PastSessions from './pages/PastSessions';
import Leaderboard from './pages/Leaderboard';
import PracticeQA from './pages/PracticeQA';
import Nav from './components/Nav';
import DemoTutorial from './components/DemoTutorial';
import PaywallModal from './components/PaywallModal';

const C = { bg: '#FFFFFF', text: '#1A1A1A', textMuted: '#999999', orange: '#E8650A' };

const FREE_SESSION_LIMIT = 3;

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

  // subscription_status: 'free' | 'pro'
  // free_sessions_used: 0–N
  const [profile, setProfile] = useState({ subscription_status: 'free', free_sessions_used: 0 });

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

  // Load profile (has_seen_demo + subscription fields)
  const loadProfile = useCallback(async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('has_seen_demo, subscription_status, free_sessions_used')
      .eq('id', uid)
      .single();

    if (!data || !data.has_seen_demo) setShowDemo(true);

    setProfile({
      subscription_status: data?.subscription_status ?? 'free',
      free_sessions_used: data?.free_sessions_used ?? 0,
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    loadProfile(user.id);
  }, [user, loadProfile]);

  // Called by InterviewAlpha and PracticeMode when they consume a session
  const onSessionUsed = useCallback(async () => {
    if (!user) return;
    const newCount = profile.free_sessions_used + 1;
    setProfile(prev => ({ ...prev, free_sessions_used: newCount }));
    await supabase
      .from('profiles')
      .update({ free_sessions_used: newCount })
      .eq('id', user.id);
  }, [user, profile.free_sessions_used]);

  // Returns true if the session can proceed, false if paywalled
  const checkSession = useCallback(() => {
    if (profile.subscription_status !== 'free') return true;
    if (profile.free_sessions_used < FREE_SESSION_LIMIT) return true;
    setShowPaywall(true);
    return false;
  }, [profile]);

  if (authLoading) return <LoadingScreen />;
  if (!user) return <AuthPage />;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav
        user={user}
        page={page}
        setPage={setPage}
        onReplayDemo={() => setShowDemo(true)}
        profile={profile}
        onUpgradeClick={() => setShowPaywall(true)}
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
      {showDemo && <DemoTutorial user={user} onClose={() => setShowDemo(false)} />}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          lastSession={profile.free_sessions_used >= FREE_SESSION_LIMIT}
        />
      )}
    </div>
  );
}
