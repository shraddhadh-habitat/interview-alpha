import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ACTIVITIES = [
  'Ishaan just got 8/10 on a Swiggy PM question · 🎯',
  'Aanya answered her first question · just now',
  'Kabir scored higher than his last attempt · 2 mins ago',
  'Zara just finished a Google PM question · 1 min ago',
  'Dhruv got feedback on his Metrics answer · just now',
  'Myra practiced before her interview tomorrow · 3 mins ago',
  'Vihaan scored 9/10. His best yet · 2 mins ago',
  'Kiara just completed a Behavioral question · 4 mins ago',
  'Rehan answered an Amazon Leadership question · 1 min ago',
  'Tara got her first AI score today · just now',
  'Advait practiced a Product Sense question · 5 mins ago',
  'Noor just started her interview prep · 2 mins ago',
  'Saira scored 7/10 on her first try · 3 mins ago',
  'Aryan got 9/10 on a Stats question · just now',
  'Ira finished a SQL question · 1 min ago',
  'Rohan just practiced Machine Learning Concepts · 4 mins ago',
  'Divya answered a Probability question · 2 mins ago',
  'Karthik scored 8/10 on a DS Case Study · 6 mins ago',
  'Meera just completed a Python question · just now',
  'Siddharth improved his score from last session · 3 mins ago',
  'Sofia got feedback on her product strategy · 2 mins ago',
  'Liam answered a Strategy question · just now',
  'Mia scored 8/10 on a Metrics question · 1 min ago',
  'Ethan just finished his daily practice · 4 mins ago',
  'Chloe got 9/10. Third perfect score this week · 2 mins ago',
  'Lucas answered an ML question · just now',
  'Aria scored higher than yesterday · 3 mins ago',
  'Noah just completed a SQL challenge · 1 min ago',
  'Luna practiced her first Data Science question · just now',
  'Omar got AI feedback on his case study · 5 mins ago',
  'Elena scored 9/10 on Probability · 2 mins ago',
  'Wei just answered a Python question · just now',
  'Nina completed an ML System Design · 3 mins ago',
];

export default function ActivityTickerPortal() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const show = setTimeout(() => setVisible(true), 2000);
    const rotate = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 600);
    }, 20000);
    return () => { clearTimeout(show); clearInterval(rotate); };
  }, []);

  if (!mounted) return null;
  if (dismissed) return null;

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
      pointerEvents: 'auto'
    }}>
      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '6px',
          right: '8px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.8)',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: 1,
          padding: '2px 4px',
        }}
      >
        ×
      </button>
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
