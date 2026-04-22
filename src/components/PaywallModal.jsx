const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8',
  text: '#0A0A0A', textSoft: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  success: '#1A7F37', successLight: 'rgba(27,140,58,0.08)', successBorder: 'rgba(27,140,58,0.2)',
};

export default function PaywallModal({ onClose, onUpgrade, lastSession = false }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{
        background: C.bg, borderRadius: 16,
        border: `1px solid ${C.border}`,
        maxWidth: 460, width: '100%',
        padding: '40px 36px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        position: 'relative',
        animation: 'paywallIn 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <style>{`@keyframes paywallIn { from { opacity:0; transform: scale(0.94) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>

        {/* Lock icon */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: C.greenLight, border: `1px solid ${C.greenBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 26, fontWeight: 700, color: C.text,
          marginBottom: 12, lineHeight: 1.2,
        }}>
          {lastSession ? "You've used all 2 free sessions" : 'Free sessions used up'}
        </h2>

        <p style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.75, marginBottom: 28, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {lastSession
            ? "You've used all 2 free sessions. Upgrade to keep practising with full AI feedback."
            : "You need an active subscription to start more AI sessions."}
        </p>

        {/* Plan card */}
        <div style={{
          background: C.bgSoft, border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '20px 22px', marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text, letterSpacing: 0.5 }}>Pro Plan</span>
            <div>
              <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 700, color: C.green }}>₹699</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>/mo</span>
            </div>
          </div>
          {[
            '100 AI interview sessions / month',
            'Full practice mode scoring',
            'Performance history & analytics',
            'Priority support',
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: C.success, fontSize: 12 }}>✓</span>
              <span style={{ fontSize: 12, color: C.textSoft }}>{f}</span>
            </div>
          ))}
        </div>

        <button
          style={{
            width: '100%', padding: '14px 0',
            background: C.green, border: 'none', borderRadius: 12,
            color: '#fff', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
            marginBottom: 12, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.greenHover}
          onMouseLeave={e => e.currentTarget.style.background = C.green}
          onClick={onUpgrade}
        >
          Upgrade to Pro →
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px 0',
            background: 'transparent', border: `1px solid ${C.border}`,
            borderRadius: 12, color: C.textMuted,
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
