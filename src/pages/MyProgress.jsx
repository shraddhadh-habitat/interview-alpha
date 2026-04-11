import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#1B1B18', textSoft: '#1B1B18', textMuted: '#5C5C57',
  border: '#E8E6E1', borderLight: '#F0EDE8',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1A7F37', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
  red: '#CF222E', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
  golden: '#B8860B',
};

const COMP_KEYS = ['structure', 'depth', 'frameworks', 'communication', 'trade_off_awareness'];

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .mp-page-pad { padding: 24px 16px !important; }
    .mp-stat-row { flex-wrap: wrap !important; gap: 10px !important; }
    .mp-modal-pad { padding: 24px 20px 20px !important; }
  }
  @media (max-width: 480px) {
    .mp-stat-row > * { min-width: calc(50% - 5px) !important; flex: 1 1 calc(50% - 5px) !important; }
  }
`;

// ─── SVG Line Chart ───
function ScoreChart({ data }) {
  if (!data.length) return (
    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No data yet</span>
    </div>
  );

  const W = 720, H = 160;
  const PAD = { top: 16, right: 16, bottom: 32, left: 36 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const getX = (i) => PAD.left + (i / Math.max(data.length - 1, 1)) * iW;
  const getY = (s) => PAD.top + iH - (s / 100) * iH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i).toFixed(1)},${getY(d.score).toFixed(1)}`).join(' ');
  const areaPath = data.length > 1
    ? `${linePath} L${getX(data.length - 1).toFixed(1)},${(H - PAD.bottom).toFixed(1)} L${getX(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} Z`
    : '';

  const gridYs = [0, 25, 50, 75, 100];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {gridYs.map(y => (
        <g key={y}>
          <line x1={PAD.left} y1={getY(y)} x2={W - PAD.right} y2={getY(y)}
            stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
          <text x={PAD.left - 6} y={getY(y) + 4} textAnchor="end"
            fontSize="9" fill={C.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif">{y}</text>
        </g>
      ))}
      {areaPath && <path d={areaPath} fill="rgba(232,101,10,0.06)" />}
      {data.length > 1 && (
        <path d={linePath} fill="none" stroke={C.orange} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      )}
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.score)} r="4"
          fill={C.orange} stroke="#fff" strokeWidth="2">
          <title>{`Score: ${d.score}`}</title>
        </circle>
      ))}
    </svg>
  );
}

// ─── Competency bar ───
function CompBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? C.green : pct >= 40 ? C.yellow : C.red;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: 12, color, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 5, background: C.bgMuted, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
    </div>
  );
}

// ─── Stat card ───
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: '20px 22px', flex: 1, minWidth: 120,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 700, color: color || C.text, fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ─── Review Modal ───
function ReviewModal({ attempt, onClose }) {
  const score = attempt.score;
  const scoreColor = score >= 70 ? C.green : score >= 40 ? C.yellow : C.red;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bg, borderRadius: 16, border: `1px solid ${C.border}`,
          maxWidth: 640, width: '100%', maxHeight: '85vh',
          overflow: 'auto', padding: '36px 36px 28px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
              {attempt.designation} · Attempt #{attempt.attempt_number}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: scoreColor, fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 13, color: C.textMuted }}>/100</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.textMuted, lineHeight: 1, padding: 4 }}
          >×</button>
        </div>

        <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, marginBottom: 20, padding: '12px 16px', background: C.bgSoft, borderRadius: 12 }}>
          {attempt.feedback_text || 'No summary available.'}
        </p>

        {attempt.competency_breakdown && (
          <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            {Object.entries(attempt.competency_breakdown).map(([k, v]) => (
              <CompBar key={k} label={k} value={v} />
            ))}
          </div>
        )}

        {attempt.expert_rewrite && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>Expert Rewrite</div>
            <div style={{ padding: '14px 18px', background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 16, fontSize: 13, lineHeight: 1.8, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'pre-wrap' }}>
              {attempt.expert_rewrite}
            </div>
          </div>
        )}

        {(attempt.improvement_tips || []).length > 0 && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>Improvement Tips</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {attempt.improvement_tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <span style={{ color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyProgress({ user }) {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]); // sorted ASC by created_at
  const [reviewTarget, setReviewTarget] = useState(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('practice_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setAttempts(data || []);
        setLoading(false);
      });
  }, [user]);

  // ── Stats ──
  const totalAttempts = attempts.length;
  const uniqueQuestions = new Set(attempts.map(a => a.question_id)).size;
  const scores = attempts.map(a => a.score).filter(s => typeof s === 'number');
  const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;

  const streak = (() => {
    if (!attempts.length) return 0;
    const days = [...new Set(attempts.map(a => a.created_at?.slice(0, 10)).filter(Boolean))].sort().reverse();
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;
    let expected = today;
    for (const day of days) {
      if (day === expected) {
        count++;
        const d = new Date(expected);
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().slice(0, 10);
      } else if (day < expected) {
        break;
      }
    }
    return count;
  })();

  // ── Chart: last 30 attempts ──
  const chartData = attempts.slice(-30);

  // ── Designation breakdown ──
  const designationMap = {};
  for (const a of attempts) {
    const d = a.designation || 'Unknown';
    if (!designationMap[d]) designationMap[d] = { attempts: 0, total: 0, best: 0, questions: new Set() };
    designationMap[d].attempts++;
    designationMap[d].total += (a.score || 0);
    if ((a.score || 0) > designationMap[d].best) designationMap[d].best = a.score || 0;
    designationMap[d].questions.add(a.question_id);
  }
  const designationRows = Object.entries(designationMap)
    .map(([d, s]) => ({ designation: d, attempts: s.attempts, avg: s.attempts ? Math.round(s.total / s.attempts) : 0, best: s.best, questions: s.questions.size }))
    .sort((a, b) => b.attempts - a.attempts);

  // ── Competency averages ──
  const compTotals = Object.fromEntries(COMP_KEYS.map(k => [k, 0]));
  let compCount = 0;
  for (const a of attempts) {
    if (a.competency_breakdown && typeof a.competency_breakdown === 'object') {
      for (const k of COMP_KEYS) {
        if (typeof a.competency_breakdown[k] === 'number') compTotals[k] += a.competency_breakdown[k];
      }
      compCount++;
    }
  }
  const compAvg = compCount > 0
    ? Object.fromEntries(COMP_KEYS.map(k => [k, Math.round(compTotals[k] / compCount * 10) / 10]))
    : null;

  const weakest = compAvg
    ? COMP_KEYS.map(k => ({ key: k, value: compAvg[k] })).sort((a, b) => a.value - b.value).slice(0, 3)
    : [];

  // ── Recent 20 (desc) ──
  const recentAttempts = [...attempts].reverse().slice(0, 20);

  if (loading) return (
    <div style={{ minHeight: '100vh', paddingTop: 55, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bgSoft, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span style={{ fontSize: 11, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase' }}>Loading...</span>
    </div>
  );

  const sectionStyle = {
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
    padding: '28px 32px', marginBottom: 24,
    animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)',
  };
  const sectionHeader = {
    fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.textMuted,
    fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 20,
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{globalStyles}</style>

      {reviewTarget && <ReviewModal attempt={reviewTarget} onClose={() => setReviewTarget(null)} />}

      <div className="mp-page-pad" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 28px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 10 }}>ANALYTICS</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            My Progress
          </h2>
          <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your practice history, competency trends, and improvement opportunities.
          </p>
        </div>

        {totalAttempts === 0 ? (
          <div style={{ ...sectionStyle, textAlign: 'center', padding: '64px 32px' }}>
            <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>◆</div>
            <div style={{ fontSize: 18, fontFamily: "'Instrument Serif', serif", color: C.text, marginBottom: 10 }}>No attempts yet</div>
            <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Head to Practice Q&A and answer your first question to start tracking your progress.
            </p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mp-stat-row" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <StatCard label="Questions Attempted" value={uniqueQuestions} sub="unique questions" />
              <StatCard label="Total Attempts" value={totalAttempts} sub="all time" />
              <StatCard label="Avg Score" value={avgScore} sub="out of 100" color={avgScore >= 70 ? C.green : avgScore >= 40 ? C.yellow : C.red} />
              <StatCard label="Best Score" value={bestScore} sub="personal best" color={C.orange} />
              <StatCard label="Day Streak" value={streak} sub={streak === 1 ? 'day' : 'days'} color={streak >= 7 ? C.green : streak >= 3 ? C.yellow : C.text} />
            </div>

            {/* Score over time */}
            <div style={sectionStyle}>
              <div style={sectionHeader}>Score Trend — Last {Math.min(chartData.length, 30)} Attempts</div>
              <ScoreChart data={chartData} />
            </div>

            {/* Competency summary */}
            {compAvg && (
              <div style={sectionStyle}>
                <div style={sectionHeader}>Competency Averages</div>
                <div style={{ display: 'grid', gap: 14 }}>
                  {COMP_KEYS.map(k => <CompBar key={k} label={k} value={compAvg[k]} />)}
                </div>
              </div>
            )}

            {/* Weakest areas */}
            {weakest.length > 0 && (
              <div style={{ ...sectionStyle, background: C.bgSoft, border: `1px solid ${C.yellowBorder}` }}>
                <div style={{ ...sectionHeader, color: C.yellow }}>Focus Areas — Lowest Competencies</div>
                <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
                  {weakest.map(w => <CompBar key={w.key} label={w.key} value={w.value} />)}
                </div>
                <div style={{ padding: '14px 18px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.yellow, marginBottom: 8 }}>Tip</div>
                  <p style={{ fontSize: 12, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
                    Focus your next sessions on <strong>{weakest[0].key.replace(/_/g, ' ')}</strong>. In the Practice Q&A library, look for questions that require explicit trade-off reasoning and structured frameworks.
                  </p>
                </div>
              </div>
            )}

            {/* Designation breakdown */}
            {designationRows.length > 0 && (
              <div style={sectionStyle}>
                <div style={sectionHeader}>By Designation</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>
                        {['Designation', 'Questions', 'Attempts', 'Avg Score', 'Best'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, borderBottom: `1px solid ${C.border}`, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {designationRows.map(row => {
                        const avgColor = row.avg >= 70 ? C.green : row.avg >= 40 ? C.yellow : C.red;
                        const maxAttempts = Math.max(...designationRows.map(r => r.attempts));
                        const pct = Math.round((row.attempts / maxAttempts) * 100);
                        return (
                          <tr key={row.designation}>
                            <td style={{ padding: '12px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>{row.designation}</td>
                            <td style={{ padding: '12px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>{row.questions}</td>
                            <td style={{ padding: '12px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ height: 4, width: 60, background: C.bgMuted, borderRadius: 2, overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: C.orange, borderRadius: 2 }} />
                                </div>
                                <span style={{ color: C.textMuted }}>{row.attempts}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 12px', borderBottom: `1px solid ${C.borderLight}`, color: avgColor, fontWeight: 600 }}>{row.avg}</td>
                            <td style={{ padding: '12px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.orange, fontWeight: 600 }}>{row.best}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent attempts */}
            <div style={sectionStyle}>
              <div style={sectionHeader}>Recent Attempts (Last {recentAttempts.length})</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Date', 'Question', 'Designation', 'Attempt', 'Score', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, borderBottom: `1px solid ${C.border}`, fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttempts.map((a, i) => {
                      const score = a.score;
                      const scoreColor = score >= 70 ? C.green : score >= 40 ? C.yellow : C.red;
                      const date = a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';
                      const qSnippet = a.question_id?.split('-').slice(2).join(' ') || a.question_id || '—';
                      return (
                        <tr key={i}>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted, whiteSpace: 'nowrap' }}>{date}</td>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 280 }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                              {a.user_answer ? a.user_answer.slice(0, 60) + (a.user_answer.length > 60 ? '…' : '') : qSnippet}
                            </div>
                          </td>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted, whiteSpace: 'nowrap' }}>{a.designation || '—'}</td>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>#{a.attempt_number}</td>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: scoreColor, fontWeight: 700 }}>{score}</td>
                          <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                            <button
                              onClick={() => setReviewTarget(a)}
                              style={{
                                background: 'none', border: 'none', padding: 0,
                                fontSize: 11, color: C.orange, cursor: 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
                                textDecoration: 'underline', textUnderlineOffset: 3,
                              }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
