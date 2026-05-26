export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    // Fetch device sessions and aggregate by device type
    const { data: sessions, error } = await supabase
      .from('device_sessions')
      .select('device_type', { count: 'exact' });

    if (error) throw error;

    // Count by device type
    const counts = {
      android: 0,
      ios: 0,
      desktop: 0,
    };

    sessions?.forEach(session => {
      if (session.device_type && counts.hasOwnProperty(session.device_type)) {
        counts[session.device_type]++;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.status(200).json({
      total,
      breakdown: {
        android: counts.android,
        ios: counts.ios,
        desktop: counts.desktop,
      },
    });
  } catch (err) {
    console.error('Device stats error:', err);
    res.status(500).json({ error: err.message });
  }
}
