import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import posthog from '../lib/analytics';

export default function AuthCallback() {
  console.log('[AuthCallback] URL on load:', window.location.href);
  console.log('[AuthCallback] search params:', window.location.search);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        const errorCode = params.get('error_code');
        const scoreToken = params.get('score_token');

        console.log('[AuthCallback] Error:', error, 'Error code:', errorCode);
        console.log('[AuthCallback] Score token from URL:', scoreToken);

        // Handle verification errors
        if (error || errorCode) {
          console.log('[AuthCallback] Verification error detected');

          // Special case: OTP expired but user is already confirmed
          // They can sign in manually and still see their score
          if (errorCode === 'otp_expired' && scoreToken) {
            console.log('[AuthCallback] OTP expired but user confirmed, redirecting to practice with score');
            window.location.href = `/?page=practice&score_token=${scoreToken}`;
            return;
          }

          // General error: save score token and show error
          if (scoreToken) {
            console.log('[AuthCallback] Saving score token to localStorage');
            localStorage.setItem('ia:score_token', scoreToken);
          }
          window.location.href = '/?signup_error=true';
          return;
        }

        // Check if user is already signed in (auto sign-in after link click)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('[AuthCallback] getSession result - has user:', !!sessionData?.session?.user, 'error:', sessionError);

        if (sessionData?.session?.user) {
          // User is already signed in - no need for exchangeCodeForSession
          console.log('[AuthCallback] User already signed in from verification link');
          posthog.capture('email_verified');

          // Save pending signup data if exists
          const pendingSignup = localStorage.getItem('ia:pending_signup');
          if (pendingSignup) {
            try {
              const { userId, email, display_name, phone_number } = JSON.parse(pendingSignup);
              await supabase.from('profiles').upsert({
                id: sessionData.session.user.id,
                email: sessionData.session.user.email,
                display_name,
                phone_number
              });
              localStorage.removeItem('ia:pending_signup');
            } catch (e) {
              console.error('Failed to save pending signup:', e);
            }
          }

          if (scoreToken) {
            console.log('[AuthCallback] Found score token, redirecting to practice with token');
            window.location.href = `/?page=practice&score_token=${scoreToken}`;
          } else {
            console.log('[AuthCallback] No score token, redirecting to homepage');
            window.location.href = '/';
          }
          return;
        }

        // If not auto-signed-in, try exchangeCodeForSession
        const code = params.get('code');
        if (code) {
          console.log('[AuthCallback] Attempting exchangeCodeForSession');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Auth callback exchangeCodeForSession error:', exchangeError);
            if (scoreToken) {
              localStorage.setItem('ia:score_token', scoreToken);
            }
            window.location.href = '/?signup_error=true';
            return;
          }

          if (data?.user) {
            console.log('[AuthCallback] Successfully exchanged code for session');
            posthog.capture('email_verified');

            // Save pending signup data if exists
            const pendingSignup = localStorage.getItem('ia:pending_signup');
            if (pendingSignup) {
              try {
                const { userId, email, display_name, phone_number } = JSON.parse(pendingSignup);
                await supabase.from('profiles').upsert({
                  id: data.user.id,
                  email: data.user.email,
                  display_name,
                  phone_number
                });
                localStorage.removeItem('ia:pending_signup');
              } catch (e) {
                console.error('Failed to save pending signup:', e);
              }
            }

            if (scoreToken) {
              console.log('[AuthCallback] Found score token, redirecting to practice with token');
              window.location.href = `/?page=practice&score_token=${scoreToken}`;
            } else {
              console.log('[AuthCallback] No score token, redirecting to homepage');
              window.location.href = '/';
            }
            return;
          }
        }

        console.log('[AuthCallback] No code or user found, redirecting to homepage');
        window.location.href = '/';
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
