import { createClient } from '@supabase/supabase-js';

const MAX_SIGNUPS_PER_IP = 2;
const WINDOW_HOURS       = 24;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';

  const windowStart = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000).toISOString();

  try {
    const { count, error: countErr } = await supabase
      .from('signup_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('attempted_at', windowStart);

    // Fail open on DB errors — don't block legitimate signups due to infra issues
    if (countErr) return res.status(200).json({ allowed: true });

    if (count >= MAX_SIGNUPS_PER_IP) {
      return res.status(429).json({
        error: 'Too many signup attempts. Please try again later.',
      });
    }

    await supabase.from('signup_attempts').insert({ ip_address: ip });
    return res.status(200).json({ allowed: true });
  } catch {
    return res.status(200).json({ allowed: true });
  }
}
