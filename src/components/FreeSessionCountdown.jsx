export default function FreeSessionCountdown({ profile, user }) {
  // Only show for logged-in users with sessions remaining
  if (!user) return null;

  const sessionsUsed = profile?.free_sessions_used ?? 0;
  const freeSessions = Math.max(0, 3 - sessionsUsed);

  const isLow = freeSessions <= 1;
  const isZero = freeSessions === 0;

  if (isZero) return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#fff5f5',
      border: '1px solid #fca5a5',
      borderRadius: '999px',
      padding: '8px 18px',
      fontSize: '0.82rem',
      marginBottom: '16px',
      fontWeight: 600,
      color: '#dc2626'
    }}>
      ⚠️ You've used all your free sessions.
      <span
        onClick={() => window.location.href = '/upgrade'}
        style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
      >
        Upgrade to continue
      </span>
    </div>
  );

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: isLow ? '#fff5f5' : '#f0fdf4',
      border: `1.5px solid ${isLow ? '#fca5a5' : '#86efac'}`,
      borderRadius: '999px',
      padding: '8px 18px',
      fontSize: '0.82rem',
      marginBottom: '16px',
      transition: 'all 0.3s ease'
    }}>
      {/* Session dots */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[...Array(3)].map((_, i) => (
          <span key={i} style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: i < freeSessions
              ? (isLow ? '#ef4444' : '#22c55e')
              : '#e4e1db',
            transition: 'background 0.3s ease',
            display: 'inline-block'
          }} />
        ))}
      </div>

      <span style={{
        fontWeight: 600,
        color: isLow ? '#dc2626' : '#15803d'
      }}>
        {isLow
          ? '⚠️ Only 1 free session left. Use it now'
          : `${freeSessions} free session${freeSessions !== 1 ? 's' : ''} remaining`
        }
      </span>
    </div>
  );
}
