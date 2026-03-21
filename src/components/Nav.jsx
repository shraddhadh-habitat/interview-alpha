import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#999999',
  border: '#E5E5E5',
  orange: '#E8650A',
  orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)',
};

export default function Nav({ user, page, setPage }) {
  const tabs = [
    { id: 'interview', label: 'Interview' },
    { id: 'sessions', label: 'Past Sessions' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

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

        {/* User + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>
            {user?.email}
          </span>
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
