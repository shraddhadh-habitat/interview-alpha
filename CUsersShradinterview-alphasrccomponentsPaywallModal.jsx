export default function PaywallModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    window.location.href = '/?page=pricing';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '40px 32px',
        maxWidth: 500,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        animation: 'fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {/* Heading */}
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12, textAlign: 'center' }}>
          You've completed 3 practice sessions
        </div>

        {/* Subtext */}
        <p style={{
          fontSize: 15,
          color: 'rgba(27, 27, 24, 0.6)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.8,
          marginBottom: 32,
          textAlign: 'center',
        }}>
          Serious candidates practice 10+ questions before their interview. Unlock unlimited access to keep improving.
        </p>

        {/* Unlock button */}
        <button
          onClick={handleUpgrade}
          style={{
            width: '100%',
            padding: '16px 24px',
            height: 56,
            background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FDCD34)',
            border: 'none',
            borderRadius: 12,
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.18)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Unlock Unlimited Access
        </button>

        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 24px',
            height: 48,
            background: '#FFFFFF',
            border: `2px solid #111111`,
            borderRadius: 12,
            color: '#111111',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F3F4F6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Q&A
        </button>
      </div>
    </div>
  );
}
