import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback mounted, pending_score:', localStorage.getItem('ia:pending_score'));

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
          // Check if user has a pending score from signup attempt (same tab scenario)
          let pendingScore = localStorage.getItem('ia:pending_score');

          // If not in localStorage, check Supabase pending_redirect (new tab scenario)
          if (!pendingScore) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('pending_redirect')
              .eq('id', data.user.id)
              .single();

            if (profile?.pending_redirect) {
              pendingScore = profile.pending_redirect;
              console.log('Restored pending_score from Supabase');

              // Clear pending_redirect from database
              await supabase
                .from('profiles')
                .update({ pending_redirect: null })
                .eq('id', data.user.id);
            }
          } else {
            console.log('Found pending_score in localStorage');
          }

          if (pendingScore) {
            // Restore to localStorage for PracticeQA initializer
            localStorage.setItem('ia:pending_score', pendingScore);
            localStorage.removeItem('ia_practice_origin');
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
