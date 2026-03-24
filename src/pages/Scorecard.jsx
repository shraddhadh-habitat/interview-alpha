import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { pmQuestions } from '../data/pmQuestions';

const C = {
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#666666',
  textSoft: '#444444',
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  orange: '#E8650A',
  orangeLight: 'rgba(232,101,10,0.08)',
  orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1B8C3A',
  greenLight: 'rgba(27,140,58,0.08)',
  greenBorder: 'rgba(27,140,58,0.2)',
  red: '#D32F2F',
  redLight: 'rgba(211,47,47,0.07)',
  redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00',
  yellowLight: 'rgba(198,127,0,0.06)',
  yellowBorder: 'rgba(198,127,0,0.15)',
};

const NAV_H = 55;

// Session competency_breakdown keys vs Practice competency_breakdown keys differ.
// This maps display label → both source keys.
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

// Build question lookup: question_id = "${level}-${category}-${i}"
const questionLookup = {};
for (const [level, bank] of Object.entries(pmQuestions || {})) {
  if (!bank) continue;
  for (const [cat, questions] of Object.entries(bank)) {
    if (!Array.isArray(questions)) continue;
    questions.forEach((q, i) => {
      questionLookup[`${level}-${cat}-${i}`] = q;
    });
  }
}

function getQuestionText(questionId) {
  const q = questionLookup[questionId];
  return q?.q ?? q?.text ?? null;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24, fontWeight: 700, color: C.text,
          letterSpacing: -0.5, marginBottom: 6,
        }}>{title}</h2>
        {sub && (
          <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.2 }}>
            {sub}
          </p>
        )}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
        {children}
      </div>
    </div>
  );
}

function InsightCard({ title, icon, iconColor, value, sub, subColor, badge, badgeColor, badgeBorder, badgeText }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{title}</span>
        {badge && (
          <span style={{ padding: '2px 8px', background: badgeColor, border: `1px solid ${badgeBorder}`, borderRadius: 10, fontSize: 9, color: badgeText, fontFamily: "'DM Mono', monospace", fontWeight: 600, letterSpacing: 0.5 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 18, color: iconColor }}>{icon}</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>
          {value}
        </span>
      </div>
      <div style={{ fontSize: 11, color: subColor || C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.2 }}>
        {sub}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: 'uppercase' }}>{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '5px 10px', border: `1px solid ${C.border}`, borderRadius: 6,
          fontSize: 11, fontFamily: "'DM Mono', monospace", color: C.text,
          background: C.card, cursor: 'pointer', outline: 'none',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Semicircular readiness gauge ─────────────────────────────────────────────

function ReadinessMeter({ score, interviewCount, practiceCount }) {
  const r = 88, cx = 120, cy = 114;
  const circumference = Math.PI * r;
  const filled = Math.min(1, score / 100) * circumference;
  const { grade, color } = gradeInfo(score);

  return (
    <div style={{ textAlign: 'center', padding: '20px 0 4px' }}>
      <svg width={240} height={132} style={{ overflow: 'visible' }}>
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={C.borderLight} strokeWidth={22} strokeLinecap="round"
        />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={22} strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <text x={cx} y={cy - 14} textAnchor="middle"
          style={{ fontSize: 48, fontWeight: 900, fill: color, fontFamily: "'Playfair Display', serif" }}>
          {score}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle"
          style={{ fontSize: 22, fontWeight: 700, fill: color, fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>
          {grade}
        </text>
      </svg>
      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.3, marginTop: 10, lineHeight: 1.6 }}>
        {interviewCount} interview{interviewCount !== 1 ? 's' : ''} · {practiceCount} practice attempt{practiceCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

// ─── Radar / spider chart ──────────────────────────────────────────────────────

function RadarChart({ avgComp }) {
  const N = COMPETENCIES.length;
  const CX = 200, CY = 210, R = 140;
  const LEVELS = 5;

  function angle(i) { return (i / N) * 2 * Math.PI - Math.PI / 2; }
  function pt(i, scale) {
    const a = angle(i);
    return [CX + R * scale * Math.cos(a), CY + R * scale * Math.sin(a)];
  }

  const bgRings = Array.from({ length: LEVELS }, (_, lvl) => {
    const sc = (lvl + 1) / LEVELS;
    const pts = COMPETENCIES.map((_, i) => pt(i, sc).join(',')).join(' ');
    return (
      <polygon key={lvl} points={pts} fill="none"
        stroke={lvl === LEVELS - 1 ? '#CCCCCC' : C.borderLight}
        strokeWidth={lvl === LEVELS - 1 ? 1.5 : 1}
      />
    );
  });

  const axes = COMPETENCIES.map((_, i) => {
    const [x, y] = pt(i, 1);
    return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke={C.borderLight} strokeWidth={1} />;
  });

  const dataPolygon = COMPETENCIES.map(({ label }, i) => {
    const v = avgComp[label] ?? 0;
    return pt(i, v / 10).join(',');
  }).join(' ');

  const dots = COMPETENCIES.map(({ label }, i) => {
    const v = avgComp[label] ?? 0;
    const [x, y] = pt(i, v / 10);
    return <circle key={i} cx={x} cy={y} r={5} fill={C.orange} stroke="white" strokeWidth={2} />;
  });

  const levelMarkers = [2, 4, 6, 8, 10].map((v, i) => {
    const sc = (i + 1) / LEVELS;
    const [lx, ly] = pt(0, sc);
    return (
      <text key={v} x={lx + 5} y={ly + 4}
        style={{ fontSize: 9, fill: '#BBBBBB', fontFamily: "'DM Mono', monospace" }}>
        {v}
      </text>
    );
  });

  const labelEls = COMPETENCIES.map(({ label }, i) => {
    const a = angle(i);
    const lx = CX + (R + 28) * Math.cos(a);
    const ly = CY + (R + 28) * Math.sin(a);
    const anchor = Math.cos(a) > 0.15 ? 'start' : Math.cos(a) < -0.15 ? 'end' : 'middle';
    const v = avgComp[label];
    const vColor = v != null ? compInsightColor(v) : C.textMuted;
    return (
      <g key={i}>
        <text x={lx} y={ly - 2} textAnchor={anchor}
          style={{ fontSize: 11, fill: C.text, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
          {label}
        </text>
        <text x={lx} y={ly + 13} textAnchor={anchor}
          style={{ fontSize: 10, fill: vColor, fontFamily: "'DM Mono', monospace" }}>
          {v != null ? `${v.toFixed(1)}/10` : 'No data'}
        </text>
      </g>
    );
  });

  return (
    <svg width="100%" viewBox="0 0 400 420" style={{ maxWidth: 420 }}>
      {bgRings}
      {axes}
      {levelMarkers}
      <polygon points={dataPolygon} fill="rgba(232,101,10,0.12)" stroke={C.orange} strokeWidth={2.5} />
      {dots}
      {labelEls}
    </svg>
  );
}

// ─── Performance timeline ──────────────────────────────────────────────────────

function PerformanceTimeline({ timeline }) {
  if (timeline.length < 2) return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 0.3 }}>
      Complete at least 2 sessions to see your performance trend.
    </div>
  );

  const W = 700, H = 230;
  const PL = 48, PR = 24, PT = 20, PB = 36;
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
          <text x={PL - 6} y={yp(v) + 4} textAnchor="end"
            style={{ fontSize: 9, fill: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{v}</text>
        </g>
      ))}
      <line x1={PL} y1={PT} x2={PL} y2={PT + IH} stroke="#DDDDDD" />
      <line x1={PL} y1={PT + IH} x2={W - PR} y2={PT + IH} stroke="#DDDDDD" />
      {xLabels.map((a, i) => (
        <text key={i} x={xp(a.date)} y={H - 6} textAnchor="middle"
          style={{ fontSize: 9, fill: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
          {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </text>
      ))}
      <path d={linePath} fill="none" stroke={C.orange} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={avgPath}  fill="none" stroke={C.green}  strokeWidth={1.5} strokeDasharray="6 3" strokeLinecap="round" />
      {timeline.map((a, i) => (
        <circle key={i} cx={xp(a.date)} cy={yp(scores[i])} r={3.5}
          fill={C.orange} stroke="white" strokeWidth={1.5} />
      ))}
      <g>
        <line x1={PL + 10} y1={PT + 14} x2={PL + 30} y2={PT + 14} stroke={C.orange} strokeWidth={2} />
        <text x={PL + 35} y={PT + 18} style={{ fontSize: 10, fill: C.textMuted, fontFamily: "'DM Mono', monospace" }}>Score</text>
        <line x1={PL + 85} y1={PT + 14} x2={PL + 105} y2={PT + 14} stroke={C.green} strokeWidth={1.5} strokeDasharray="6 3" />
        <text x={PL + 110} y={PT + 18} style={{ fontSize: 10, fill: C.textMuted, fontFamily: "'DM Mono', monospace" }}>3-pt Moving Avg</text>
      </g>
    </svg>
  );
}

// ─── Expanded row detail ───────────────────────────────────────────────────────

function AttemptDetail({ item }) {
  const isSession = item._type === 'session';
  const comp = item.competency_breakdown ?? {};

  const compRows = isSession
    ? COMPETENCIES.map(c => ({ label: c.label, value: typeof comp[c.sessionKey] === 'number' ? comp[c.sessionKey] : null })).filter(r => r.value != null)
    : COMPETENCIES.filter(c => c.practiceKey).map(c => ({ label: c.label, value: typeof comp[c.practiceKey] === 'number' ? comp[c.practiceKey] : null })).filter(r => r.value != null);

  return (
    <div style={{ padding: '20px 24px', background: '#FAFAFA', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      {/* Competency bars */}
      <div style={{ minWidth: 220 }}>
        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 12, fontWeight: 600 }}>Competency Scores</div>
        {compRows.length === 0 ? (
          <div style={{ fontSize: 11, color: C.textMuted }}>No breakdown available</div>
        ) : compRows.map(({ label, value }) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, color: C.textSoft, fontFamily: "'DM Mono', monospace" }}>{label}</span>
              <span style={{ fontSize: 11, color: compInsightColor(value), fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{value}/10</span>
            </div>
            <div style={{ height: 4, background: C.borderLight, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(value / 10) * 100}%`, height: '100%', background: compInsightColor(value), borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div style={{ flex: 1, minWidth: 220 }}>
        {isSession ? (
          <>
            {item.high_signal_keywords?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Signal Keywords Detected</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.high_signal_keywords.map((kw, i) => (
                    <span key={i} style={{ padding: '2px 8px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, fontSize: 10, color: C.green, fontFamily: "'DM Mono', monospace" }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {item.detected_filler_words?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.red, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Filler Words</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.detected_filler_words.map((w, i) => (
                    <span key={i} style={{ padding: '2px 8px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 10, color: C.red, fontFamily: "'DM Mono', monospace" }}>{w}</span>
                  ))}
                </div>
              </div>
            )}
            {item.alpha_rewrite && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.orange, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Alpha Rewrite</div>
                <div style={{ padding: '12px 16px', background: 'rgba(232,101,10,0.05)', border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.65, maxHeight: 140, overflow: 'auto' }}>
                  {item.alpha_rewrite}
                </div>
              </div>
            )}
            {item.next_drill && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 6, fontWeight: 600 }}>Next Drill</div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: "'DM Mono', monospace", lineHeight: 1.55 }}>{item.next_drill}</div>
              </div>
            )}
          </>
        ) : (
          <>
            {item.user_answer && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Your Answer</div>
                <div style={{ padding: '10px 14px', background: C.borderLight, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.6, maxHeight: 100, overflow: 'auto' }}>
                  {item.user_answer}
                </div>
              </div>
            )}
            {item.feedback_text && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>AI Feedback</div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.65 }}>
                  {item.feedback_text}
                </div>
              </div>
            )}
            {item.strengths?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Strengths</div>
                {item.strengths.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 4, display: 'flex', gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>+</span><span>{s}</span>
                  </div>
                ))}
              </div>
            )}
            {item.weaknesses?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.red, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Areas to Improve</div>
                {item.weaknesses.map((w, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace", marginBottom: 4, display: 'flex', gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>→</span><span>{w}</span>
                  </div>
                ))}
              </div>
            )}
            {item.expert_rewrite && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.orange, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Expert Rewrite</div>
                <div style={{ padding: '12px 16px', background: 'rgba(232,101,10,0.05)', border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 12, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.65, maxHeight: 140, overflow: 'auto' }}>
                  {item.expert_rewrite}
                </div>
              </div>
            )}
            {item.improvement_tips?.length > 0 && (
              <div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 8, fontWeight: 600 }}>Improvement Tips</div>
                {item.improvement_tips.map((t, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.textSoft, fontFamily: "'DM Mono', monospace", marginBottom: 5, lineHeight: 1.5 }}>
                    {i + 1}. {t}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Loading / empty states ────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase' }}>Loading scorecard...</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono', monospace" }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 16 }}>No data yet</div>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, fontFamily: "'Source Serif 4', serif" }}>
          Complete at least one interview session or practice attempt to generate your performance scorecard.
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Scorecard({ user }) {
  const [sessions, setSessions] = useState([]);
  const [practiceAttempts, setPracticeAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const stats = useMemo(() => {
    const sessionScores = sessions.map(s => s.overall_score).filter(v => typeof v === 'number');

    const readiness = sessionScores.length
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0;

    // Per-competency averages (merge sessions + practice)
    const compData = {};
    for (const comp of COMPETENCIES) {
      const vals = [];
      for (const s of sessions) {
        const v = s.competency_breakdown?.[comp.sessionKey];
        if (typeof v === 'number') vals.push(v);
      }
      if (comp.practiceKey) {
        for (const p of practiceAttempts) {
          const v = p.competency_breakdown?.[comp.practiceKey];
          if (typeof v === 'number') vals.push(v);
        }
      }
      compData[comp.label] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    }

    const compEntries = Object.entries(compData).filter(([, v]) => v != null);
    const strongest = compEntries.length ? compEntries.reduce((a, b) => b[1] > a[1] ? b : a) : null;
    const weakest   = compEntries.length ? compEntries.reduce((a, b) => b[1] < a[1] ? b : a) : null;

    const improvRate = sessionScores.length >= 2 ? (() => {
      const first5 = sessionScores.slice(0, 5);
      const last5  = sessionScores.slice(-5);
      const fa = first5.reduce((a, b) => a + b, 0) / first5.length;
      const la = last5.reduce((a, b) => a + b, 0) / last5.length;
      return ((la - fa) / fa * 100).toFixed(1);
    })() : null;

    const sd = sessionScores.length >= 2 ? stdDev(sessionScores).toFixed(1) : null;
    const consistency = sd == null ? 'N/A'
      : parseFloat(sd) < 5  ? 'Very Consistent'
      : parseFloat(sd) < 10 ? 'Consistent'
      : parseFloat(sd) < 15 ? 'Variable'
      : 'Inconsistent';

    const timeline = [
      ...sessions.map(s => ({ date: s.created_at, score: s.overall_score ?? 0 })),
      ...practiceAttempts.map(p => ({ date: p.created_at, score: p.score ?? 0 })),
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    return { readiness, compData, strongest, weakest, improvRate, sd, consistency, timeline };
  }, [sessions, practiceAttempts]);

  const allItems = useMemo(() => {
    const items = [
      ...sessions.map(s => ({
        ...s,
        _type: 'session',
        _score: s.overall_score ?? 0,
        _date: s.created_at,
        _question: `${s.track || 'PM'} Interview`,
        _designation: s.track,
      })),
      ...practiceAttempts.map(p => ({
        ...p,
        _type: 'practice',
        _score: p.score ?? 0,
        _date: p.created_at,
        _question: getQuestionText(p.question_id) ?? `Practice Question`,
        _designation: p.designation,
      })),
    ];

    const filtered = items.filter(item => {
      if (filterType === 'interview' && item._type !== 'session') return false;
      if (filterType === 'practice' && item._type !== 'practice') return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const val = sortBy === 'score' ? a._score - b._score : new Date(a._date) - new Date(b._date);
      return sortDir === 'asc' ? val : -val;
    });
  }, [sessions, practiceAttempts, filterType, sortBy, sortDir]);

  const focusAreas = useMemo(() =>
    Object.entries(stats.compData)
      .filter(([, v]) => v != null)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3),
    [stats]
  );

  if (loading) return <LoadingState />;
  if (sessions.length === 0 && practiceAttempts.length === 0) return <EmptyState />;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingTop: NAV_H, fontFamily: "'DM Mono', monospace" }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 48, paddingBottom: 32, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, letterSpacing: 6, textTransform: 'uppercase', color: C.textMuted, marginBottom: 14 }}>
            Performance Evaluation
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 44, fontWeight: 900, color: C.text,
            lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 14,
          }}>
            Your Performance<br />
            <span style={{ color: C.orange }}>Scorecard</span>
          </h1>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 14 }}>
            A comprehensive evaluation of your PM interview readiness — built from every session and practice attempt.
          </p>
          <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>{user.email}</div>
        </div>

        {/* ── READINESS + INSIGHT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: 24, marginBottom: 48, alignItems: 'start' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '0 16px 24px' }}>
            <div style={{ textAlign: 'center', paddingTop: 20, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted }}>
              PM Readiness Score
            </div>
            <ReadinessMeter
              score={stats.readiness}
              interviewCount={sessions.length}
              practiceCount={practiceAttempts.length}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {stats.strongest && (
              <InsightCard
                title="Strongest Competency"
                icon="◆"
                iconColor={C.green}
                value={stats.strongest[0]}
                sub={`${stats.strongest[1].toFixed(1)} / 10`}
                subColor={C.green}
              />
            )}
            {stats.weakest && (
              <InsightCard
                title="Weakest Competency"
                icon="▼"
                iconColor={C.red}
                value={stats.weakest[0]}
                sub={`${stats.weakest[1].toFixed(1)} / 10 — focus here`}
                subColor={C.red}
                badge="Focus Area"
                badgeColor={C.redLight}
                badgeBorder={C.redBorder}
                badgeText={C.red}
              />
            )}
            <InsightCard
              title="Improvement Rate"
              icon={stats.improvRate != null && parseFloat(stats.improvRate) >= 0 ? '▲' : '▼'}
              iconColor={stats.improvRate != null && parseFloat(stats.improvRate) >= 0 ? C.green : C.red}
              value={stats.improvRate != null ? `${parseFloat(stats.improvRate) >= 0 ? '+' : ''}${stats.improvRate}%` : '—'}
              sub="first 5 vs last 5 sessions"
              subColor={C.textMuted}
            />
            <InsightCard
              title="Consistency"
              icon="≈"
              iconColor={C.orange}
              value={stats.consistency}
              sub={stats.sd != null ? `σ = ${stats.sd} pts` : 'Need 2+ sessions'}
              subColor={C.textMuted}
            />
          </div>
        </div>

        {/* ── COMPETENCY DEEP DIVE ── */}
        <Section
          title="Competency Deep Dive"
          sub="Average scores across all interview sessions and practice attempts"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 32, alignItems: 'start' }}>
            <RadarChart avgComp={stats.compData} />
            <div style={{ paddingTop: 8 }}>
              {COMPETENCIES.map(({ label }) => {
                const v = stats.compData[label];
                if (v == null) return (
                  <div key={label} style={{ marginBottom: 14, opacity: 0.4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{label}</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>No data</span>
                    </div>
                    <div style={{ height: 5, background: C.borderLight, borderRadius: 3 }} />
                  </div>
                );
                const color = compInsightColor(v);
                return (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{v.toFixed(1)}/10</span>
                    </div>
                    <div style={{ height: 5, background: C.borderLight, borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ width: `${(v / 10) * 100}%`, height: '100%', background: color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 10, color, letterSpacing: 0.2 }}>{compInsightText(v)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── PERFORMANCE TIMELINE ── */}
        <Section
          title="Performance Timeline"
          sub="All attempts in chronological order — orange line = score, green dashed = 3-point moving average"
        >
          <PerformanceTimeline timeline={stats.timeline} />
        </Section>

        {/* ── DETAILED ATTEMPT LOG ── */}
        <Section
          title="Detailed Attempt Log"
          sub="Every session and practice attempt — click any row to expand full feedback"
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterSelect
              label="Type"
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: 'all',       label: 'All Types' },
                { value: 'interview', label: 'Interviews only' },
                { value: 'practice',  label: 'Practice only' },
              ]}
            />
            <FilterSelect
              label="Sort"
              value={`${sortBy}-${sortDir}`}
              onChange={v => { const [by, dir] = v.split('-'); setSortBy(by); setSortDir(dir); }}
              options={[
                { value: 'date-desc',  label: 'Newest first' },
                { value: 'date-asc',   label: 'Oldest first' },
                { value: 'score-desc', label: 'Highest score' },
                { value: 'score-asc',  label: 'Lowest score' },
              ]}
            />
            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 'auto' }}>
              {allItems.length} attempt{allItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 100px 130px 72px 36px',
              padding: '10px 20px',
              background: '#F7F7F7',
              borderBottom: `1px solid ${C.border}`,
              fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
              color: C.textMuted, fontWeight: 700,
            }}>
              <span>Date</span>
              <span>Question / Track</span>
              <span>Type</span>
              <span>Designation</span>
              <span>Score</span>
              <span></span>
            </div>

            {allItems.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: C.textMuted, fontSize: 12 }}>
                No attempts match your current filters.
              </div>
            ) : allItems.map((item, idx) => {
              const isExpanded = expandedRows.has(item.id);
              const scoreColor = item._score >= 70 ? C.green : item._score >= 40 ? C.yellow : C.red;
              const isLast = idx === allItems.length - 1;
              return (
                <div key={item.id ?? idx} style={{ borderBottom: isLast ? 'none' : `1px solid ${C.borderLight}` }}>
                  <div
                    onClick={() => setExpandedRows(prev => {
                      const next = new Set(prev);
                      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                      return next;
                    })}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr 100px 130px 72px 36px',
                      padding: '13px 20px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(232,101,10,0.03)' : C.card,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#FAFAFA'; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = C.card; }}
                  >
                    <span style={{ fontSize: 11, color: C.textMuted }}>
                      {new Date(item._date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </span>
                    <span style={{ fontSize: 12, color: C.text, fontFamily: "'Source Serif 4', serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 16 }}>
                      {item._question.length > 90 ? item._question.slice(0, 90) + '…' : item._question}
                    </span>
                    <span>
                      <span style={{
                        padding: '3px 9px', borderRadius: 10, fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
                        background: item._type === 'session' ? C.orangeLight : C.greenLight,
                        border: `1px solid ${item._type === 'session' ? C.orangeBorder : C.greenBorder}`,
                        color: item._type === 'session' ? C.orange : C.green,
                      }}>
                        {item._type === 'session' ? 'Interview' : 'Practice'}
                      </span>
                    </span>
                    <span style={{ fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item._designation || '—'}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: scoreColor, fontFamily: "'Playfair Display', serif" }}>
                      {item._score}
                    </span>
                    <span style={{ fontSize: 11, color: C.textMuted, textAlign: 'right' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                  {isExpanded && <AttemptDetail item={item} />}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── ACTIONABLE RECOMMENDATIONS ── */}
        {focusAreas.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 6 }}>
                Your Top 3 Focus Areas
              </h2>
              <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.2 }}>
                Prioritized by lowest competency scores — address these for maximum score improvement
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {focusAreas.map(([label, score], idx) => {
                const color = compInsightColor(score);
                const target = Math.min(10, Math.ceil(score) + 2).toFixed(1);
                const tips = TIPS[label] || [];
                return (
                  <div key={label} style={{
                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
                    padding: 24, borderTop: `3px solid ${color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
                          Focus #{idx + 1}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text }}>
                          {label}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color, lineHeight: 1 }}>
                          {score.toFixed(1)}
                        </div>
                        <div style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 3 }}>
                          target: {target}/10
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 4, background: C.borderLight, borderRadius: 2, overflow: 'hidden', marginBottom: 20 }}>
                      <div style={{ width: `${(score / 10) * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 12, fontWeight: 600 }}>
                      Action Steps
                    </div>
                    {tips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 13, color: C.textSoft, lineHeight: 1.55, fontFamily: "'Source Serif 4', serif" }}>
                        <span style={{ color, fontWeight: 700, flexShrink: 0, fontFamily: "'DM Mono', monospace", fontSize: 11 }}>{i + 1}.</span>
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
