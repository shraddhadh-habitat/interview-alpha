export default function WeeklyActiveBar() {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#ffffff',
      border: '1px solid #e4e1db',
      borderRadius: '999px',
      padding: '7px 16px',
      fontSize: '0.82rem',
      color: '#6b6b6b',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      width: 'fit-content'
    }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#22c55e',
        display: 'inline-block',
        flexShrink: 0,
        animation: 'livePulse 2s ease-in-out infinite'
      }} />
      <span>
        <strong style={{ color: '#111111' }}>200+ people</strong>
        {' '}practiced this week
      </span>
    </div>
  );
}
