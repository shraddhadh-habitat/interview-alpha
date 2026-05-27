import { useState, useEffect } from 'react';
import { getRandomActivity } from '../lib/activityFeed';

export default function ActivityTicker() {
  const [visible, setVisible] = useState(true);
  const [activity, setActivity] = useState('Ishaan answered a PM question · 2 mins ago');

  useEffect(() => {
    // Rotate every 8 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActivity(getRandomActivity());
        setVisible(true);
      }, 500);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '16px',
      zIndex: 99999,
      background: '#ffffff',
      border: '1px solid #e4e1db',
      borderRadius: '12px',
      padding: '10px 16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      fontSize: '0.78rem',
      color: '#6b6b6b',
      maxWidth: '280px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'none',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      ✓ {activity}
    </div>
  );
}
