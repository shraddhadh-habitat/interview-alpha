import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ACTIVITIES = [
  'Ishaan answered a Product Sense question · just now',
  'Sofia practiced a Metrics question · 1 min ago',
  'Kabir completed a Strategy question · 2 mins ago',
  'Aanya scored 8/10 on a PM question · 3 mins ago',
  'Lucas answered a Statistics question · 1 min ago',
  'Zara practiced an ML question · 4 mins ago',
  'Dhruv completed a SQL question · 2 mins ago',
  'Elena answered a Behavioral question · 5 mins ago',
  'Vihaan practiced a Case Study · just now',
  'Nina scored 9/10 on a DS question · 3 mins ago',
];

export default function ActivityTickerPortal() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const show = setTimeout(() => setVisible(true), 2000);
    const rotate = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 600);
    }, 7000);
    return () => { clearTimeout(show); clearInterval(rotate); };
  }, []);

  if (!mounted) return null;

  const el = document.getElementById('activity-ticker-root');
  if (!el) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      bottom: '90px',
      left: '16px',
      zIndex: 2147483647,
      background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
      borderRadius: '14px',
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(167, 139, 250, 0.4)',
      fontSize: '0.8rem',
      color: '#ffffff',
      maxWidth: '260px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {/* Pulsing dot */}
      <span style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#ffffff',
        flexShrink: 0,
        marginTop: '2px',
        boxShadow: '0 0 0 3px rgba(255,255,255,0.3)',
        animation: 'tickerPulse 1.5s ease-in-out infinite'
      }} />
      <div>
        <div style={{ fontWeight: 700, marginBottom: '2px', lineHeight: 1.3 }}>
          🔥 {ACTIVITIES[index].split(' · ')[0]}
        </div>
        <div style={{ opacity: 0.85, fontSize: '0.72rem' }}>
          ⏱ {ACTIVITIES[index].split(' · ')[1]}
        </div>
      </div>
    </div>,
    el
  );
}
