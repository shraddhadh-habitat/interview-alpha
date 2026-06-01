import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify the token belongs to an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin (comma-separated email list)
    const adminEmails = (process.env.VITE_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase());
    if (!adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Fetch all profiles
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name, phone_number, device_type, device_os, subscription_status, free_sessions_used, monthly_sessions_used, last_seen_at, updated_at, submitted_at, email_day1_sent, email_day3_sent, email_day5_sent')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[admin-users] Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ users: data });
  } catch (err) {
    console.error('[admin-users] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
