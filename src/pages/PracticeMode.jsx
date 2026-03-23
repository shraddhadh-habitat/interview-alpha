import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#1A1A1A', textMuted: '#444444',
  border: '#E5E5E5', borderLight: '#F0F0F0',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
  red: '#D32F2F', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
};

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  * { box-sizing: border-box; }
  textarea:focus { outline: none; }
`;

// ─── Voice hook (mirrored from InterviewAlpha) ───
function useVoiceToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = 'en-US';
      r.onresult = (e) => {
        let final = '', interim = '';
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
          else interim += e.results[i][0].transcript;
        }
        if (final) setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };
      r.onerror = (e) => {
        if (e.error !== 'no-speech') { setIsListening(false); clearInterval(timerRef.current); }
      };
      r.onend = () => { setIsListening(false); setInterimTranscript(''); clearInterval(timerRef.current); };
      recognitionRef.current = r;
    }
    return () => {
      clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript(''); setInterimTranscript(''); setDuration(0);
    try {
      recognitionRef.current.start();
      setIsListening(true);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {}
  }, []);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    clearInterval(timerRef.current);
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return { isListening, transcript, interimTranscript, supported, duration, fmt, startListening, stopListening, setTranscript };
}

// ─── Mic icon ───
function MicIcon({ active, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={active ? C.red : C.orange} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

// ─── Score bar ───
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? C.green : pct >= 40 ? C.yellow : C.red;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: C.textSoft, fontFamily: "'DM Mono', monospace" }}>
          {label.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: 13, color, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 5, background: C.bgMuted, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
    </div>
  );
}

// ─── Feedback panel ───
function FeedbackPanel({ result, attemptNumber }) {
  const { score, score_delta_hint, competency_breakdown, strengths, weaknesses, filler_words,
    high_signal_keywords, missing_concepts, expert_rewrite, improvement_tips, feedback_text } = result;

  const scoreColor = score >= 70 ? C.green : score >= 40 ? C.yellow : C.red;

  return (
    <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>
            Attempt #{attemptNumber} · Feedback
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 56, fontWeight: 700, color: scoreColor, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 14, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>/100</span>
          </div>
          {score_delta_hint && (
            <div style={{ marginTop: 6, fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>
              {score_delta_hint}
            </div>
          )}
        </div>
      </div>

      {/* Competencies */}
      {competency_breakdown && (
        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          {Object.entries(competency_breakdown).map(([k, v]) => (
            <ScoreBar key={k} label={k} value={v} />
          ))}
        </div>
      )}

      {/* Narrative feedback */}
      {feedback_text && (
        <div style={{ padding: '16px 20px', background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Overall Feedback</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: C.textSoft, fontFamily: "'Source Serif 4', serif", margin: 0 }}>{feedback_text}</p>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ padding: '14px 16px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Strengths</div>
          {(strengths || []).length > 0
            ? strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6, marginBottom: 4, fontFamily: "'Source Serif 4', serif" }}>· {s}</div>)
            : <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>None identified</div>}
        </div>
        <div style={{ padding: '14px 16px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.red, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Weaknesses</div>
          {(weaknesses || []).length > 0
            ? weaknesses.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6, marginBottom: 4, fontFamily: "'Source Serif 4', serif" }}>· {w}</div>)
            : <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>None identified</div>}
        </div>
      </div>

      {/* Missing concepts */}
      {(missing_concepts || []).length > 0 && (
        <div style={{ padding: '14px 16px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.yellow, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Missing Concepts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {missing_concepts.map((m, i) => (
              <span key={i} style={{ padding: '3px 10px', background: 'rgba(198,127,0,0.1)', border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 11, color: C.yellow, fontFamily: "'DM Mono', monospace" }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Filler words / Keywords */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.red, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>Filler Words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(filler_words || []).length > 0
              ? filler_words.map((w, i) => <span key={i} style={{ padding: '3px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 4, fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>{w}</span>)
              : <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>None — clean</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>High-Signal Keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(high_signal_keywords || []).length > 0
              ? high_signal_keywords.map((w, i) => <span key={i} style={{ padding: '3px 10px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 4, fontSize: 12, color: C.green, fontFamily: "'DM Mono', monospace" }}>{w}</span>)
              : <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>None detected</span>}
          </div>
        </div>
      </div>

      {/* Expert rewrite */}
      {expert_rewrite && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.orange, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Expert Rewrite</div>
          <div style={{ padding: '16px 20px', background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 10, fontSize: 13, lineHeight: 1.8, color: C.text, fontFamily: "'Source Serif 4', serif", whiteSpace: 'pre-wrap' }}>
            {expert_rewrite}
          </div>
        </div>
      )}

      {/* Improvement tips */}
      {(improvement_tips || []).length > 0 && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Improvement Tips</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {improvement_tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: C.orange, fontFamily: "'DM Mono', monospace", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, lineHeight: 1.7, color: C.textSoft, fontFamily: "'Source Serif 4', serif" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main PracticeMode component ───
export default function PracticeMode({ question, questionId, designation, category, user, onBack, onNextQuestion, profile, checkSession, onSessionUsed }) {
  const [mode, setMode] = useState('text'); // 'text' | 'voice'
  const [textAnswer, setTextAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [prevBestScore, setPrevBestScore] = useState(null);
  const [error, setError] = useState('');
  const [showExpert, setShowExpert] = useState(false);

  const voice = useVoiceToText();

  // Fetch existing attempt count and best score on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from('practice_attempts')
      .select('attempt_number, score')
      .eq('user_id', user.id)
      .eq('question_id', questionId)
      .order('attempt_number', { ascending: false })
      .then(({ data }) => {
        if (data?.length > 0) {
          setAttemptNumber(data[0].attempt_number + 1);
          const best = Math.max(...data.map(d => d.score).filter(Boolean));
          setPrevBestScore(best);
        }
      });
  }, [user, questionId]);

  const buildPrompt = (userAnswer) => `You are a world-class PM interview coach evaluating a candidate's answer.

QUESTION:
${question.q}

EXPERT REFERENCE ANSWER:
${question.a}

CANDIDATE'S ANSWER:
${userAnswer}
${prevBestScore !== null ? `\nPREVIOUS BEST SCORE: ${prevBestScore}/100. In "score_delta_hint", note if this attempt is better, worse, or similar and by how much.\n` : ''}
Evaluate the candidate's answer against the expert reference. Return ONLY a valid JSON object with this exact structure:
{
  "score": <integer 1-100>,
  "score_delta_hint": "e.g. +8 vs your best — structure improved" or null if first attempt,
  "competency_breakdown": {
    "structure": <1-10>,
    "depth": <1-10>,
    "frameworks": <1-10>,
    "communication": <1-10>,
    "trade_off_awareness": <1-10>
  },
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "filler_words": ["word", ...],
  "high_signal_keywords": ["keyword", ...],
  "missing_concepts": ["concept", ...],
  "expert_rewrite": "A polished, senior-PM-level version of what the candidate said",
  "improvement_tips": ["tip 1", "tip 2", "tip 3"],
  "feedback_text": "2-3 sentence overall assessment"
}

Scoring guide:
- structure: Does the answer have a clear, logical framework?
- depth: Does it go beyond surface-level points with specific reasoning?
- frameworks: Does it use relevant PM frameworks (JTBD, RICE, AARRR, STAR, etc.)?
- communication: Is it clear, concise, and well-articulated?
- trade_off_awareness: Does it acknowledge trade-offs and what's NOT being done?

Be honest and specific. Do not pad scores. Return ONLY the JSON, no markdown, no preamble.`;

  const handleSubmit = async (answerText, fromVoice = false) => {
    if (!answerText.trim()) return;

    // ─── Session gate ───
    if (checkSession && !checkSession()) return;
    if (onSessionUsed) await onSessionUsed();

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          messages: [{ role: 'user', content: buildPrompt(answerText) }],
        }),
      });

      const data = await res.json();
      const raw = (data?.content?.[0]?.text || '')
        .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();

      let parsed;
      try {
        // Strip any accidental markdown fences
        const clean = raw.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch {
        setError('Could not parse feedback. Please try again.');
        setLoading(false);
        return;
      }

      setResult(parsed);

      // Save to Supabase
      if (user) {
        await supabase.from('practice_attempts').insert({
          user_id: user.id,
          question_id: questionId,
          designation,
          category,
          attempt_number: attemptNumber,
          user_answer: answerText,
          score: parsed.score,
          competency_breakdown: parsed.competency_breakdown,
          strengths: parsed.strengths,
          weaknesses: parsed.weaknesses,
          filler_words: parsed.filler_words,
          high_signal_keywords: parsed.high_signal_keywords,
          missing_concepts: parsed.missing_concepts,
          expert_rewrite: parsed.expert_rewrite,
          improvement_tips: parsed.improvement_tips,
          feedback_text: parsed.feedback_text,
          from_voice: fromVoice,
        });
        if (prevBestScore === null || parsed.score > prevBestScore) {
          setPrevBestScore(parsed.score);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setTextAnswer('');
    voice.setTranscript('');
    setAttemptNumber(n => n + 1);
  };

  const voiceText = (voice.transcript + voice.interimTranscript).trim();

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'DM Mono', monospace" }}>
      <style>{globalStyles}</style>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 28px' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: C.textMuted, fontSize: 11, letterSpacing: 1.5,
            textTransform: 'uppercase', fontFamily: "'DM Mono', monospace",
            marginBottom: 32, padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.orange}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
        >
          ← Back to Q&A
        </button>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 8 }}>
            {designation} · {category === 'product' ? 'Product' : 'Behavioral'}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 0 }}>
            Practice Mode
          </h2>
        </div>

        {/* Question card */}
        <div style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          marginBottom: 16,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.orange, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Question</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, fontFamily: "'Source Serif 4', serif", margin: 0, fontWeight: 500 }}>
              {question.q}
            </p>
            {attemptNumber > 1 && (
              <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                Attempt #{attemptNumber}
              </div>
            )}
          </div>
          {/* View Expert Answer collapsible */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={() => setShowExpert(v => !v)}
              style={{
                width: '100%', padding: '12px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: showExpert ? C.bgSoft : 'transparent',
                border: 'none', cursor: 'pointer',
                fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                color: C.textMuted, fontFamily: "'DM Mono', monospace",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.orange; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; }}
            >
              <span>View Expert Answer</span>
              <span style={{ fontSize: 14, transition: 'transform 0.2s', display: 'inline-block', transform: showExpert ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
            </button>
            {showExpert && (
              <div style={{
                padding: '0 24px 20px',
                background: C.bgSoft,
                borderTop: `1px solid ${C.border}`,
                animation: 'fadeUp 0.2s ease',
              }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.orange, fontFamily: "'DM Mono', monospace", margin: '16px 0 10px' }}>Expert Answer</div>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: C.textSoft, fontFamily: "'Source Serif 4', serif", margin: 0, whiteSpace: 'pre-wrap' }}>
                  {question.a}
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 16 }} />

        {/* Answer input — only shown before result */}
        {!result && (
          <div style={{ marginBottom: 24, animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['text', 'voice'].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  disabled={m === 'voice' && !voice.supported}
                  style={{
                    padding: '7px 18px',
                    background: mode === m ? C.orange : C.bg,
                    border: `1px solid ${mode === m ? C.orange : C.border}`,
                    borderRadius: 6, fontSize: 11, letterSpacing: 1.5,
                    textTransform: 'uppercase', cursor: m === 'voice' && !voice.supported ? 'not-allowed' : 'pointer',
                    color: mode === m ? '#fff' : C.textMuted,
                    fontFamily: "'DM Mono', monospace", opacity: m === 'voice' && !voice.supported ? 0.4 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {m === 'voice' ? '🎤 Voice' : '⌨ Type'}
                </button>
              ))}
            </div>

            {mode === 'text' ? (
              <>
                <textarea
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here. Structure matters — try to open with a clear framework before diving into details."
                  rows={8}
                  style={{
                    width: '100%', padding: '16px 18px',
                    border: `1px solid ${C.border}`, borderRadius: 10,
                    fontSize: 14, lineHeight: 1.75, color: C.text,
                    fontFamily: "'Source Serif 4', serif",
                    background: C.bg, resize: 'vertical',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = C.orange}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                {(() => {
                  const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length;
                  const ready = wordCount >= 50;
                  const disabled = loading || !ready;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <span style={{ fontSize: 11, color: ready ? C.green : C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                        {wordCount} / 50 words min{!ready && wordCount > 0 ? ` — ${50 - wordCount} more` : ''}
                      </span>
                      <button
                        onClick={() => handleSubmit(textAnswer, false)}
                        disabled={disabled}
                        style={{
                          padding: '12px 32px',
                          background: disabled ? C.bgMuted : C.orange,
                          border: 'none', borderRadius: 8,
                          color: disabled ? C.textMuted : '#fff',
                          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          fontFamily: "'DM Mono', monospace", fontWeight: 500,
                          transition: 'all 0.2s',
                        }}
                      >
                        {loading ? 'Evaluating...' : 'Submit Answer'}
                      </button>
                    </div>
                  );
                })()}
              </>
            ) : (
              /* Voice panel */
              <div style={{
                background: C.bg, border: `2px solid ${voice.isListening ? C.orange : C.border}`,
                borderRadius: 14, padding: 22,
                transition: 'border-color 0.3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {voice.isListening && (
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.red, animation: 'pulse 1s ease-in-out infinite' }} />
                    )}
                    <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: voice.isListening ? C.red : C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                      {voice.isListening ? 'Recording...' : voiceText ? 'Recording Complete' : 'Voice Input'}
                    </span>
                  </div>
                  {voice.isListening && (
                    <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", background: C.bgMuted, padding: '3px 10px', borderRadius: 6 }}>
                      {voice.fmt(voice.duration)}
                    </span>
                  )}
                </div>

                <div style={{
                  minHeight: 80, maxHeight: 160, overflow: 'auto',
                  padding: 14, background: C.bgSoft, borderRadius: 8,
                  border: `1px solid ${C.borderLight}`, marginBottom: 14,
                  fontSize: 14, lineHeight: 1.7, fontFamily: "'Source Serif 4', serif", color: C.text,
                }}>
                  {voiceText || (
                    <span style={{ color: C.textMuted, fontStyle: 'italic' }}>
                      {voice.isListening ? 'Start speaking...' : 'Click the microphone to begin.'}
                    </span>
                  )}
                  {voice.interimTranscript && (
                    <span style={{ color: C.textMuted }}>{voice.transcript ? ' ' : ''}{voice.interimTranscript}</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {!voice.isListening ? (
                    <>
                      <button
                        onClick={voice.startListening}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '11px 24px', background: C.orange, border: 'none', borderRadius: 8,
                          color: '#fff', fontSize: 11, fontFamily: "'DM Mono', monospace",
                          fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                        }}
                      >
                        <MicIcon active={false} /> {voiceText ? 'Re-Record' : 'Start Recording'}
                      </button>
                      {voiceText && (
                        <button
                          onClick={() => handleSubmit(voiceText, true)}
                          disabled={loading}
                          style={{
                            padding: '11px 24px', background: C.green, border: 'none', borderRadius: 8,
                            color: '#fff', fontSize: 11, fontFamily: "'DM Mono', monospace",
                            fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase',
                            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? 'Evaluating...' : 'Submit Answer'}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={voice.stopListening}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '11px 24px',
                        background: 'transparent', border: `2px solid ${C.red}`,
                        borderRadius: 8, color: C.red, fontSize: 11,
                        fontFamily: "'DM Mono', monospace", fontWeight: 500,
                        letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      <div style={{ width: 10, height: 10, background: C.red, borderRadius: 2 }} />
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div style={{ marginTop: 12, padding: '12px 16px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 8, fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 0', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
              Evaluating your answer...
            </div>
          </div>
        )}

        {/* Feedback result */}
        {result && !loading && (
          <>
            <FeedbackPanel result={result} attemptNumber={attemptNumber - 1 || 1} />
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button
                onClick={handleTryAgain}
                style={{
                  flex: 1, minWidth: 140, padding: '13px 0',
                  background: C.orange, border: 'none', borderRadius: 8,
                  color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontWeight: 500,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
                onMouseLeave={e => e.currentTarget.style.background = C.orange}
              >
                Try Again (#{attemptNumber})
              </button>
              {onNextQuestion && (
                <button
                  onClick={onNextQuestion}
                  style={{
                    flex: 1, minWidth: 140, padding: '13px 0',
                    background: 'transparent', border: `1px solid ${C.orange}`, borderRadius: 8,
                    color: C.orange, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.orangeLight; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Next Question →
                </button>
              )}
              <button
                onClick={onBack}
                style={{
                  flex: 1, minWidth: 140, padding: '13px 0',
                  background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8,
                  color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                ← Back to Q&A
              </button>
            </div>
          </>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
