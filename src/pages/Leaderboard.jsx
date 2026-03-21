import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#555555', textMuted: '#999999',
  border: '#E5E5E5', borderLight: '#F0F0F0',
  orange: '#E8650A', orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)',
  red: '#D32F2F', redLight: 'rgba(211,47,47,0.07)',
};

function scoreColor(s) {
  return s >= 70 ? C.green : s >= 40 ? C.yellow : C.red;
}

function RankBadge({ rank }) {
  const medals = { 1: { bg: '#FFD700', color: '#7A5800' }, 2: { bg: '#C0C0C0', color: '#4A4A4A' }, 3: { bg: '#CD7F32', color: '#5C3010' } };
  const medal = medals[rank];
  if (medal) {
    return (
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: medal.bg, color: medal.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace",
      }}>
        {rank}
      </div>
    );
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: C.bgMuted, color: C.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontFamily: "'DM Mono', monospace",
    }}>
      {rank}
    </div>
  );
}

function maskEmail(email) {
  const [local, domain] = email.split('@');
  const masked = local.length <= 2 ? local : local[0] + '•'.repeat(Math.min(local.length - 2, 4)) + local[local.length - 1];
  return `${masked}@${domain}`;
}

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.rpc('get_leaderboard')
      .then(({ data, error }) => {
        if (error) { setError(error.message); }
        else { setRows(data || []); }
        setLoading(false);
      });
  }, []);

  const globalStyles = `
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    * { box-sizing: border-box; }
  `;

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'DM Mono', monospace" }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 10 }}>GLOBAL RANKINGS</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.text }}>Leaderboard</h2>
          <p style={{ marginTop: 8, fontSize: 13, color: C.textSoft, fontFamily: "'Source Serif 4', serif" }}>
            Ranked by best session score. Only users with at least one completed session are shown.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted, fontSize: 12, letterSpacing: 1 }}>Loading rankings...</div>
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: C.redLight, border: `1px solid rgba(211,47,47,0.18)`, borderRadius: 8, fontSize: 12, color: C.red, marginBottom: 24 }}>
            Could not load leaderboard: {error}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
            <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>▲</div>
            <div style={{ fontSize: 13, fontFamily: "'Source Serif 4', serif" }}>No completed sessions yet. Be the first on the board.</div>
          </div>
        )}

        {/* Table header */}
        {rows.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px', gap: 16, padding: '8px 20px', marginBottom: 8 }}>
            {['#', 'User', 'Best', 'Avg', 'Sessions'].map(h => (
              <div key={h} style={{ fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: C.textMuted }}>{h}</div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row, i) => {
            const sc = scoreColor(row.best_score);
            const isTop3 = row.rank <= 3;
            return (
              <div
                key={i}
                style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px',
                  gap: 16, alignItems: 'center',
                  padding: '16px 20px',
                  background: isTop3 ? C.bg : C.bg,
                  border: `1px solid ${isTop3 ? C.orangeBorder : C.border}`,
                  borderRadius: 10,
                  animation: `fadeUp ${0.3 + i * 0.07}s cubic-bezier(0.22,1,0.36,1)`,
                  boxShadow: isTop3 ? '0 1px 8px rgba(232,101,10,0.06)' : 'none',
                }}
              >
                <RankBadge rank={Number(row.rank)} />
                <div style={{ fontSize: 13, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {maskEmail(row.email)}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: sc, fontFamily: "'Playfair Display', serif" }}>{row.best_score}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, color: C.textSoft }}>{row.avg_score}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{row.total_sessions}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
