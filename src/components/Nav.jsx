import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#999999',
  border: '#E5E5E5',
  orange: '#E8650A',
  orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)',
  green: '#1B8C3A',
  greenLight: 'rgba(27,140,58,0.08)',
  greenBorder: 'rgba(27,140,58,0.2)',
};

const FREE_SESSION_LIMIT = 3;

export default function Nav({ user, page, setPage, onReplayDemo, profile, onUpgradeClick }) {
  const tabs = [
    { id: 'interview', label: 'Interview' },
    { id: 'practice', label: 'Practice Q&A' },
    { id: 'sessions', label: 'Past Sessions' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  const isFree = profile?.subscription_status !== 'pro';
  const used = profile?.free_sessions_used ?? 0;
  const remaining = Math.max(0, FREE_SESSION_LIMIT - used);

  return (
    <>
      {/* Orange accent line */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${C.orange}, #D45800)`,
        zIndex: 100,
      }} />

      {/* Nav bar */}
      <div style={{
        position: 'fixed', top: 3, left: 0, right: 0,
        height: 52,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        zIndex: 99,
        fontFamily: "'DM Mono', monospace",
      }}>
        {/* Logo + Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18, fontWeight: 700, color: C.text,
            letterSpacing: -0.5,
          }}>
            I<span style={{ color: C.orange }}>A</span>
          </span>

          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                style={{
                  padding: '6px 14px',
                  background: page === tab.id ? C.orangeLight : 'transparent',
                  border: page === tab.id ? `1px solid rgba(232,101,10,0.2)` : '1px solid transparent',
                  borderRadius: 6,
                  color: page === tab.id ? C.orange : C.textMuted,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: page === tab.id ? 500 : 400,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (page !== tab.id) e.currentTarget.style.color = C.text;
                }}
                onMouseLeave={e => {
                  if (page !== tab.id) e.currentTarget.style.color = C.textMuted;
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User + session badge + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>
            {user?.email}
          </span>

          {/* Session indicator — only for free users */}
          {isFree && (
            remaining > 0 ? (
              <span style={{
                padding: '4px 10px',
                background: C.greenLight,
                border: `1px solid ${C.greenBorder}`,
                borderRadius: 20,
                fontSize: 10, fontWeight: 600,
                color: C.green, letterSpacing: 0.5,
                whiteSpace: 'nowrap',
              }}>
                {remaining}/{FREE_SESSION_LIMIT} Free Sessions Left
              </span>
            ) : (
              <button
                onClick={onUpgradeClick}
                style={{
                  padding: '5px 12px',
                  background: 'rgba(232,101,10,0.1)',
                  border: `1px solid rgba(232,101,10,0.3)`,
                  borderRadius: 6,
                  color: C.orange,
                  fontSize: 10, letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.orangeLight; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,101,10,0.1)'; }}
              >
                Upgrade
              </button>
            )
          )}

          {onReplayDemo && (
            <button
              onClick={onReplayDemo}
              style={{
                padding: '5px 12px',
                background: 'transparent',
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                color: C.textMuted,
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
            >
              Tour
            </button>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '5px 14px',
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.textMuted,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#D32F2F';
              e.currentTarget.style.color = '#D32F2F';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textMuted;
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
