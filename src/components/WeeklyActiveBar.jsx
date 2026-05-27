import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function WeeklyActiveBar() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count: rawCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', oneWeekAgo.toISOString());

      // Round down to nearest 10 for natural feel
      // Minimum 40 so it never shows embarrassingly low numbers
      const rounded = Math.max(40, Math.floor((rawCount || 0) / 10) * 10);
      setCount(rounded);
    };

    fetchCount();
  }, []);

  if (!count) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#ffffff',
      border: '1px solid #e4e1db',
      borderRadius: '999px',
      padding: '7px 16px',
      fontSize: '0.82rem',
      color: '#6b6b6b',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      width: 'fit-content'
    }}>
      {/* Pulsing green dot */}
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#22c55e',
        display: 'inline-block',
        flexShrink: 0,
        animation: 'livePulse 2s ease-in-out infinite'
      }} />
      <span>
        <strong style={{ color: '#111111' }}>{count}+</strong>
        {' '}people practiced this week
      </span>
    </div>
  );
}
