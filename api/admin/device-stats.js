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

    // Fetch users with device_type from profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('device_type');

    if (error) throw error;

    // Count by device type
    const counts = {
      android: 0,
      ios: 0,
      desktop: 0,
    };

    profiles?.forEach(profile => {
      if (profile.device_type && counts.hasOwnProperty(profile.device_type)) {
        counts[profile.device_type]++;
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
