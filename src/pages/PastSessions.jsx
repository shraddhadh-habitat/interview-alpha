import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#555555', textMuted: '#999999',
  border: '#E5E5E5', borderLight: '#F0F0F0',
  orange: '#E8650A', orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
  red: '#D32F2F', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)',
};

function scoreColor(s) {
  return s >= 70 ? C.green : s >= 40 ? C.yellow : C.red;
}

function TrackBadge({ track }) {
  const icon = track === 'Product Sense' ? '◆' : track === 'Execution' ? '▲' : '●';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px',
      background: C.orangeLight, border: `1px solid ${C.orangeBorder}`,
      borderRadius: 4, fontSize: 11, color: C.orange,
      fontFamily: "'DM Mono', monospace", letterSpacing: 1,
    }}>
      {icon} {track}
    </span>
  );
}

function SessionDetail({ session, onBack }) {
  const sc = scoreColor(session.overall_score);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 28px', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 12, cursor: 'pointer', marginBottom: 28, fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>
        ← BACK
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <TrackBadge track={session.track} />
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
          {new Date(session.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginLeft: 'auto' }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: sc, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{session.overall_score}</span>
          <span style={{ fontSize: 13, color: C.textMuted }}>/100</span>
        </div>
      </div>

      {/* Competency bars */}
      {session.competency_breakdown && (
        <div style={{ background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 16 }}>Competency Breakdown</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {Object.entries(session.competency_breakdown).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: C.textSoft }}>{key.replace(/_/g, ' ')}</span>
                  <span style={{ fontSize: 13, color: sc, fontWeight: 600 }}>{val}/10</span>
                </div>
                <div style={{ height: 5, background: C.bgMuted, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${val * 10}%`, height: '100%', background: sc, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: C.red, marginBottom: 10 }}>Filler Words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(session.detected_filler_words || []).length > 0
              ? session.detected_filler_words.map((w, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 4, fontSize: 12, color: C.red }}>{w}</span>
                ))
              : <span style={{ fontSize: 12, color: C.textMuted }}>None — clean delivery</span>}
          </div>
        </div>
        <div style={{ background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: C.green, marginBottom: 10 }}>High-Signal Keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(session.high_signal_keywords || []).length > 0
              ? session.high_signal_keywords.map((w, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 4, fontSize: 12, color: C.green }}>{w}</span>
                ))
              : <span style={{ fontSize: 12, color: C.textMuted }}>None detected</span>}
          </div>
        </div>
      </div>

      {/* Alpha rewrite */}
      {session.alpha_rewrite && (
        <div style={{ background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: C.orange, marginBottom: 10 }}>The Alpha Rewrite</div>
          <div style={{ fontSize: 13, lineHeight: 1.75, color: C.text, fontFamily: "'Source Serif 4', serif" }}>{session.alpha_rewrite}</div>
        </div>
      )}

      {/* Next drill */}
      {session.next_drill && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: C.textMuted, marginBottom: 8 }}>Next Drill</div>
          <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6, fontFamily: "'Source Serif 4', serif" }}>{session.next_drill}</div>
        </div>
      )}

      {/* Conversation */}
      {session.messages && session.messages.length > 0 && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 20 }}>Full Conversation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.messages.filter(m => !m.hidden).map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '12px 18px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#F7F2ED' : C.bg,
                  border: `1px solid ${msg.role === 'user' ? '#EDE5DB' : C.border}`,
                  fontSize: 13, lineHeight: 1.7, color: C.text,
                  fontFamily: msg.role === 'user' ? "'DM Mono', monospace" : "'Source Serif 4', serif",
                  whiteSpace: 'pre-wrap',
                }}>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: msg.role === 'user' ? C.textMuted : C.orange, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
                    {msg.role === 'user' ? 'You' : 'Interviewer'}
                  </div>
                  {msg.role === 'assistant'
                    ? msg.content.replace(/```json[\s\S]*?```/g, '').trim()
                    : msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PastSessions({ user }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    supabase
      .from('sessions')
      .select('id, track, overall_score, created_at, competency_breakdown, detected_filler_words, high_signal_keywords, alpha_rewrite, next_drill, messages')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSessions(data);
        setLoading(false);
      });
  }, [user.id]);

  const globalStyles = `
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    * { box-sizing: border-box; }
  `;

  if (selected) {
    return (
      <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55 }}>
        <style>{globalStyles}</style>
        <SessionDetail session={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'DM Mono', monospace" }}>
      <style>{globalStyles}</style>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 10 }}>YOUR HISTORY</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.text }}>Past Sessions</h2>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted, fontSize: 12, letterSpacing: 1 }}>Loading sessions...</div>
        )}

        {!loading && sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>
            <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.3 }}>◆</div>
            <div style={{ fontSize: 13, fontFamily: "'Source Serif 4', serif" }}>No sessions yet. Complete your first interview to see results here.</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map((s, i) => {
            const sc = scoreColor(s.overall_score);
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20,
                  padding: '20px 24px',
                  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
                  cursor: 'pointer', textAlign: 'left', color: C.text,
                  transition: 'all 0.2s', width: '100%',
                  animation: `fadeUp ${0.3 + i * 0.08}s cubic-bezier(0.22,1,0.36,1)`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.boxShadow = '0 2px 12px rgba(232,101,10,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Score */}
                <div style={{ textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: sc, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{s.overall_score ?? '—'}</div>
                  <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 1 }}>/100</div>
                </div>
                <div style={{ width: 1, height: 36, background: C.borderLight }} />
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}><TrackBadge track={s.track} /></div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {new Date(s.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{ color: C.textMuted, fontSize: 16 }}>→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
