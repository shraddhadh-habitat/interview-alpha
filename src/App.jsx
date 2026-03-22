import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import InterviewAlpha from './InterviewAlpha';
import AuthPage from './pages/AuthPage';
import PastSessions from './pages/PastSessions';
import Leaderboard from './pages/Leaderboard';
import PracticeQA from './pages/PracticeQA';
import Nav from './components/Nav';
import DemoTutorial from './components/DemoTutorial';

const C = { bg: '#FFFFFF', text: '#1A1A1A', textMuted: '#999999', orange: '#E8650A' };

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

  // Check has_seen_demo after user is set
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('has_seen_demo')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!data || !data.has_seen_demo) setShowDemo(true);
      });
  }, [user]);

  if (authLoading) return <LoadingScreen />;
  if (!user) return <AuthPage />;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav user={user} page={page} setPage={setPage} onReplayDemo={() => setShowDemo(true)} />
      {page === 'interview'    && <InterviewAlpha user={user} />}
      {page === 'practice'     && <PracticeQA user={user} />}
      {page === 'sessions'     && <PastSessions user={user} />}
      {page === 'leaderboard'  && <Leaderboard />}
      {showDemo && <DemoTutorial user={user} onClose={() => setShowDemo(false)} />}
    </div>
  );
}
