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
      background: '#ffffff',
      border: '1px solid #e4e1db',
      borderRadius: '12px',
      padding: '10px 16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      fontSize: '0.78rem',
      color: '#444',
      maxWidth: '280px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #a8e6cf, #a78bfa)',
        display: 'inline-block'
      }} />
      {ACTIVITIES[index]}
    </div>,
    el
  );
}
