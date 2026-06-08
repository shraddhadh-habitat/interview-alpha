import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          new URLSearchParams(window.location.search).get('code')
        );

        if (error) {
          console.error('Auth callback error:', error);
          window.location.href = '/';
          return;
        }

        if (data?.user) {
          // Check if user has a pending score from signup attempt
          const pendingScore = localStorage.getItem('ia:pending_score');
          if (pendingScore) {
            localStorage.removeItem('ia:pending_score');
            // Redirect to scorecard with score data - it will be picked up by PracticeQA
            window.location.href = '/?page=practice';
          } else {
            // Check if user came from practice attempt
            const practiceOrigin = localStorage.getItem('ia_practice_origin');
            if (practiceOrigin) {
              localStorage.removeItem('ia_practice_origin');
              window.location.href = '/?page=practice';
            } else {
              // Redirect to scorecard for normal signup
              window.location.href = '/?page=scorecard';
            }
          }
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Auth callback exception:', err);
        window.location.href = '/';
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#FAFAF8'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 400, marginBottom: 16, color: '#0A0A0A' }}>
          Verifying your email...
        </div>
        <div style={{ fontSize: 14, color: '#5C5C57' }}>
          Please wait while we confirm your account.
        </div>
      </div>
    </div>
  );
}
