import { useState, useEffect } from 'react';
import { getRandomActivity } from '../lib/activityFeed';

export default function ActivityTicker() {
  const [activity, setActivity] = useState('');

  useEffect(() => {
    // Set initial activity
    setActivity(getRandomActivity());

    // Rotate activity every 4 seconds
    const interval = setInterval(() => {
      setActivity(getRandomActivity());
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!activity) return null;

  return (
    <div style={{
      padding: '12px 16px',
      background: 'rgba(22, 163, 74, 0.08)',
      border: '1px solid rgba(22, 163, 74, 0.2)',
      borderRadius: 8,
      fontSize: 13,
      color: '#0A0A0A',
      textAlign: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      ✓ {activity}
    </div>
  );
}
