export default function WeeklyActiveBar() {
  // Start at 586, increase by 3-7 every 3 hours
  // Uses current time to calculate how many 3-hour blocks have passed since a fixed start date
  const getCount = () => {
    const startDate = new Date('2026-05-25T00:00:00Z'); // fixed reference point
    const now = new Date();
    const hoursElapsed = Math.floor((now - startDate) / (1000 * 60 * 60));
    const blocksElapsed = Math.floor(hoursElapsed / 3);

    // Each 3-hour block adds between 3-7 (use block number to seed a consistent value)
    let count = 586;
    for (let i = 0; i < blocksElapsed; i++) {
      // Deterministic "random" increment based on block index
      count += 3 + (i * 7 + 13) % 5; // always adds 3-7, consistent across page loads
    }
    return count;
  };

  const count = getCount();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      background: 'linear-gradient(135deg, rgba(168,230,207,0.15) 0%, rgba(167,139,250,0.15) 100%)',
      border: '1.5px solid rgba(167,139,250,0.3)',
      borderRadius: '999px',
      padding: '8px 20px',
      marginBottom: '24px',
      width: 'fit-content',
      backdropFilter: 'blur(4px)'
    }}>
      {/* Pulsing dot */}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22c55e',
          display: 'inline-block',
          position: 'relative',
          zIndex: 1
        }} />
        <span style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#22c55e',
          animation: 'pingEffect 1.5s ease-out infinite',
          opacity: 0.6
        }} />
      </span>

      <span style={{ fontSize: '0.85rem', color: '#6b6b6b' }}>
        <strong style={{
          background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '0.95rem',
          fontWeight: 800
        }}>
          {count.toLocaleString()} people
        </strong>
        {' '}practiced this week
      </span>
    </div>
  );
}
