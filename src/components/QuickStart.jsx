import { useState, useRef, useEffect, useCallback } from 'react';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#0A0A0A', textSoft: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1', borderLight: '#F0EDE8',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  success: '#1A7F37', successLight: 'rgba(27,140,58,0.08)', successBorder: 'rgba(27,140,58,0.2)',
  red: '#CF222E', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
};

const QUESTION = "How would you improve Instagram's Explore page?";

const EXPERT_ANSWER = `I'd start with user intent. The Explore page serves two different jobs: passive discovery ("show me interesting things I don't know I want yet") and active search ("I'm looking for something specific"). These require different designs, and Instagram currently tries to serve both with one layout.

Research questions I'd want answered: What percentage of Explore users have a specific intent vs. passive browsing? What percentage find Explore "useful" vs. "overwhelming"? Where do users who find something they like go next — do they follow the creator, save the post, or just scroll on?

Problems I'd hypothesize: The grid layout optimizes for visual volume, not relevance. The algorithm conflates "popular" with "relevant to you." There's no context — why is this post surfaced?

Design improvements I'd test: Intent fork at entry — two modes: Discover (passive, curated) and Search (active, query-driven). Reduce grid density with topic labels. "Because you follow X" labels to surface recommendation reasons. When a user dwells on a post for 5+ seconds, show related creators to follow — converting passive interest into an active relationship.

Success metric: percentage of Explore sessions that result in a follow or a save, vs. sessions that end with a scroll and no action.`;

// ─── Deduplicate repeated phrases ───
function dedupeTranscript(text) {
  return text
    .trim()
    .replace(/(\b\w+(?:\s+\w+){0,5})\s+(?:\1\s*)+/gi, '$1 ')
    .trim();
}

// ─── Voice hook ───
function useVoiceToText() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const supported  = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isListening, setIsListening]             = useState(false);
  const [transcript, setTranscript]               = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [duration, setDuration]                   = useState(0);
  const [voiceError, setVoiceError]               = useState('');

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  const startChunk = useCallback((onFailure) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onFailure) onFailure(); return; }
    setVoiceError('');
    setIsListening(true);
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach(t => t.stop());
        const r = new SR();
        r.lang           = 'en-US';
        r.continuous     = false;
        r.interimResults = !isAndroid;
        r.maxAlternatives = 1;
        r.onstart = () => {};
        r.onresult = (e) => {
          if (isAndroid) {
            const text = e.results[0][0].transcript.trim();
            if (text) setTranscript(prev => prev + (prev.trim() ? ' ' : '') + text);
          } else {
            let newFinal = '', interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              if (e.results[i].isFinal) newFinal += e.results[i][0].transcript + ' ';
              else interim += e.results[i][0].transcript;
            }
            if (newFinal.trim()) {
              setTranscript(prev => prev + (prev.trim() ? ' ' : '') + newFinal.trim());
            }
            setInterimTranscript(interim);
          }
        };
        r.onerror = (e) => {
          clearInterval(timerRef.current);
          setIsListening(false);
          setInterimTranscript('');
          if (e.error === 'not-allowed') {
            setVoiceError('Microphone access denied. Please allow microphone in browser settings.');
            if (onFailure) onFailure();
          } else if (e.error !== 'no-speech') {
            setVoiceError('Voice input failed. Please type your answer instead.');
            if (onFailure) onFailure();
          }
        };
        r.onend = () => {
          clearInterval(timerRef.current);
          setIsListening(false);
          setInterimTranscript('');
        };
        recognitionRef.current = r;
        try { r.start(); } catch {
          clearInterval(timerRef.current);
          setIsListening(false);
          setVoiceError('Could not start voice input. Please type your answer.');
          if (onFailure) onFailure();
        }
      })
      .catch(() => {
        clearInterval(timerRef.current);
        setIsListening(false);
        setVoiceError('Microphone access denied. Please allow microphone in browser settings.');
        if (onFailure) onFailure();
      });
  }, [isAndroid]);

  const stopListening = useCallback(() => {
    clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const resetVoice = useCallback(() => {
    clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setTranscript('');
    setInterimTranscript('');
    setDuration(0);
    setVoiceError('');
  }, []);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return {
    isListening, transcript, interimTranscript, supported, isAndroid,
    duration, fmt, startChunk, stopListening, resetVoice,
    setTranscript, voiceError,
  };
}

// ─── Mic icon ───
function MicIcon({ active, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={active ? C.red : '#fff'} strokeWidth="2"
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
  const pct   = Math.round((value / max) * 100);
  const color = pct >= 70 ? C.success : pct >= 40 ? C.yellow : C.red;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {label.replace(/_/g, ' ')}
        </span>
        <span style={{ fontSize: 13, color, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}/{max}</span>
      </div>
      <div style={{ height: 5, background: C.bgMuted, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
    </div>
  );
}

// ─── Feedback panel ───
function FeedbackPanel({ result }) {
  const { score, competency_breakdown, strengths, weaknesses,
    filler_words, high_signal_keywords, missing_concepts,
    expert_rewrite, improvement_tips, feedback_text } = result;

  const scoreColor = score >= 70 ? C.success : score >= 40 ? C.yellow : C.red;

  return (
    <div style={{ animation: 'qs-fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
      {/* Score */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>
          Your Score
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: scoreColor, fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/100</span>
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
        <div style={{ padding: '16px 20px', background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Overall Feedback</div>
          <p style={{ fontSize: 13, lineHeight: 1.8, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{feedback_text}</p>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ padding: '14px 16px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Strengths</div>
          {(strengths || []).length > 0
            ? strengths.map((s, i) => <div key={i} style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>· {s}</div>)
            : <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None identified</div>}
        </div>
        <div style={{ padding: '14px 16px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Weaknesses</div>
          {(weaknesses || []).length > 0
            ? weaknesses.map((w, i) => <div key={i} style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.6, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>· {w}</div>)
            : <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None identified</div>}
        </div>
      </div>

      {/* Missing concepts */}
      {(missing_concepts || []).length > 0 && (
        <div style={{ padding: '14px 16px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Missing Concepts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {missing_concepts.map((m, i) => (
              <span key={i} style={{ padding: '3px 10px', background: 'rgba(198,127,0,0.1)', border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 11, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Filler words / High-signal keywords */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>Filler Words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(filler_words || []).length > 0
              ? filler_words.map((w, i) => <span key={i} style={{ padding: '3px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 6, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{w}</span>)
              : <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None — clean</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 8 }}>High-Signal Keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(high_signal_keywords || []).length > 0
              ? high_signal_keywords.map((w, i) => <span key={i} style={{ padding: '3px 10px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 6, fontSize: 12, color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{w}</span>)
              : <span style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None detected</span>}
          </div>
        </div>
      </div>

      {/* Expert rewrite */}
      {expert_rewrite && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Expert Rewrite</div>
          <div style={{ padding: '16px 20px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 16, fontSize: 13, lineHeight: 1.8, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'pre-wrap' }}>
            {expert_rewrite}
          </div>
        </div>
      )}

      {/* Improvement tips */}
      {(improvement_tips || []).length > 0 && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>Improvement Tips</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {improvement_tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, lineHeight: 1.7, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main QuickStart component ───
export default function QuickStart({ onDismiss, onSessionUsed, onExplore }) {
  const [mode, setMode]               = useState('text'); // 'text' | 'voice'
  const [textAnswer, setTextAnswer]   = useState('');
  const [phase, setPhase]             = useState('input'); // 'input' | 'loading' | 'feedback'
  const [result, setResult]           = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [error, setError]             = useState('');

  const voice    = useVoiceToText();
  const voiceText = voice.transcript.trim();

  // Prevent body scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const buildPrompt = (answer) =>
    `You are a world-class PM interview coach evaluating a candidate's answer.

QUESTION:
${QUESTION}

EXPERT REFERENCE ANSWER:
${EXPERT_ANSWER}

CANDIDATE'S ANSWER:
${answer}

Evaluate the candidate's answer against the expert reference. Return ONLY a valid JSON object:
{
  "score": <integer 1-100>,
  "score_delta_hint": null,
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
  "expert_rewrite": "A polished, senior-PM-level version of the candidate's answer",
  "improvement_tips": ["tip 1", "tip 2", "tip 3"],
  "feedback_text": "2-3 sentence overall assessment"
}

Scoring guide — structure: clear logical framework; depth: goes beyond surface with specific reasoning; frameworks: uses PM frameworks (JTBD, RICE, AARRR, etc.); communication: clear and concise; trade_off_awareness: acknowledges trade-offs and what is NOT being done.

Be honest and specific. Return ONLY the JSON, no markdown, no preamble.`;

  const parseSSEChunks = async (res, onChunk) => {
    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '', accumulated = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.type === 'error') throw new Error(parsed.error?.message || 'Stream error');
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            accumulated += parsed.delta.text;
            if (onChunk) onChunk(accumulated);
          }
        } catch (e) {
          if (e.message?.includes('Stream error')) throw e;
        }
      }
    }
    return accumulated;
  };

  const handleSubmit = async () => {
    const answerText = mode === 'voice' ? dedupeTranscript(voiceText) : textAnswer;
    if (!answerText.trim()) return;

    if (onSessionUsed) await onSessionUsed();

    setPhase('loading');
    setError('');
    setAnalysisText('');

    try {
      let raw = '';
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [{ role: 'user', content: buildPrompt(answerText) }],
            stream: true,
          }),
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        raw = await parseSSEChunks(res, (text) => setAnalysisText(text));
      } catch {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [{ role: 'user', content: buildPrompt(answerText) }],
          }),
        });
        const data = await res.json();
        raw = data?.content?.[0]?.text || '';
      }

      raw = raw.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      } catch {
        setError('Could not parse feedback. Please try again.');
        setPhase('input');
        return;
      }

      setAnalysisText('');
      setResult(parsed);
      setPhase('feedback');
    } catch {
      setError('Something went wrong. Please try again.');
      setPhase('input');
    }
  };

  const canSubmitText  = phase === 'input' && mode === 'text' && textAnswer.trim().length > 0;
  const canSubmitVoice = phase === 'input' && mode === 'voice' && voiceText.length > 0 && !voice.isListening;

  return (
    <>
      <style>{`
        @keyframes qs-fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes qs-pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .qs-overlay { position: fixed; inset: 0; z-index: 9000; background: rgba(250,250,248,0.97); overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .qs-inner   { max-width: 640px; margin: 0 auto; padding: 48px 28px 80px; animation: qs-fadeUp 0.4s cubic-bezier(0.22,1,0.36,1); }
        .qs-toggle  { flex: 1; padding: 12px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 1px; border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
        .qs-submit  { width: 100%; height: 54px; border: none; border-radius: 14px; font-size: 16px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.2s; }
        @media (max-width: 480px) { .qs-inner { padding: 32px 16px 64px; } }
      `}</style>

      <div className="qs-overlay">
        <div className="qs-inner">

          {/* Dismiss button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
            <button
              onClick={onDismiss}
              style={{
                background: 'none', border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '6px 14px', fontSize: 13, color: C.textMuted, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Skip ✕
            </button>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif", fontSize: 36, fontWeight: 400,
              color: C.text, lineHeight: 1.2, marginBottom: 10,
            }}>
              Let's see how you'd answer this
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
              No resume required. Just answer like you're in the room.
            </p>
          </div>

          {/* Question card */}
          <div style={{
            background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16,
            padding: '20px 24px', marginBottom: 28,
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10 }}>
              Question
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, fontWeight: 500 }}>
              {QUESTION}
            </p>
          </div>

          {/* Input area — only in 'input' phase */}
          {phase === 'input' && (
            <div style={{ animation: 'qs-fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
              {/* TYPE / VOICE toggle */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button
                  className="qs-toggle"
                  onClick={() => setMode('text')}
                  style={{
                    background: mode === 'text' ? C.green : C.bg,
                    borderColor: mode === 'text' ? C.green : C.border,
                    color: mode === 'text' ? '#fff' : C.textMuted,
                  }}
                >
                  ⌨️ TYPE
                </button>
                {voice.supported && (
                  <button
                    className="qs-toggle"
                    onClick={() => setMode('voice')}
                    style={{
                      background: mode === 'voice' ? C.green : C.bg,
                      borderColor: mode === 'voice' ? C.green : C.border,
                      color: mode === 'voice' ? '#fff' : C.textMuted,
                    }}
                  >
                    🎤 VOICE
                  </button>
                )}
              </div>

              {/* Type mode */}
              {mode === 'text' && (
                <textarea
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={8}
                  style={{
                    width: '100%', padding: '16px 18px',
                    border: `1.5px solid ${C.border}`, borderRadius: 14,
                    fontSize: 15, lineHeight: 1.75, color: C.text,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: C.bg, resize: 'vertical', transition: 'border-color 0.2s',
                    boxSizing: 'border-box', marginBottom: 16,
                  }}
                  onFocus={e => e.target.style.borderColor = C.green}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              )}

              {/* Voice mode */}
              {mode === 'voice' && (
                <div style={{
                  background: C.bg, border: `2px solid ${voice.isListening ? C.green : C.border}`,
                  borderRadius: 16, padding: 22, marginBottom: 16, transition: 'border-color 0.3s',
                }}>
                  {/* Status + timer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {voice.isListening && (
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.red, animation: 'qs-pulse 1s ease-in-out infinite' }} />
                      )}
                      <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: voice.isListening ? C.red : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {voice.isListening ? 'Listening...' : voiceText ? 'Ready to Submit' : 'Voice Input'}
                      </span>
                    </div>
                    {voice.duration > 0 && (
                      <span style={{ fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif", background: C.bgMuted, padding: '3px 10px', borderRadius: 10 }}>
                        {voice.fmt(voice.duration)}
                      </span>
                    )}
                  </div>

                  {/* Transcript area */}
                  <div style={{
                    minHeight: 80, maxHeight: 180, overflow: 'auto',
                    padding: 14, background: C.bgSoft, borderRadius: 12,
                    border: `1px solid ${C.borderLight}`, marginBottom: 14,
                    fontSize: 14, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
                  }}>
                    {voice.transcript || (!voice.interimTranscript && (
                      <span style={{ color: C.textMuted, fontStyle: 'italic' }}>
                        {voice.isListening ? 'Start speaking...' : 'Tap the microphone to begin.'}
                      </span>
                    ))}
                    {voice.interimTranscript && (
                      <span style={{ color: C.textMuted }}>{voice.transcript ? ' ' : ''}{voice.interimTranscript}</span>
                    )}
                  </div>

                  {voice.voiceError && (
                    <div style={{ marginBottom: 12, padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {voice.voiceError}
                    </div>
                  )}

                  {/* Recording controls */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {voice.isListening ? (
                      <button
                        onClick={voice.stopListening}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '11px 24px', background: 'transparent',
                          border: `2px solid ${C.red}`, borderRadius: 12, color: C.red,
                          fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                        }}
                      >
                        <div style={{ width: 10, height: 10, background: C.red, borderRadius: 2 }} />
                        Stop Recording
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => voice.startChunk(() => setMode('text'))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '11px 24px', background: C.green, border: 'none', borderRadius: 12,
                            color: '#fff', fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                          }}
                        >
                          <MicIcon active={false} />
                          {voiceText ? 'Continue Recording' : 'Start Recording'}
                        </button>
                        {voiceText && (
                          <button
                            onClick={voice.resetVoice}
                            style={{
                              padding: '11px 20px', background: 'transparent',
                              border: `1px solid ${C.border}`, borderRadius: 12, color: C.textMuted,
                              fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif",
                              letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                            }}
                          >
                            Re-Record
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {voice.isAndroid && (
                    <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5 }}>
                      Tap mic, speak one sentence, tap again. Repeat for longer answers.
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 12, fontSize: 13, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                className="qs-submit"
                onClick={handleSubmit}
                disabled={!(canSubmitText || canSubmitVoice)}
                style={{
                  background: (canSubmitText || canSubmitVoice) ? C.green : C.bgMuted,
                  color: (canSubmitText || canSubmitVoice) ? '#fff' : C.textMuted,
                  cursor: (canSubmitText || canSubmitVoice) ? 'pointer' : 'not-allowed',
                  boxShadow: (canSubmitText || canSubmitVoice) ? '0 4px 20px rgba(22,163,74,0.3)' : 'none',
                }}
              >
                Get AI Feedback →
              </button>
            </div>
          )}

          {/* Loading phase */}
          {phase === 'loading' && (
            <div style={{ padding: '40px 0', animation: 'qs-fadeUp 0.3s ease', textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: analysisText ? 20 : 0 }}>
                Analyzing your answer...
              </div>
              {analysisText && (
                <div style={{ padding: '16px 20px', background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 16, fontSize: 13, lineHeight: 1.7, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto', textAlign: 'left', marginTop: 16 }}>
                  {analysisText}
                </div>
              )}
            </div>
          )}

          {/* Feedback phase */}
          {phase === 'feedback' && result && (
            <div style={{ animation: 'qs-fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
              <FeedbackPanel result={result} />

              {/* CTA */}
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
                <button
                  onClick={onExplore}
                  style={{
                    width: '100%', height: 54, background: C.green, border: 'none',
                    borderRadius: 14, color: '#fff', fontSize: 16, fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(22,163,74,0.3)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.greenHover}
                  onMouseLeave={e => e.currentTarget.style.background = C.green}
                >
                  Liked it? Explore 1,100+ questions →
                </button>
                <button
                  onClick={onDismiss}
                  style={{
                    marginTop: 12, background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Go back to home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
