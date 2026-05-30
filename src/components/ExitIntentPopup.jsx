import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ExitIntentPopup({ user, profile }) {
  const { requireAuth } = useAuth();
  const [show, setShow] = useState(false);
  const [canTrigger, setCanTrigger] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanTrigger(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (!canTrigger || show) return;
      if (e.clientY <= 10 && !sessionStorage.getItem('exitIntentDismissed')) {
        setShow(true);
        sessionStorage.setItem('exitIntentDismissed', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [canTrigger, show]);

  if (!show) return null;

  const sessionsUsed = profile?.free_sessions_used ?? 0;
  const freeSessions = Math.max(0, 3 - sessionsUsed);
  const isLoggedIn = !!user;
  const hasSessionsLeft = freeSessions > 0;

  const config = isLoggedIn
    ? hasSessionsLeft
      ? {
          emoji: '⏰',
          title: 'One more free question?',
          message: 'You have ' + freeSessions + ' free session' + (freeSessions !== 1 ? 's' : '') + ' left.',
          cta: 'Answer a question now',
          ctaLink: '/dashboard'
        }
      : {
          emoji: '🚀',
          title: 'Ready to level up?',
          message: 'You\'ve mastered your free sessions. Unlock unlimited practice.',
          cta: 'See upgrade options',
          ctaLink: '/upgrade'
        }
    : {
        emoji: '🎯',
        title: 'Try PM interview prep free',
        message: 'No credit card needed. Answer one question right now.',
        cta: 'Try one free question',
      };

  return (
    <>
      <div
        onClick={() => setShow(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {config.emoji}
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '12px',
          color: '#1a1a1a'
        }}>
          {config.title}
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: '#666',
          marginBottom: '24px',
          lineHeight: 1.5
        }}>
          {config.message}
        </p>

        {isLoggedIn && hasSessionsLeft && (
          <div style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i < freeSessions ? '#22c55e' : '#e4e1db'
              }} />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShow(false)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1.5px solid #e5e7eb',
              background: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#666',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
            onMouseOut={(e) => e.target.style.background = 'white'}
          >
            Maybe later
          </button>
          <button
            onClick={() => requireAuth('Sign in to start your free session')}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'white',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(167, 139, 250, 0.4)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(167, 139, 250, 0.3)'}
          >
            {config.cta}
          </button>
        </div>

        <button
          onClick={() => setShow(false)}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            fontSize: '0.85rem',
            textDecoration: 'underline',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#666'}
          onMouseOut={(e) => e.target.style.color = '#999'}
        >
          I'm staying
        </button>
      </div>
    </>
  );
}
