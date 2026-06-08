import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  console.log('[AuthCallback] URL on load:', window.location.href);
  console.log('[AuthCallback] search params:', window.location.search);

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
          // Check for score token in URL (sent via emailRedirectTo)
          const params = new URLSearchParams(window.location.search);
          const scoreToken = params.get('score_token');
          console.log('[AuthCallback] score_token from URL:', scoreToken);

          if (scoreToken) {
            console.log('[AuthCallback] Found score token, redirecting to practice with token');
            window.location.href = `/?page=practice&score_token=${scoreToken}`;
          } else {
            console.log('[AuthCallback] No score token, redirecting to homepage');
            window.location.href = '/';
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
