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
  red: '#D32F2F',
  redLight: 'rgba(211,47,47,0.07)',
  redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00',
  yellowLight: 'rgba(198,127,0,0.06)',
  yellowBorder: 'rgba(198,127,0,0.15)',
};

const FREE_SESSION_LIMIT = 1;
const PRO_SESSION_LIMIT  = 100;

function SubscriptionBadge({ profile, onUpgradeClick }) {
  const status  = profile?.subscription_status ?? 'free';
  const used    = profile?.free_sessions_used  ?? 0;
  const monthly = profile?.monthly_sessions_used ?? 0;

  if (status === 'active') {
    return (
      <span style={{
        padding: '4px 10px',
        background: C.orangeLight,
        border: `1px solid rgba(232,101,10,0.3)`,
        borderRadius: 20,
        fontSize: 10, fontWeight: 600,
        color: C.orange, letterSpacing: 0.5,
        fontFamily: "'DM Mono', monospace",
        whiteSpace: 'nowrap',
      }}>
        ◆ Pro · {monthly}/{PRO_SESSION_LIMIT} this month
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span style={{
        padding: '4px 10px',
        background: C.yellowLight,
        border: `1px solid ${C.yellowBorder}`,
        borderRadius: 20,
        fontSize: 10, fontWeight: 600,
        color: C.yellow, letterSpacing: 0.5,
        fontFamily: "'DM Mono', monospace",
        whiteSpace: 'nowrap',
      }}>
        ⏳ Pending verification
      </span>
    );
  }

  if (status === 'expired') {
    return (
      <button
        onClick={onUpgradeClick}
        style={{
          padding: '4px 10px',
          background: C.redLight,
          border: `1px solid ${C.redBorder}`,
          borderRadius: 20,
          fontSize: 10, fontWeight: 600,
          color: C.red, letterSpacing: 0.5,
          fontFamily: "'DM Mono', monospace",
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}
      >
        Expired · Renew
      </button>
    );
  }

  // free
  const remaining = Math.max(0, FREE_SESSION_LIMIT - used);
  return remaining > 0 ? (
    <span style={{
      padding: '4px 10px',
      background: C.greenLight,
      border: `1px solid ${C.greenBorder}`,
      borderRadius: 20,
      fontSize: 10, fontWeight: 600,
      color: C.green, letterSpacing: 0.5,
      fontFamily: "'DM Mono', monospace",
      whiteSpace: 'nowrap',
    }}>
      {remaining}/{FREE_SESSION_LIMIT} Free Session{FREE_SESSION_LIMIT !== 1 ? 's' : ''} Left
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
  );
}

export default function Nav({ user, page, setPage, onReplayDemo, profile, onUpgradeClick, isAdmin }) {
  const tabs = [
    { id: 'interview',   label: 'Interview' },
    { id: 'practice',    label: 'Practice Q&A' },
    { id: 'sessions',    label: 'Past Sessions' },
    { id: 'leaderboard', label: 'Leaderboard' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin' }] : []),
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
                  color: tab.id === 'admin'
                    ? (page === tab.id ? C.orange : C.red)
                    : (page === tab.id ? C.orange : C.textMuted),
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
                  if (page !== tab.id) e.currentTarget.style.color = tab.id === 'admin' ? C.red : C.textMuted;
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User + subscription badge + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>
            {user?.email}
          </span>

          <SubscriptionBadge profile={profile} onUpgradeClick={onUpgradeClick} />

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
              e.currentTarget.style.borderColor = C.red;
              e.currentTarget.style.color = C.red;
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
