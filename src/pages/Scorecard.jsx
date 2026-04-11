import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { pmQuestions } from '../data/pmQuestions';

const C = {
  bg: '#FAFAF8',
  card: '#FFFFFF',
  bgMuted: '#F5F3EF',
  text: '#1B1B18',
  textMuted: '#5C5C57',
  textSoft: '#5C5C57',
  border: '#E8E6E1',
  borderLight: '#F0EDE8',
  orange: '#E8650A',
  orangeLight: 'rgba(232,101,10,0.08)',
  orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1A7F37',
  greenLight: 'rgba(27,140,58,0.08)',
  greenBorder: 'rgba(27,140,58,0.2)',
  red: '#CF222E',
  redLight: 'rgba(211,47,47,0.07)',
  redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00',
  yellowLight: 'rgba(198,127,0,0.06)',
  yellowBorder: 'rgba(198,127,0,0.15)',
};

const NAV_H = 55;

// Practice attempt competency keys (5 fields from PracticeMode scoring)
const COMP_KEYS = ['structure', 'depth', 'frameworks', 'communication', 'trade_off_awareness'];

// Interview session competency → display label mapping (8 fields)
const COMPETENCIES = [
  { label: 'Structure',            sessionKey: 'communication_and_structure', practiceKey: 'structure' },
  { label: 'Depth',                sessionKey: 'technical_depth',             practiceKey: 'depth' },
  { label: 'Frameworks',           sessionKey: 'product_sense',               practiceKey: 'frameworks' },
  { label: 'Communication',        sessionKey: 'leadership_and_influence',    practiceKey: 'communication' },
  { label: 'Trade-off Awareness',  sessionKey: 'trade_off_awareness',         practiceKey: 'trade_off_awareness' },
  { label: 'User Empathy',         sessionKey: 'user_empathy',                practiceKey: null },
  { label: 'Metrics & Analytics',  sessionKey: 'metrics_and_analytics',       practiceKey: null },
  { label: 'Strategic Thinking',   sessionKey: 'strategy',                    practiceKey: null },
];

const TIPS = {
  'Structure': [
    'Open every answer with a 1-sentence thesis before diving into detail',
    'Practice SCQA: Situation → Complication → Question → Answer',
    'Time-box sections: 30s framing, 3min core, 30s synthesis',
  ],
  'Depth': [
    'Follow every claim with a "because" clause with specific reasoning',
    'Go 3 levels deep: surface observation → mechanism → implication',
    'Anchor with concrete numbers and real-world examples',
  ],
  'Frameworks': [
    'Practice CIRCLES, JTBD, RICE, and AARRR until they feel natural',
    'Always state why you chose this framework over alternatives',
    'Adapt frameworks to context — never apply them mechanically',
  ],
  'Communication': [
    'Lead with the conclusion, then support it (headline-first)',
    'Record yourself and listen for clarity, filler words, and pace',
    'Pause instead of saying "um" — silence signals confidence',
  ],
  'Trade-off Awareness': [
    'Explicitly name 2 things you are NOT doing and why',
    'Distinguish short-term cost vs long-term gain in every decision',
    'Use "Yes, and the cost is..." to acknowledge trade-offs cleanly',
  ],
  'User Empathy': [
    'Define the user segment and core job-to-be-done before any solution',
    'Build mini-personas with specific pain points and friction moments',
    'Ask: "What does the user lose if this feature never ships?"',
  ],
  'Metrics & Analytics': [
    'Define a North Star metric AND 2 guardrail metrics for every feature',
    'Distinguish leading (predictive) vs lagging (outcome) indicators',
    'Specify how you would isolate causation from correlation',
  ],
  'Strategic Thinking': [
    'Identify competitive moats: data advantage, network effects, switching costs',
    'For every product decision, ask: "What does this unlock in 3 years?"',
    'Frame solutions in terms of business model impact, not just user value',
  ],
};

// ── Utilities ────────────────────────────────────────────────────────────────

function gradeInfo(score) {
  if (score >= 90) return { grade: 'A+', color: C.green };
  if (score >= 80) return { grade: 'A',  color: C.green };
  if (score >= 70) return { grade: 'B+', color: C.orange };
  if (score >= 60) return { grade: 'B',  color: C.orange };
  if (score >= 50) return { grade: 'C',  color: C.yellow };
  return                   { grade: 'D',  color: C.red };
}

function compInsightText(score) {
  if (score >= 8) return 'Exceptional — interview-ready';
  if (score >= 6) return 'Good — minor refinements needed';
  if (score >= 4) return 'Developing — focused practice recommended';
  return 'Critical gap — prioritize this immediately';
}

function compInsightColor(score) {
  if (score >= 8) return C.green;
  if (score >= 6) return C.orange;
  if (score >= 4) return C.yellow;
  return C.red;
}

function scoreColor100(s) {
  return s >= 70 ? C.green : s >= 40 ? C.yellow : C.red;
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length);
}

function movingAvg(arr, w = 3) {
  return arr.map((_, i) => {
    const s = arr.slice(Math.max(0, i - w + 1), i + 1);
    return s.reduce((a, b) => a + b, 0) / s.length;
  });
}

// Build question lookup: key = "${level}-${category}-${index}"
const questionLookup = {};
for (const [level, bank] of Object.entries(pmQuestions || {})) {
  if (!bank) continue;
  for (const [cat, questions] of Object.entries(bank)) {
    if (!Array.isArray(questions)) continue;
    questions.forEach((q, i) => { questionLookup[`${level}-${cat}-${i}`] = q; });
  }
}
function getQuestionText(qid) {
  const q = questionLookup[qid];
  return q?.q ?? q?.text ?? null;
}

// ── MY PROGRESS sub-components ───────────────────────────────────────────────

function ScoreChart({ data }) {
  if (!data.length) return (
    <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No data yet</span>
    </div>
  );
  const W = 720, H = 150;
  const PAD = { top: 14, right: 16, bottom: 28, left: 36 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;
  const getX = (i) => PAD.left + (i / Math.max(data.length - 1, 1)) * iW;
  const getY = (s) => PAD.top + iH - (Math.max(0, Math.min(100, s)) / 100) * iH;
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i).toFixed(1)},${getY(d.score).toFixed(1)}`).join(' ');
  const areaPath = data.length > 1
    ? `${linePath} L${getX(data.length - 1).toFixed(1)},${(H - PAD.bottom).toFixed(1)} L${getX(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} Z`
    : '';
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      {[0, 25, 50, 75, 100].map(y => (
        <g key={y}>
          <line x1={PAD.left} y1={getY(y)} x2={W - PAD.right} y2={getY(y)} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
          <text x={PAD.left - 6} y={getY(y) + 4} textAnchor="end" fontSize="9" fill={C.textMuted} fontFamily="'Plus Jakarta Sans', sans-serif">{y}</text>
        </g>
      ))}
      {areaPath && <path d={areaPath} fill="rgba(232,101,10,0.06)" />}
      {data.length > 1 && <path d={linePath} fill="none" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.score)} r="4" fill={C.orange} stroke="#fff" strokeWidth="2">
          <title>{`Score: ${d.score}`}</title>
        </circle>
      ))}
    </svg>
  );
}

function CompBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? C.green : pct >= 40 ? C.yellow : C.red;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: 12, color, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: C.bgMuted, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}99, ${color})`, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 22px', flex: 1, minWidth: 110, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}>
      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 700, color: color || C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function ReviewModal({ attempt, onClose }) {
  const score = attempt.score;
  const color = scoreColor100(score);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, maxWidth: 640, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '36px 36px 28px', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', marginBottom: 6 }}>
              {attempt.designation} · Attempt #{attempt.attempt_number}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color, fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 13, color: C.textMuted }}>/100</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.textMuted, lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, marginBottom: 20, padding: '12px 16px', background: C.bgMuted, borderRadius: 8 }}>
          {attempt.feedback_text || 'No summary available.'}
        </p>
        {attempt.competency_breakdown && (
          <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
            {Object.entries(attempt.competency_breakdown).map(([k, v]) => <CompBar key={k} label={k} value={v} />)}
          </div>
        )}
        {attempt.expert_rewrite && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>Expert Rewrite</div>
            <div style={{ padding: '14px 18px', background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 10, fontSize: 13, lineHeight: 1.8, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'pre-wrap' }}>
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

// ── SCORECARD sub-components ─────────────────────────────────────────────────

function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, color: C.text, letterSpacing: -0.5, marginBottom: 5 }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{sub}</p>}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 26, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}>
        {children}
      </div>
    </div>
  );
}

function InsightCard({ title, icon, iconColor, value, sub, subColor, badge, badgeColor, badgeBorder, badgeText }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</span>
        {badge && <span style={{ padding: '2px 7px', background: badgeColor, border: `1px solid ${badgeBorder}`, borderRadius: 10, fontSize: 9, color: badgeText, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{badge}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 16, color: iconColor }}>{icon}</span>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, fontWeight: 700, color: C.text }}>{value}</span>
      </div>
      <div style={{ fontSize: 11, color: subColor || C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.2 }}>{sub}</div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 1, textTransform: 'uppercase' }}>{label}:</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: '5px 10px', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, background: C.card, cursor: 'pointer', outline: 'none' }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ReadinessMeter({ score, interviewCount, practiceCount }) {
  const r = 88, cx = 120, cy = 114;
  const circumference = Math.PI * r;
  const filled = Math.min(1, score / 100) * circumference;
  const { grade, color } = gradeInfo(score);
  return (
    <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
      <svg width={240} height={132} style={{ overflow: 'visible' }}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.borderLight} strokeWidth={22} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${filled} ${circumference}`} />
        <text x={cx} y={cy - 14} textAnchor="middle" style={{ fontSize: 48, fontWeight: 900, fill: color, fontFamily: "'Instrument Serif', serif" }}>{score}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: color, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 2 }}>{grade}</text>
      </svg>
      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.3, marginTop: 8, lineHeight: 1.6 }}>
        {interviewCount} interview{interviewCount !== 1 ? 's' : ''} · {practiceCount} practice attempt{practiceCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function RadarChart({ avgComp }) {
  const N = COMPETENCIES.length;
  const CX = 200, CY = 210, R = 140, LEVELS = 5;
  function angle(i) { return (i / N) * 2 * Math.PI - Math.PI / 2; }
  function pt(i, scale) { const a = angle(i); return [CX + R * scale * Math.cos(a), CY + R * scale * Math.sin(a)]; }
  const bgRings = Array.from({ length: LEVELS }, (_, lvl) => {
    const sc = (lvl + 1) / LEVELS;
    const pts = COMPETENCIES.map((_, i) => pt(i, sc).join(',')).join(' ');
    return <polygon key={lvl} points={pts} fill="none" stroke={lvl === LEVELS - 1 ? '#CCCCCC' : C.borderLight} strokeWidth={lvl === LEVELS - 1 ? 1.5 : 1} />;
  });
  const axes = COMPETENCIES.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke={C.borderLight} strokeWidth={1} />; });
  const dataPolygon = COMPETENCIES.map(({ label }, i) => pt(i, (avgComp[label] ?? 0) / 10).join(',')).join(' ');
  const dots = COMPETENCIES.map(({ label }, i) => { const [x, y] = pt(i, (avgComp[label] ?? 0) / 10); return <circle key={i} cx={x} cy={y} r={5} fill={C.orange} stroke="white" strokeWidth={2} />; });
  const levelMarkers = [2, 4, 6, 8, 10].map((v, i) => { const [lx, ly] = pt(0, (i + 1) / LEVELS); return <text key={v} x={lx + 5} y={ly + 4} style={{ fontSize: 9, fill: '#BBBBBB', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</text>; });
  const labelEls = COMPETENCIES.map(({ label }, i) => {
    const a = angle(i);
    const lx = CX + (R + 28) * Math.cos(a), ly = CY + (R + 28) * Math.sin(a);
    const anchor = Math.cos(a) > 0.15 ? 'start' : Math.cos(a) < -0.15 ? 'end' : 'middle';
    const v = avgComp[label];
    return (
      <g key={i}>
        <text x={lx} y={ly - 2} textAnchor={anchor} style={{ fontSize: 11, fill: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{label}</text>
        <text x={lx} y={ly + 13} textAnchor={anchor} style={{ fontSize: 10, fill: v != null ? compInsightColor(v) : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v != null ? `${v.toFixed(1)}/10` : 'No data'}</text>
      </g>
    );
  });
  return (
    <svg width="100%" viewBox="0 0 400 420" style={{ maxWidth: 420 }}>
      {bgRings}{axes}{levelMarkers}
      <polygon points={dataPolygon} fill="rgba(232,101,10,0.12)" stroke={C.orange} strokeWidth={2.5} />
      {dots}{labelEls}
    </svg>
  );
}

function PerformanceTimeline({ timeline }) {
  if (timeline.length < 2) return (
    <div style={{ textAlign: 'center', padding: '36px 0', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, letterSpacing: 0.3 }}>
      Complete at least 2 sessions to see your performance trend.
    </div>
  );
  const W = 700, H = 220, PL = 48, PR = 24, PT = 16, PB = 34;
  const IW = W - PL - PR, IH = H - PT - PB;
  const scores = timeline.map(a => a.score);
  const mavg = movingAvg(scores, 3);
  const minT = new Date(timeline[0].date).getTime();
  const maxT = new Date(timeline[timeline.length - 1].date).getTime();
  const tRange = maxT - minT || 1;
  function xp(d) { return PL + ((new Date(d).getTime() - minT) / tRange) * IW; }
  function yp(s) { return PT + IH - (Math.max(0, Math.min(100, s)) / 100) * IH; }
  const linePath = timeline.map((a, i) => `${i === 0 ? 'M' : 'L'} ${xp(a.date).toFixed(1)} ${yp(scores[i]).toFixed(1)}`).join(' ');
  const avgPath  = timeline.map((a, i) => `${i === 0 ? 'M' : 'L'} ${xp(a.date).toFixed(1)} ${yp(mavg[i]).toFixed(1)}`).join(' ');
  const step = Math.max(1, Math.floor(timeline.length / 5));
  const xLabels = timeline.filter((_, i) => i % step === 0 || i === timeline.length - 1);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={PL} y1={yp(v)} x2={W - PR} y2={yp(v)} stroke={C.borderLight} strokeDasharray="4 4" />
          <text x={PL - 6} y={yp(v) + 4} textAnchor="end" style={{ fontSize: 9, fill: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v}</text>
        </g>
      ))}
      <line x1={PL} y1={PT} x2={PL} y2={PT + IH} stroke="#DDDDDD" />
      <line x1={PL} y1={PT + IH} x2={W - PR} y2={PT + IH} stroke="#DDDDDD" />
      {xLabels.map((a, i) => <text key={i} x={xp(a.date)} y={H - 6} textAnchor="middle" style={{ fontSize: 9, fill: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</text>)}
      <path d={linePath} fill="none" stroke={C.orange} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={avgPath}  fill="none" stroke={C.green}  strokeWidth={1.5} strokeDasharray="6 3" strokeLinecap="round" />
      {timeline.map((a, i) => <circle key={i} cx={xp(a.date)} cy={yp(scores[i])} r={3.5} fill={C.orange} stroke="white" strokeWidth={1.5} />)}
      <g>
        <line x1={PL + 10} y1={PT + 12} x2={PL + 28} y2={PT + 12} stroke={C.orange} strokeWidth={2} />
        <text x={PL + 33} y={PT + 16} style={{ fontSize: 10, fill: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Score</text>
        <line x1={PL + 80} y1={PT + 12} x2={PL + 98} y2={PT + 12} stroke={C.green} strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PL + 103} y={PT + 16} style={{ fontSize: 10, fill: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>3-pt Avg</text>
      </g>
    </svg>
  );
}

function AttemptDetail({ item }) {
  const isSession = item._type === 'session';
  const comp = item.competency_breakdown ?? {};
  const compRows = isSession
    ? COMPETENCIES.map(c => ({ label: c.label, value: typeof comp[c.sessionKey] === 'number' ? comp[c.sessionKey] : null })).filter(r => r.value != null)
    : COMPETENCIES.filter(c => c.practiceKey).map(c => ({ label: c.label, value: typeof comp[c.practiceKey] === 'number' ? comp[c.practiceKey] : null })).filter(r => r.value != null);
  return (
    <div style={{ padding: '18px 22px', background: '#FAFAF8', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 200 }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10, fontWeight: 600 }}>Competency Scores</div>
        {compRows.length === 0 ? <div style={{ fontSize: 11, color: C.textMuted }}>No breakdown available</div>
          : compRows.map(({ label, value }) => (
            <div key={label} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{label}</span>
                <span style={{ fontSize: 11, color: compInsightColor(value), fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{value}/10</span>
              </div>
              <div style={{ height: 4, background: C.borderLight, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${(value / 10) * 100}%`, height: '100%', background: compInsightColor(value), borderRadius: 2 }} />
              </div>
            </div>
          ))}
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        {isSession ? (
          <>
            {item.high_signal_keywords?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Signal Keywords</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.high_signal_keywords.map((kw, i) => <span key={i} style={{ padding: '2px 8px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, fontSize: 10, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{kw}</span>)}
                </div>
              </div>
            )}
            {item.detected_filler_words?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Filler Words</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.detected_filler_words.map((w, i) => <span key={i} style={{ padding: '2px 8px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 10, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{w}</span>)}
                </div>
              </div>
            )}
            {item.alpha_rewrite && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Alpha Rewrite</div>
                <div style={{ padding: '10px 14px', background: 'rgba(232,101,10,0.05)', border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, maxHeight: 120, overflow: 'auto' }}>{item.alpha_rewrite}</div>
              </div>
            )}
            {item.next_drill && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 5, fontWeight: 600 }}>Next Drill</div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.55 }}>{item.next_drill}</div>
              </div>
            )}
          </>
        ) : (
          <>
            {item.user_answer && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Your Answer</div>
                <div style={{ padding: '10px 14px', background: C.borderLight, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, maxHeight: 90, overflow: 'auto' }}>{item.user_answer}</div>
              </div>
            )}
            {item.feedback_text && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>AI Feedback</div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65 }}>{item.feedback_text}</div>
              </div>
            )}
            {item.strengths?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Strengths</div>
                {item.strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3, display: 'flex', gap: 8 }}><span>+</span><span>{s}</span></div>)}
              </div>
            )}
            {item.weaknesses?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Areas to Improve</div>
                {item.weaknesses.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 3, display: 'flex', gap: 8 }}><span>→</span><span>{w}</span></div>)}
              </div>
            )}
            {item.expert_rewrite && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Expert Rewrite</div>
                <div style={{ padding: '10px 14px', background: 'rgba(232,101,10,0.05)', border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, maxHeight: 120, overflow: 'auto' }}>{item.expert_rewrite}</div>
              </div>
            )}
            {item.improvement_tips?.length > 0 && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 7, fontWeight: 600 }}>Improvement Tips</div>
                {item.improvement_tips.map((t, i) => <div key={i} style={{ fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4, lineHeight: 1.5 }}>{i + 1}. {t}</div>)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function Scorecard({ user }) {
  const [sessions, setSessions] = useState([]);
  const [practiceAttempts, setPracticeAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
      supabase.from('practice_attempts').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    ]).then(([{ data: s }, { data: p }]) => {
      setSessions(s || []);
      setPracticeAttempts(p || []);
      setLoading(false);
    });
  }, [user]);

  // ── My Progress stats (from practiceAttempts) ──
  const progress = useMemo(() => {
    const scores = practiceAttempts.map(a => a.score).filter(s => typeof s === 'number');
    const totalAttempts = practiceAttempts.length;
    const uniqueQuestions = new Set(practiceAttempts.map(a => a.question_id)).size;
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;

    const streak = (() => {
      if (!practiceAttempts.length) return 0;
      const days = [...new Set(practiceAttempts.map(a => a.created_at?.slice(0, 10)).filter(Boolean))].sort().reverse();
      const today = new Date().toISOString().slice(0, 10);
      let count = 0, expected = today;
      for (const day of days) {
        if (day === expected) { count++; const d = new Date(expected); d.setDate(d.getDate() - 1); expected = d.toISOString().slice(0, 10); }
        else if (day < expected) break;
      }
      return count;
    })();

    const chartData = practiceAttempts.slice(-30);

    const designationMap = {};
    for (const a of practiceAttempts) {
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

    const compTotals = Object.fromEntries(COMP_KEYS.map(k => [k, 0]));
    let compCount = 0;
    for (const a of practiceAttempts) {
      if (a.competency_breakdown && typeof a.competency_breakdown === 'object') {
        for (const k of COMP_KEYS) { if (typeof a.competency_breakdown[k] === 'number') compTotals[k] += a.competency_breakdown[k]; }
        compCount++;
      }
    }
    const compAvg = compCount > 0 ? Object.fromEntries(COMP_KEYS.map(k => [k, Math.round(compTotals[k] / compCount * 10) / 10])) : null;
    const weakest = compAvg ? COMP_KEYS.map(k => ({ key: k, value: compAvg[k] })).sort((a, b) => a.value - b.value).slice(0, 3) : [];
    const recentAttempts = [...practiceAttempts].reverse().slice(0, 20);

    return { scores, totalAttempts, uniqueQuestions, avgScore, bestScore, streak, chartData, designationRows, compAvg, weakest, recentAttempts };
  }, [practiceAttempts]);

  // ── Interview scorecard stats ──
  const scorecard = useMemo(() => {
    const sessionScores = sessions.map(s => s.overall_score).filter(v => typeof v === 'number');
    const readiness = sessionScores.length ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length) : 0;

    const compData = {};
    for (const comp of COMPETENCIES) {
      const vals = [];
      for (const s of sessions) { const v = s.competency_breakdown?.[comp.sessionKey]; if (typeof v === 'number') vals.push(v); }
      if (comp.practiceKey) { for (const p of practiceAttempts) { const v = p.competency_breakdown?.[comp.practiceKey]; if (typeof v === 'number') vals.push(v); } }
      compData[comp.label] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }

    const compEntries = Object.entries(compData).filter(([, v]) => v != null);
    const strongest = compEntries.length ? compEntries.reduce((a, b) => b[1] > a[1] ? b : a) : null;
    const weakest   = compEntries.length ? compEntries.reduce((a, b) => b[1] < a[1] ? b : a) : null;

    const improvRate = sessionScores.length >= 2 ? (() => {
      const f = sessionScores.slice(0, 5), l = sessionScores.slice(-5);
      const fa = f.reduce((a, b) => a + b, 0) / f.length, la = l.reduce((a, b) => a + b, 0) / l.length;
      return ((la - fa) / fa * 100).toFixed(1);
    })() : null;

    const sd = sessionScores.length >= 2 ? stdDev(sessionScores).toFixed(1) : null;
    const consistency = sd == null ? 'N/A' : parseFloat(sd) < 5 ? 'Very Consistent' : parseFloat(sd) < 10 ? 'Consistent' : parseFloat(sd) < 15 ? 'Variable' : 'Inconsistent';

    const timeline = [
      ...sessions.map(s => ({ date: s.created_at, score: s.overall_score ?? 0 })),
      ...practiceAttempts.map(p => ({ date: p.created_at, score: p.score ?? 0 })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    return { readiness, compData, strongest, weakest, improvRate, sd, consistency, timeline };
  }, [sessions, practiceAttempts]);

  const allItems = useMemo(() => {
    const items = [
      ...sessions.map(s => ({ ...s, _type: 'session', _score: s.overall_score ?? 0, _date: s.created_at, _question: `${s.track || 'PM'} Interview`, _designation: s.track })),
      ...practiceAttempts.map(p => ({ ...p, _type: 'practice', _score: p.score ?? 0, _date: p.created_at, _question: getQuestionText(p.question_id) ?? 'Practice Question', _designation: p.designation })),
    ];
    const filtered = items.filter(item => {
      if (filterType === 'interview' && item._type !== 'session') return false;
      if (filterType === 'practice'  && item._type !== 'practice') return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const val = sortBy === 'score' ? a._score - b._score : new Date(a._date) - new Date(b._date);
      return sortDir === 'asc' ? val : -val;
    });
  }, [sessions, practiceAttempts, filterType, sortBy, sortDir]);

  const focusAreas = useMemo(() =>
    Object.entries(scorecard.compData).filter(([, v]) => v != null).sort((a, b) => a[1] - b[1]).slice(0, 3),
    [scorecard]
  );

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase' }}>Loading...</span>
    </div>
  );

  const hasNoData = sessions.length === 0 && practiceAttempts.length === 0;
  if (hasNoData) return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 14 }}>No data yet</div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Complete at least one interview session or practice attempt to generate your scorecard.
        </div>
      </div>
    </div>
  );

  const sectionBox = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '24px 28px', marginBottom: 24 };
  const sectionLabel = { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 18, fontWeight: 600 };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .sc-page-pad { padding: 24px 16px 60px !important; }
          .sc-stat-row { flex-wrap: wrap !important; gap: 10px !important; }
          .sc-readiness-grid { grid-template-columns: 1fr !important; }
          .sc-insight-grid { grid-template-columns: 1fr 1fr !important; }
          .sc-competency-grid { grid-template-columns: 1fr !important; }
          .sc-log-row { grid-template-columns: 70px 1fr 64px 52px !important; }
          .sc-log-header { grid-template-columns: 70px 1fr 64px 52px !important; }
          .sc-log-col-designation { display: none !important; }
          .sc-log-col-type { display: none !important; }
        }
        @media (max-width: 480px) {
          .sc-stat-row > * { min-width: calc(50% - 5px) !important; flex: 1 1 calc(50% - 5px) !important; }
          .sc-h1 { font-size: 30px !important; }
          .sc-insight-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {reviewTarget && <ReviewModal attempt={reviewTarget} onClose={() => setReviewTarget(null)} />}

      <div className="sc-page-pad" style={{ maxWidth: 1060, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 44, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', color: C.textMuted, marginBottom: 12 }}>Performance Evaluation</div>
          <h1 className="sc-h1" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 900, color: C.text, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 12 }}>
            Your Performance<br /><span style={{ color: C.orange }}>Scorecard</span>
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: C.textMuted, lineHeight: 1.7, maxWidth: 500, marginBottom: 12 }}>
            Comprehensive analytics across all your interview sessions and practice attempts.
          </p>
          <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>{user.email}</div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION A: PRACTICE PROGRESS (from My Progress)
        ════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: -0.5, margin: 0 }}>Practice Analytics</h2>
            <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, paddingTop: 2 }}>Q&amp;A Practice</span>
          </div>

          {practiceAttempts.length === 0 ? (
            <div style={{ ...sectionBox, textAlign: 'center', padding: '48px 28px' }}>
              <div style={{ fontSize: 28, opacity: 0.2, marginBottom: 14 }}>◆</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: C.text, marginBottom: 10 }}>No practice attempts yet</div>
              <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Head to Practice Q&amp;A and answer your first question to see analytics here.</p>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="sc-stat-row" style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
                <StatCard label="Questions" value={progress.uniqueQuestions} sub="unique questions" />
                <StatCard label="Total Attempts" value={progress.totalAttempts} sub="all time" />
                <StatCard label="Avg Score" value={progress.avgScore} sub="out of 100" color={scoreColor100(progress.avgScore)} />
                <StatCard label="Best Score" value={progress.bestScore} sub="personal best" color={C.orange} />
                <StatCard label="Day Streak" value={progress.streak} sub={progress.streak === 1 ? 'day' : 'days'} color={progress.streak >= 7 ? C.green : progress.streak >= 3 ? C.yellow : C.text} />
              </div>

              {/* Score trend */}
              <div style={sectionBox}>
                <div style={sectionLabel}>Score Trend — Last {Math.min(progress.chartData.length, 30)} Attempts</div>
                <ScoreChart data={progress.chartData} />
              </div>

              {/* Competency averages */}
              {progress.compAvg && (
                <div style={sectionBox}>
                  <div style={sectionLabel}>Competency Averages (Practice)</div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {COMP_KEYS.map(k => <CompBar key={k} label={k} value={progress.compAvg[k]} />)}
                  </div>
                </div>
              )}

              {/* Weakest areas */}
              {progress.weakest.length > 0 && (
                <div style={{ ...sectionBox, background: '#FFFDF7', border: `1px solid ${C.yellowBorder}` }}>
                  <div style={{ ...sectionLabel, color: C.yellow }}>Focus Areas — Lowest Competencies</div>
                  <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                    {progress.weakest.map(w => <CompBar key={w.key} label={w.key} value={w.value} />)}
                  </div>
                  <div style={{ padding: '12px 16px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 8 }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.yellow, marginBottom: 6 }}>Tip</div>
                    <p style={{ fontSize: 12, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
                      Focus your next practice on <strong>{progress.weakest[0].key.replace(/_/g, ' ')}</strong>. Look for questions requiring explicit trade-off reasoning and structured frameworks.
                    </p>
                  </div>
                </div>
              )}

              {/* Designation breakdown */}
              {progress.designationRows.length > 0 && (
                <div style={sectionBox}>
                  <div style={sectionLabel}>By Designation</div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                      <thead>
                        <tr>{['Designation', 'Questions', 'Attempts', 'Avg Score', 'Best'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, borderBottom: `1px solid ${C.border}`, fontWeight: 500 }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {progress.designationRows.map(row => {
                          const color = scoreColor100(row.avg);
                          const maxA = Math.max(...progress.designationRows.map(r => r.attempts));
                          return (
                            <tr key={row.designation}>
                              <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>{row.designation}</td>
                              <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>{row.questions}</td>
                              <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div style={{ height: 4, width: 56, background: C.bgMuted, borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.round((row.attempts / maxA) * 100)}%`, height: '100%', background: C.orange, borderRadius: 2 }} />
                                  </div>
                                  <span style={{ color: C.textMuted }}>{row.attempts}</span>
                                </div>
                              </td>
                              <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color, fontWeight: 600 }}>{row.avg}</td>
                              <td style={{ padding: '11px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.orange, fontWeight: 600 }}>{row.best}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent attempts */}
              <div style={sectionBox}>
                <div style={sectionLabel}>Recent Attempts (Last {progress.recentAttempts.length})</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr>{['Date', 'Answer Preview', 'Designation', 'Attempt', 'Score', ''].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, borderBottom: `1px solid ${C.border}`, fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {progress.recentAttempts.map((a, i) => {
                        const color = scoreColor100(a.score);
                        const date = a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—';
                        return (
                          <tr key={i}>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted, whiteSpace: 'nowrap' }}>{date}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: 260 }}>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                                {a.user_answer ? a.user_answer.slice(0, 60) + (a.user_answer.length > 60 ? '…' : '') : '—'}
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted, whiteSpace: 'nowrap' }}>{a.designation || '—'}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}`, color: C.textMuted }}>#{a.attempt_number}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}`, color, fontWeight: 700 }}>{a.score}</td>
                            <td style={{ padding: '10px 12px', borderBottom: `1px solid ${C.borderLight}` }}>
                              <button onClick={() => setReviewTarget(a)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 11, color: C.orange, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5, textDecoration: 'underline', textUnderlineOffset: 3 }}>Review</button>
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
        </div>

        {/* Divider */}
        <div style={{ borderTop: `2px solid ${C.border}`, marginBottom: 52, position: 'relative' }}>
          <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: C.bg, padding: '0 16px', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: C.textMuted }}>Interview Performance</span>
        </div>

        {/* ════════════════════════════════════════════════════════════
            SECTION B: INTERVIEW SCORECARD
        ════════════════════════════════════════════════════════════ */}

        {sessions.length === 0 ? (
          <div style={{ ...sectionBox, textAlign: 'center', padding: '48px 28px', marginBottom: 40 }}>
            <div style={{ fontSize: 28, opacity: 0.2, marginBottom: 14 }}>◆</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: C.text, marginBottom: 10 }}>No interview sessions yet</div>
            <p style={{ fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Complete a full AI interview to see your readiness score, radar chart, and performance analysis.</p>
          </div>
        ) : (
          <>
            {/* Readiness + Insight Cards */}
            <div className="sc-readiness-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 22, marginBottom: 40, alignItems: 'start' }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0 14px 20px' }}>
                <div style={{ textAlign: 'center', paddingTop: 18, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted }}>PM Readiness Score</div>
                <ReadinessMeter score={scorecard.readiness} interviewCount={sessions.length} practiceCount={practiceAttempts.length} />
              </div>
              <div className="sc-insight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {scorecard.strongest && <InsightCard title="Strongest Competency" icon="◆" iconColor={C.green} value={scorecard.strongest[0]} sub={`${scorecard.strongest[1].toFixed(1)} / 10`} subColor={C.green} />}
                {scorecard.weakest && <InsightCard title="Weakest Competency" icon="▼" iconColor={C.red} value={scorecard.weakest[0]} sub={`${scorecard.weakest[1].toFixed(1)} / 10 — focus here`} subColor={C.red} badge="Focus Area" badgeColor={C.redLight} badgeBorder={C.redBorder} badgeText={C.red} />}
                <InsightCard title="Improvement Rate" icon={scorecard.improvRate != null && parseFloat(scorecard.improvRate) >= 0 ? '▲' : '▼'} iconColor={scorecard.improvRate != null && parseFloat(scorecard.improvRate) >= 0 ? C.green : C.red} value={scorecard.improvRate != null ? `${parseFloat(scorecard.improvRate) >= 0 ? '+' : ''}${scorecard.improvRate}%` : '—'} sub="first 5 vs last 5 sessions" subColor={C.textMuted} />
                <InsightCard title="Consistency" icon="≈" iconColor={C.orange} value={scorecard.consistency} sub={scorecard.sd != null ? `σ = ${scorecard.sd} pts` : 'Need 2+ sessions'} subColor={C.textMuted} />
              </div>
            </div>

            {/* Competency Deep Dive */}
            <Section title="Competency Deep Dive" sub="Averaged across all interview sessions and practice attempts">
              <div className="sc-competency-grid" style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 28, alignItems: 'start' }}>
                <RadarChart avgComp={scorecard.compData} />
                <div style={{ paddingTop: 6 }}>
                  {COMPETENCIES.map(({ label }) => {
                    const v = scorecard.compData[label];
                    if (v == null) return (
                      <div key={label} style={{ marginBottom: 13, opacity: 0.35 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{label}</span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>No data</span>
                        </div>
                        <div style={{ height: 4, background: C.borderLight, borderRadius: 3 }} />
                      </div>
                    );
                    const color = compInsightColor(v);
                    return (
                      <div key={label} style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Instrument Serif', serif" }}>{v.toFixed(1)}/10</span>
                        </div>
                        <div style={{ height: 5, background: C.borderLight, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
                          <div style={{ width: `${(v / 10) * 100}%`, height: '100%', background: color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, color, letterSpacing: 0.2 }}>{compInsightText(v)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>

            {/* Performance Timeline */}
            <Section title="Performance Timeline" sub="All attempts chronologically — orange = score, green dashed = 3-pt moving average">
              <PerformanceTimeline timeline={scorecard.timeline} />
            </Section>
          </>
        )}

        {/* Detailed Attempt Log */}
        <Section title="Detailed Attempt Log" sub="Every session and practice attempt — click any row to expand full feedback">
          <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterSelect label="Type" value={filterType} onChange={setFilterType} options={[{ value: 'all', label: 'All Types' }, { value: 'interview', label: 'Interviews only' }, { value: 'practice', label: 'Practice only' }]} />
            <FilterSelect label="Sort" value={`${sortBy}-${sortDir}`} onChange={v => { const [by, dir] = v.split('-'); setSortBy(by); setSortDir(dir); }} options={[{ value: 'date-desc', label: 'Newest first' }, { value: 'date-asc', label: 'Oldest first' }, { value: 'score-desc', label: 'Highest score' }, { value: 'score-asc', label: 'Lowest score' }]} />
            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 'auto' }}>{allItems.length} attempt{allItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', overflowX: 'auto' }}>
            <div className="sc-log-header" style={{ display: 'grid', gridTemplateColumns: '88px 1fr 96px 124px 68px 32px', padding: '10px 18px', background: '#F7F7F7', borderBottom: `1px solid ${C.border}`, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontWeight: 700, minWidth: 540 }}>
              <span>Date</span><span>Question / Track</span><span className="sc-log-col-type">Type</span><span className="sc-log-col-designation">Designation</span><span>Score</span><span></span>
            </div>
            {allItems.length === 0 ? (
              <div style={{ padding: '36px 18px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>No attempts match your current filters.</div>
            ) : allItems.map((item, idx) => {
              const isExpanded = expandedRows.has(item.id);
              const color = scoreColor100(item._score);
              return (
                <div key={item.id ?? idx} style={{ borderBottom: idx < allItems.length - 1 ? `1px solid ${C.borderLight}` : 'none' }}>
                  <div
                    onClick={() => setExpandedRows(prev => { const n = new Set(prev); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#FAFAF8'; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = C.card; }}
                    className="sc-log-row"
                    style={{ display: 'grid', gridTemplateColumns: '88px 1fr 96px 124px 68px 32px', padding: '12px 18px', alignItems: 'center', cursor: 'pointer', background: isExpanded ? 'rgba(232,101,10,0.03)' : C.card, transition: 'background 0.15s', minWidth: 540 }}
                  >
                    <span style={{ fontSize: 11, color: C.textMuted }}>{new Date(item._date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                    <span style={{ fontSize: 12, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 14 }}>{item._question.length > 88 ? item._question.slice(0, 88) + '…' : item._question}</span>
                    <span className="sc-log-col-type"><span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600, letterSpacing: 0.5, background: item._type === 'session' ? C.orangeLight : C.greenLight, border: `1px solid ${item._type === 'session' ? C.orangeBorder : C.greenBorder}`, color: item._type === 'session' ? C.orange : C.green }}>{item._type === 'session' ? 'Interview' : 'Practice'}</span></span>
                    <span className="sc-log-col-designation" style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item._designation || '—'}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color, fontFamily: "'Instrument Serif', serif" }}>{item._score}</span>
                    <span style={{ fontSize: 11, color: C.textMuted, textAlign: 'right' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                  {isExpanded && <AttemptDetail item={item} />}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Actionable Recommendations */}
        {focusAreas.length > 0 && (
          <div>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 5 }}>Your Top 3 Focus Areas</h2>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.2 }}>Prioritized by lowest competency scores</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 18 }}>
              {focusAreas.map(([label, score], idx) => {
                const color = compInsightColor(score);
                const target = Math.min(10, Math.ceil(score) + 2).toFixed(1);
                return (
                  <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, borderTop: `3px solid ${color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 5 }}>Focus #{idx + 1}</div>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17, fontWeight: 700, color: C.text }}>{label}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{score.toFixed(1)}</div>
                        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 2 }}>target {target}/10</div>
                      </div>
                    </div>
                    <div style={{ height: 4, background: C.borderLight, borderRadius: 2, overflow: 'hidden', marginBottom: 18 }}>
                      <div style={{ width: `${(score / 10) * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10, fontWeight: 600 }}>Action Steps</div>
                    {(TIPS[label] || []).map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9, fontSize: 13, color: C.textSoft, lineHeight: 1.55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <span style={{ color, fontWeight: 700, flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11 }}>{i + 1}.</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
