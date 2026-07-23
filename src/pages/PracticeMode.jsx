import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import useTextToSpeech from '../hooks/useTextToSpeech';
import { useAuth } from '../contexts/AuthContext';
import FormattedAnswer from '../components/FormattedAnswer';
import { formatLabeledText } from '../lib/formatText';
import posthog from '../lib/analytics';
import PaywallModal from '../components/PaywallModal';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#1B1B18', textSoft: '#1B1B18', textMuted: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)', borderLight: 'rgba(27, 27, 24, 0.08)',
  green: '#1B1B18', greenHover: '#0A0A0A',
  greenLight: 'rgba(27, 27, 24, 0.08)', greenBorder: 'rgba(27, 27, 24, 0.12)',
  success: '#FDCD34', successLight: 'rgba(253, 205, 52, 0.12)', successBorder: 'rgba(253, 205, 52, 0.2)',
  red: '#1B1B18', redLight: 'rgba(27, 27, 24, 0.08)', redBorder: 'rgba(27, 27, 24, 0.12)',
  yellow: '#FDCD34', yellowLight: 'rgba(253, 205, 52, 0.12)', yellowBorder: 'rgba(253, 205, 52, 0.2)',
};


const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  * { box-sizing: border-box; }
  textarea:focus { outline: none; }
  @media (max-width: 480px) {
    .pm-container { padding: 20px 16px 40px !important; }
    .pm-answer-textarea { font-size: 16px !important; }
  }
`;

// ─── Deduplicate repeated phrases in transcript (run before submit) ───
function dedupeTranscript(text) {
  return text
    .trim()
    .replace(/(\b\w+(?:\s+\w+){0,5})\s+(?:\1\s*)+/gi, '$1 ')
    .trim();
}

// ─── Voice hook ───
// Creates a fresh SpeechRecognition instance on every tap (not in useEffect).
// This avoids the Android Chrome bug where a reused instance fires onend
// immediately and silently after the first use.
function useVoiceToText() {
  const isAndroid = /Android/i.test(navigator.userAgent);
  // SpeechRecognition doesn't exist on iOS Safari at all  -  hide Voice tab there
  const supported  = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isListening, setIsListening]             = useState(false);
  const [transcript, setTranscript]               = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [duration, setDuration]                   = useState(0);
  const [voiceError, setVoiceError]               = useState('');

  const recognitionRef = useRef(null);
  const timerRef       = useRef(null);
  const shouldRestartRef = useRef(false);

  // Clean up on unmount only
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      clearInterval(timerRef.current);
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  // Internal: creates and starts a recognition instance (shared by startChunk and restart)
  const createAndStartRecognition = useCallback((onFailure, isRestart = false) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onFailure) onFailure(); return; }

    const r = new SR();
    r.lang             = 'en-US';
    r.continuous       = false;      // MUST be false  -  true crashes Android Chrome
    r.interimResults   = !isAndroid; // false on Android (true causes duplicate delivery)
    r.maxAlternatives  = 1;

    r.onstart = () => console.log('[Voice] Recognition started');

    r.onresult = (e) => {
      console.log('[Voice] onresult  -  resultIndex:', e.resultIndex, 'total:', e.results.length);
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
      console.error('[Voice] onerror code:', e.error, '| shouldRestart before:', shouldRestartRef.current);
      console.error('[Voice] onerror:', e.error);

      const fatalErrors = ['not-allowed', 'service-not-allowed', 'aborted'];
      if (fatalErrors.includes(e.error)) {
        shouldRestartRef.current = false;
        clearInterval(timerRef.current);
        setIsListening(false);
        setInterimTranscript('');
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setVoiceError('Microphone access denied. Please allow microphone in browser settings.');
          if (onFailure) onFailure();
        }
      }
      // For non-fatal errors (no-speech, audio-capture, network), do nothing
      // onend will fire next and auto-restart will handle it
    };

    r.onend = () => {
      console.log('[Voice] onend - shouldRestart:', shouldRestartRef.current);

      if (shouldRestartRef.current) {
        console.log('[Voice] Auto-restarting recognition...');
        // Restart immediately - skip getUserMedia, just create new recognition
        createAndStartRecognition(null, true);
      } else {
        setIsListening(false);
        setInterimTranscript('');
      }
    };

    recognitionRef.current = r;
    try {
      if (!isRestart) {
        // Only start the timer on initial start, not on auto-restart
        timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      }
      r.start();
      console.log('[Voice] start() called');
    } catch (err) {
      console.error('[Voice] start() threw:', err);
      clearInterval(timerRef.current);
      setIsListening(false);
      setVoiceError('Could not start voice input. Please type your answer.');
      if (onFailure) onFailure();
    }
  }, [isAndroid]);

  // startChunk: creates a NEW recognition instance and records one chunk.
  // Appends the result to the existing transcript (chunk-based approach).
  // Call this for both "Start Recording" and "Continue Recording".
  // onFailure: optional callback (e.g. () => setMode('text')) on hard failure.
  const startChunk = useCallback((onFailure) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { if (onFailure) onFailure(); return; }

    console.log('[Voice] Recognition starting...');
    setVoiceError('');
    shouldRestartRef.current = true; // User is recording - enable auto-restart on pause
    setIsListening(true);

    // Try to start recognition immediately (fast path - permission already granted)
    createAndStartRecognition(
      // onFailure callback: if immediate start fails, request permission and retry
      () => {
        console.log('[Voice] Immediate start failed, requesting getUserMedia permission...');
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            stream.getTracks().forEach(t => t.stop());
            // Retry recognition with permission granted
            createAndStartRecognition(onFailure, false);
          })
          .catch((err) => {
            console.error('[Voice] getUserMedia denied:', err);
            clearInterval(timerRef.current);
            setIsListening(false);
            setVoiceError('Microphone access denied. Please allow microphone in browser settings and try again.');
            if (onFailure) onFailure();
          });
      },
      false
    );
  }, [createAndStartRecognition]);

  const stopListening = useCallback(() => {
    console.log('[Voice] stopListening called');
    shouldRestartRef.current = false; // User manually stopped - do not auto-restart
    clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // resetVoice: full reset (called by Re-Record)
  const resetVoice = useCallback(() => {
    shouldRestartRef.current = false;
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
    setTranscript, voiceError, setVoiceError,
  };
}

// ─── Mic icon ───
function MicIcon({ active, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={active ? C.red : C.green} strokeWidth="2"
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 140 }}>
        {label.replace(/_/g, ' ')}
      </span>
      <div style={{ flex: 1, height: 8, background: '#F5F3EF', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FDCD34)',
          borderRadius: 4,
          transition: 'width 1.2s cubic-bezier(0.22,1,0.36,1)'
        }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 40, textAlign: 'right' }}>{value}/{max}</span>
    </div>
  );
}

// ─── Feedback panel ───
function FeedbackPanel({ result, attemptNumber, questionId, user, onNextQuestion }) {
  const { score, score_delta_hint, competency_breakdown, strengths, weaknesses, filler_words,
    high_signal_keywords, missing_concepts, expert_rewrite, improvement_tips, feedback_text } = result;

  const tts = useTextToSpeech();
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);

  // Fire score_shown analytics event once per attempt
  const firedAttemptsRef = useRef(new Set());
  useEffect(() => {
    if (!firedAttemptsRef.current.has(attemptNumber)) {
      firedAttemptsRef.current.add(attemptNumber);
      posthog.capture('score_shown', {
        score,
        is_authenticated: !!user,
      });
    }
  }, [attemptNumber, score, result, user]);

  const handleSpeakFeedback = () => {
    if (tts.isSpeaking) {
      tts.stop();
      setIsSpeakingFeedback(false);
    } else {
      // Build full results text to read
      const parts = [];
      if (feedback_text) parts.push(feedback_text);
      if (strengths?.length) parts.push('Strengths. ' + strengths.join('. '));
      if (weaknesses?.length) parts.push('What to Improve. ' + weaknesses.join('. '));
      if (improvement_tips?.length) parts.push('Improvement Tips. ' + improvement_tips.join('. '));
      if (expert_rewrite) parts.push('Expert Rewrite. How a senior professional would answer this. ' + expert_rewrite);
      const fullText = parts.join('. ');
      tts.speak(fullText);
      setIsSpeakingFeedback(true);
    }
  };

  useEffect(() => {
    if (!tts.isSpeaking) {
      setIsSpeakingFeedback(false);
    }
  }, [tts.isSpeaking]);

  // Normalize score to 0-10 scale for display
  const displayScore = (score / 10).toFixed(1);

  return (
    <div style={{ animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
      {/* Score block card - hero section */}
      <div style={{
        background: '#FFFFFF',
        border: `1px solid #E8E6E1`,
        borderRadius: 16,
        padding: '32px',
        marginBottom: 40,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(27,27,24,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 24, fontWeight: 700 }}>
              Attempt #{attemptNumber} · Feedback
            </div>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              {/* SVG Gradient Ring */}
              <svg width="140" height="140" style={{ position: 'absolute', top: -20, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="25%" stopColor="#A78BFA" />
                    <stop offset="50%" stopColor="#60A5FA" />
                    <stop offset="75%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#FDCD34" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r="65" fill="none" stroke="url(#scoreGradient)" strokeWidth="3" />
              </svg>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 48, fontWeight: 700, color: '#1B1B18', fontFamily: "'Instrument Serif', serif", lineHeight: 1 }}>
                  {displayScore}
                </span>
                <span style={{ fontSize: 20, color: 'rgba(27,27,24,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>/10</span>
              </div>
            </div>
            {score_delta_hint && (
              <div style={{ fontSize: 13, color: 'rgba(27,27,24,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5, fontWeight: 500 }}>
                {score_delta_hint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Competencies */}
      {competency_breakdown && (
        <div style={{
          background: '#FFFFFF',
          border: `1px solid #E8E6E1`,
          borderRadius: 16,
          padding: '32px',
          marginBottom: 40,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'grid', gap: 20 }}>
            {Object.entries(competency_breakdown).map(([k, v]) => (
              <ScoreBar key={k} label={k} value={v} />
            ))}
          </div>
        </div>
      )}

      {/* Narrative feedback */}
      {feedback_text && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 16, letterSpacing: 0, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span style={{ color: '#22C55E', marginRight: 8 }}>●</span>
              What Worked
            </div>
            {tts.isSupported && (
              <button
                onClick={handleSpeakFeedback}
                title={isSpeakingFeedback ? "Stop listening" : "Listen to feedback"}
                className="listen-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399, #FDCD34)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                  height: 40,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isSpeakingFeedback ? '■ Stop' : '▶ Listen'}
              </button>
            )}
          </div>
          <div style={{
            padding: '24px',
            background: '#FFFFFF',
            border: `1px solid #E8E6E1`,
            borderRadius: 16,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, lineHeight: 1.75, color: '#1B1B18', fontWeight: 400 }}>
              <FormattedAnswer text={feedback_text} />
            </div>
          </div>
        </div>
      )}

      {/* Strengths / Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
        <div style={{
          background: '#FFFFFF',
          border: `1px solid #E8E6E1`,
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
            <span style={{ color: '#22C55E', marginRight: 8 }}>●</span>
            Strengths
          </div>
          {(strengths || []).length > 0
            ? strengths.map((s, i) => <div key={i} style={{ fontSize: 15, color: '#1B1B18', lineHeight: 1.75, marginBottom: 8, marginLeft: 16, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>✓ {s}</div>)
            : <div style={{ fontSize: 15, color: 'rgba(27,27,24,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None identified</div>}
        </div>
        <div style={{
          background: '#FFFFFF',
          border: `1px solid #E8E6E1`,
          borderRadius: 16,
          padding: '24px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
            <span style={{ color: '#F59E0B', marginRight: 8 }}>●</span>
            What to Improve
          </div>
          {(weaknesses || []).length > 0
            ? weaknesses.map((w, i) => <div key={i} style={{ fontSize: 15, color: '#1B1B18', lineHeight: 1.75, marginBottom: 8, marginLeft: 16, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>● {w}</div>)
            : <div style={{ fontSize: 15, color: 'rgba(27,27,24,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>None identified</div>}
        </div>
      </div>

      {/* Expert rewrite */}
      {expert_rewrite && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12 }}>
            <span style={{ color: '#60A5FA', marginRight: 8 }}>●</span>
            Expert Rewrite
          </div>
          <div style={{ fontSize: 12, color: 'rgba(27,27,24,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 12, fontWeight: 700 }}>
            How a senior professional would answer this
          </div>
          <div style={{
            background: '#F5F3EF',
            border: `1px solid #E8E6E1`,
            borderRadius: 12,
            padding: '20px',
            whiteSpace: 'pre-wrap',
            fontSize: 15,
            lineHeight: 1.75,
            color: '#1B1B18',
            fontFamily: "'Plus Jakarta Sans', sans-serif"
          }}>
            {expert_rewrite}
          </div>
        </div>
      )}

      {/* Improvement tips */}
      {(improvement_tips || []).length > 0 && (
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>
            Quick Wins
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {improvement_tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#22C55E', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, marginTop: 1, flexShrink: 0, fontWeight: 600 }}>●</span>
                <span style={{ fontSize: 15, lineHeight: 1.75, color: '#1B1B18', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── DIAGNOSTIC DETAILS (Visual Weight: 30%) ─── */}

      {/* Missing concepts */}
      {(missing_concepts || []).length > 0 && (
        <div style={{ padding: '12px 14px', background: '#FCFCFC', border: `1px solid #E5E7EB`, borderRadius: 12, marginBottom: 12, opacity: 0.65 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6, fontWeight: 700 }}>Missing Concepts</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {missing_concepts.map((m, i) => (
              <span key={i} style={{ padding: '4px 10px', background: '#f59e0b', border: 'none', borderRadius: 12, fontSize: 11, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Filler words / Keywords - minimal diagnostic details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, opacity: 0.55 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4, fontWeight: 700 }}>Filler Words</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {(filler_words || []).length > 0
              ? filler_words.map((w, i) => <span key={i} style={{ padding: '3px 8px', background: '#fee2e2', border: 'none', borderRadius: 4, fontSize: 10, color: '#dc2626', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{w}</span>)
              : <span style={{ fontSize: 9, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>—</span>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4, fontWeight: 700 }}>High-Signal Keywords</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {(high_signal_keywords || []).length > 0
              ? high_signal_keywords.map((w, i) => <span key={i} style={{ padding: '3px 8px', background: '#dcfce7', border: 'none', borderRadius: 4, fontSize: 10, color: '#16a34a', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{w}</span>)
              : <span style={{ fontSize: 9, color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>—</span>}
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Main PracticeMode component ───
export default function PracticeMode({ question, questionId, designation, category, subcategory, user, onBack, onNextQuestion, profile, checkSession, onSessionUsed }) {
  console.log('[PracticeMode] Component render - URL:', window.location.href);

  const [mode, setMode] = useState('text'); // 'text' | 'voice'
  const [textAnswer, setTextAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [result, setResult] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [prevBestScore, setPrevBestScore] = useState(null);
  const [error, setError] = useState('');
  const [showExpert, setShowExpert] = useState(false);
  const [resolvedUser, setResolvedUser] = useState(null);
  const [restoredQuestion, setRestoredQuestion] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const voice = useVoiceToText();
  const { requireAuth } = useAuth();

  // Use resolved user if prop user is undefined (handles async hydration delay)
  const authenticatedUser = user || resolvedUser;

  const getLoadingMessages = () => {
    const sub = (subcategory || '').toLowerCase();
    const cat = (category || '').toLowerCase();

    if (cat === 'behavioral' || sub === 'behavioral') return [
      'Evaluating your storytelling and clarity...',
      'Analysing your situation, action, and outcome...',
      'Checking depth of self-awareness and impact...',
      'Almost ready...',
    ];
    if (sub === 'product_design') return [
      'Evaluating your user empathy and problem framing...',
      'Analysing your solution structure and trade-offs...',
      'Checking depth of product thinking...',
      'Almost ready...',
    ];
    if (sub === 'product_strategy') return [
      'Evaluating your market understanding and vision...',
      'Analysing your strategic trade-offs and prioritisation...',
      'Checking depth of business thinking...',
      'Almost ready...',
    ];
    if (sub === 'product_metrics' || sub === 'product_growth' || sub === 'product_retention') return [
      'Evaluating your metric selection and north star...',
      'Analysing your diagnostic and segmentation approach...',
      'Checking depth of data-driven thinking...',
      'Almost ready...',
    ];
    if (sub === 'analytical' || sub === 'case_studies') return [
      'Evaluating your assumption clarity and structure...',
      'Analysing your decomposition and reasoning approach...',
      'Checking depth of analytical thinking...',
      'Almost ready...',
    ];
    if (sub === 'sql_data' || sub === 'python' || sub === 'statistics' || sub === 'machine_learning') return [
      'Evaluating your technical reasoning and approach...',
      'Analysing your methodology and solution logic...',
      'Checking depth of technical thinking...',
      'Almost ready...',
    ];
    if (sub === 'system_design') return [
      'Evaluating your system structure and scalability thinking...',
      'Analysing your trade-offs and architecture approach...',
      'Checking depth of technical design thinking...',
      'Almost ready...',
    ];
    if (sub === 'case_interview' || sub === 'case_study') return [
      'Evaluating your case structure and hypothesis...',
      'Analysing your MECE framework and quantitative reasoning...',
      'Checking depth of strategic thinking...',
      'Almost ready...',
    ];
    if (sub === 'situational') return [
      'Evaluating your situational judgement and clarity...',
      'Analysing your decision-making approach...',
      'Checking depth of leadership thinking...',
      'Almost ready...',
    ];
    if (sub === 'leadership') return [
      'Evaluating your leadership framing and clarity...',
      'Analysing your people and stakeholder approach...',
      'Checking depth of management thinking...',
      'Almost ready...',
    ];
    if (sub === 'ux_writing') return [
      'Evaluating your user empathy and copy clarity...',
      'Analysing your tone, brevity, and audience awareness...',
      'Checking depth of UX communication thinking...',
      'Almost ready...',
    ];
    if (sub === 'technical_docs') return [
      'Evaluating your document structure and technical accuracy...',
      'Analysing your clarity and information architecture...',
      'Checking depth of documentation thinking...',
      'Almost ready...',
    ];
    if (sub === 'ai_content') return [
      'Evaluating your AI content approach and clarity...',
      'Analysing your prompt and output quality thinking...',
      'Checking depth of AI communication approach...',
      'Almost ready...',
    ];
    if (sub === 'content_strategy') return [
      'Evaluating your content structure and strategic thinking...',
      'Analysing your audience and channel approach...',
      'Checking depth of content planning...',
      'Almost ready...',
    ];
    return [
      'Evaluating your structure and clarity...',
      'Analysing your problem-solving approach...',
      'Checking depth of thinking and reasoning...',
      'Almost ready...',
    ];
  };

  useEffect(() => {
    if (!loading) {
      setLoadingMsgIndex(0);
      return;
    }
    const msgs = getLoadingMessages();
    const interval = setInterval(() => {
      setLoadingMsgIndex(prev => prev >= msgs.length - 1 ? prev : prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'star-bounce-pa-styles';
    style.textContent = `
      @keyframes starBouncePA {
        0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
        50% { transform: translateY(-12px) scale(1.2); opacity: 1; }
      }
      .star-pa-0 { animation: starBouncePA 1.4s ease-in-out 0s infinite; }
      .star-pa-1 { animation: starBouncePA 1.4s ease-in-out 0.2s infinite; }
      .star-pa-2 { animation: starBouncePA 1.4s ease-in-out 0.4s infinite; }
      .star-pa-3 { animation: starBouncePA 1.4s ease-in-out 0.6s infinite; }
      .star-pa-4 { animation: starBouncePA 1.4s ease-in-out 0.8s infinite; }
    `;
    if (!document.getElementById('star-bounce-pa-styles')) {
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById('star-bounce-pa-styles');
      if (existing) existing.remove();
    };
  }, []);

  // Restore score from pending_scores if redirected after email verification
  useEffect(() => {
    console.log('[Restore] useEffect fired, URL:', window.location.href);
    const params = new URLSearchParams(window.location.search);
    const scoreToken = params.get('score_token');
    console.log('[PracticeMode] Mount - score_token from URL:', scoreToken);

    if (scoreToken) {
      (async () => {
        try {
          console.log('[PracticeMode] Fetching pending_scores for token:', scoreToken);
          const { data, error } = await supabase
            .from('pending_scores')
            .select('*')
            .eq('session_token', scoreToken)
            .single();

          if (error) {
            console.error('[PracticeMode] Failed to fetch from pending_scores:', error);
            return;
          }

          if (data) {
            console.log('[PracticeMode] Successfully restored score from pending_scores:', scoreToken);
            setResult(data.score_data);
            setRestoredQuestion(data.question_text);
            setLoading(false);

            // Delete the row from pending_scores
            const { error: deleteError } = await supabase
              .from('pending_scores')
              .delete()
              .eq('session_token', scoreToken);

            if (deleteError) {
              console.error('[PracticeMode] Failed to delete pending_scores:', deleteError);
            } else {
              console.log('[PracticeMode] Deleted pending_scores row');
            }

            // Clear localStorage
            localStorage.removeItem('ia:score_token');
            console.log('[PracticeMode] Cleared localStorage ia:score_token');

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('[PracticeMode] Failed to restore score:', err);
        }
      })();
    }
  }, [authenticatedUser]);

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
  "score_delta_hint": "e.g. +8 vs your best  -  structure improved" or null if first attempt,
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
    const sessionCheckResult = checkSession ? checkSession() : null;
    console.log('[Submit] checkSession result:', sessionCheckResult);
    console.log('[Submit] user:', user?.id);
    console.log('[Submit] answerText length:', answerText?.length);

    if (checkSession && !sessionCheckResult) return;
    if (onSessionUsed) await onSessionUsed();

    // ─── Paywall gate ───
    // Check if user is free and has used all free sessions
    if (user) {
      const isAdmin = user.email === 'shraddhadh@gmail.com' || user.email === 'vaishnavi.kulkarni2012@gmail.com';
      const isPaid = profile?.subscription_status === 'active';
      const freeSessionsUsed = profile?.free_sessions_used || 0;

      if (!isAdmin && !isPaid && freeSessionsUsed >= 3) {
        console.log('[Paywall] User hit free session limit:', freeSessionsUsed);
        posthog.capture('paywall_shown', {
          free_sessions_used: freeSessionsUsed,
        });
        setShowPaywall(true);
        return;
      }
    }

    setLoading(true);
    setError('');
    setResult(null);
    setAnalysisText('');

    const parseSSEChunks = async (res, onChunk) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';
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
            if (e.message && e.message.includes('Stream error')) throw e;
          }
        }
      }
      return accumulated;
    };

    try {
      let raw = '';
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1500,
            messages: [{ role: 'user', content: buildPrompt(answerText) }],
            stream: true,
          }),
        });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        raw = await parseSSEChunks(res, (text) => setAnalysisText(text));
      } catch {
        // Fallback non-streaming
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
        raw = (data?.content?.[0]?.text || '');
      }

      raw = raw.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();

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

      setAnalysisText('');
      setResult(parsed);

      // Save score to pending_scores table for unauthenticated users
      if (!user) {
        try {
          const scoreToken = crypto.randomUUID();
          console.log('[Score] Generated token:', scoreToken);
          localStorage.setItem('ia:score_token', scoreToken);
          console.log('[Score] Saved token to localStorage');

          const { error } = await supabase.from('pending_scores').insert({
            session_token: scoreToken,
            question_id: questionId,
            question_text: question.q,
            user_answer: textAnswer || transcript,
            score_data: parsed
          });

          if (error) {
            console.error('[Score] Supabase insert error:', error);
          } else {
            console.log('[Score] Successfully saved to pending_scores with token:', scoreToken);
          }
        } catch (err) {
          console.error('[Score] Failed to save to pending_scores:', err);
        }
      }

      // Resolve authenticated user from session if prop user is undefined
      let authUser = user;
      if (!authUser) {
        try {
          const { data: { user: sessionUser } } = await supabase.auth.getUser();
          if (sessionUser) {
            authUser = sessionUser;
            setResolvedUser(sessionUser);
          }
        } catch (err) {
          console.error('[Submit] Failed to resolve user from session:', err);
        }
      }


      // Save to Supabase
      if (authUser) {
        try {
          const { error: insertError } = await supabase.from('practice_attempts').insert({
            user_id: authUser.id,
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
            created_at: new Date().toISOString(),
          });
          if (insertError) console.error('[PracticeMode] practice_attempts insert error:', insertError);
          else console.log('[PracticeMode] practice_attempts saved successfully');
        } catch (e) {
          console.error('[PracticeMode] practice_attempts exception:', e);
        }

        // Increment free_sessions_used in profiles
        const { data: freshProfile } = await supabase
          .from('profiles')
          .select('free_sessions_used, monthly_sessions_used, subscription_status')
          .eq('id', authUser.id)
          .single();

        if (!freshProfile?.subscription_status || freshProfile?.subscription_status === 'free') {
          const newCount = (freshProfile?.free_sessions_used || 0) + 1;
          const { error } = await supabase
            .from('profiles')
            .update({ free_sessions_used: newCount })
            .eq('id', authUser.id);
          if (error) console.error('Session count update failed:', error);
        }

        // Increment monthly_sessions_used for active/paid subscribers
        if (freshProfile?.subscription_status === 'active') {
          const newMonthlyCount = (freshProfile?.monthly_sessions_used || 0) + 1;
          const { error: monthlyError } = await supabase
            .from('profiles')
            .update({ monthly_sessions_used: newMonthlyCount })
            .eq('id', authUser.id);
          if (monthlyError) console.error('Monthly session count update failed:', monthlyError);
        }

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
    voice.resetVoice();
    setAttemptNumber(n => n + 1);
  };

  // Only final transcript for submit/button logic.
  // Interim is shown separately as a live preview (not appended to final).
  const voiceText = voice.transcript.trim();

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{globalStyles}</style>

      <div className="pm-container" style={{ maxWidth: 760, margin: '0 auto', padding: '40px 28px' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: C.textMuted, fontSize: 11, letterSpacing: 1.5,
            textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            marginBottom: 32, padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.green}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
        >
          Back to Q&A
        </button>

        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 8, fontWeight: 700 }}>
            {designation} · {category === 'product' ? 'Product' : 'Behavioral'}
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, fontWeight: 700, color: C.text, marginBottom: 0 }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Question</div>
              {onNextQuestion && (
                <button
                  onClick={onNextQuestion}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7c3aed',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: 1,
                    padding: 0,
                  }}
                >
                  Skip Question
                </button>
              )}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, fontWeight: 500 }}>
              {restoredQuestion || question.q}
            </p>
            {attemptNumber > 1 && (
              <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                Attempt #{attemptNumber}
              </div>
            )}
          </div>
          {/* View Expert Answer collapsible - only for logged-in users */}
          {user && (
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => setShowExpert(v => !v)}
                style={{
                  width: '100%', padding: '12px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: showExpert ? C.bgSoft : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.green; }}
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
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '16px 0 10px' }}>Expert Answer</div>
                  <p style={{ fontSize: 13, lineHeight: 1.8, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, whiteSpace: 'pre-wrap' }}>
                    {question.a}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }} />

        {/* Answer input  -  only shown before result */}
        {!result && (
          <div style={{ marginBottom: 24, animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Mode toggle  -  Voice tab hidden on iOS Safari (no SpeechRecognition) */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['text', ...(voice.supported ? ['voice'] : [])]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '7px 18px',
                    background: mode === m ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)' : C.bg,
                    border: `1px solid ${mode === m ? 'transparent' : C.border}`,
                    borderRadius: 50, fontSize: 11, letterSpacing: 1.5,
                    textTransform: 'uppercase', cursor: 'pointer',
                    color: mode === m ? '#fff' : C.textMuted,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
                  className="pm-answer-textarea"
                  value={textAnswer}
                  onChange={e => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here. Structure matters. Try to open with a clear framework before diving into details."
                  rows={8}
                  style={{
                    width: '100%', padding: '16px 18px',
                    border: `1px solid ${C.border}`, borderRadius: 12,
                    fontSize: 14, lineHeight: 1.75, color: C.text,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    background: C.bg, resize: 'vertical',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = C.green}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                {(() => {
                  const wordCount = textAnswer.trim().split(/\s+/).filter(Boolean).length;
                  const ready = wordCount >= 50;
                  const disabled = loading || !ready;
                  const freeSessionsUsed = user ? (profile?.free_sessions_used || 0) : 0;
                  const isAdmin = user && (user.email === 'shraddhadh@gmail.com' || user.email === 'vaishnavi.kulkarni2012@gmail.com');
                  const isPaid = user && profile?.subscription_status === 'active';
                  const showSessionCounter = user && !isAdmin && !isPaid;

                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                        {wordCount > 0 && wordCount < 50 && (
                          <span style={{ fontSize: 11, color: ready ? C.success : C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {wordCount} / 50 words min{!ready && wordCount > 0 ? `  -  ${50 - wordCount} more` : ''}
                          </span>
                        )}
                        <button
                          onClick={() => handleSubmit(textAnswer, false)}
                          disabled={disabled}
                          style={{
                            padding: '12px 32px',
                            background: disabled ? C.bgMuted : 'linear-gradient(135deg, #a78bfa, #c084fc)',
                            border: 'none',
                            borderRadius: 50,
                            color: disabled ? C.textMuted : '#fff',
                            fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: loading ? 700 : 600,
                            transition: 'all 0.2s',
                          }}
                        >
                          {loading ? <span style={{ fontWeight: 700 }}>Submitting...</span> : 'Submit Answer'}
                        </button>
                      </div>
                      {showSessionCounter && (
                        <div style={{ marginTop: 8, fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {freeSessionsUsed} of 3 free sessions used
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              /* Voice panel */
              <div style={{
                background: C.bg, border: `2px solid ${voice.isListening ? C.green : C.border}`,
                borderRadius: 16, padding: 22, transition: 'border-color 0.3s',
              }}>
                {/* Header: status + timer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {voice.isListening && (
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.red, animation: 'pulse 1s ease-in-out infinite' }} />
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

                {/* Transcript display */}
                <div style={{
                  minHeight: 80, maxHeight: 180, overflow: 'auto',
                  padding: 14, background: C.bgSoft, borderRadius: 12,
                  border: `1px solid ${C.borderLight}`, marginBottom: 14,
                  fontSize: 14, lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text,
                }}>
                  {voice.transcript || (!voice.interimTranscript && (
                    <span style={{ color: C.textMuted, fontStyle: 'italic' }}>
                      {voice.isListening ? 'Start speaking...' : 'Click Start Recording to begin.'}
                    </span>
                  ))}
                  {/* Desktop: live interim preview replaces on each event */}
                  {voice.interimTranscript && (
                    <span style={{ color: C.textMuted }}>{voice.transcript ? ' ' : ''}{voice.interimTranscript}</span>
                  )}
                </div>

                {/* Voice error */}
                {voice.voiceError && (
                  <div style={{ marginBottom: 12, padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {voice.voiceError}
                  </div>
                )}

                {/* Buttons */}
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
                      {/* Start / Continue */}
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

                      {/* Submit  -  shown when there is transcript */}
                      {voiceText && (
                        <button
                          onClick={() => handleSubmit(dedupeTranscript(voiceText), true)}
                          disabled={loading}
                          style={{
                            padding: '11px 24px', background: C.green, border: 'none', borderRadius: 12,
                            color: '#fff', fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: loading ? 700 : 600, letterSpacing: 1.5, textTransform: 'uppercase',
                            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? <span style={{ fontWeight: 700 }}>Submitting...</span> : 'Submit Answer'}
                        </button>
                      )}

                      {/* Re-Record  -  resets everything */}
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

                {/* Android-specific instruction */}
                {voice.isAndroid && (
                  <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5 }}>
                    Tap mic, speak one sentence, tap again. Repeat for longer answers.
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ marginTop: 12, padding: '12px 16px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 12, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading state with skeleton placeholders */}
        {loading && (
          <div style={{ padding: '32px 0', animation: 'fadeUp 0.3s ease' }}>
            {/* Loading message with animated gradient background */}
            <div style={{
              marginBottom: 28,
              textAlign: 'center',
              padding: '24px 20px',
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(34, 197, 94, 0.08) 100%)',
              borderRadius: 16,
              border: '1px solid rgba(147, 51, 234, 0.1)',
              animation: 'gradientShift 3s ease infinite'
            }}>
              <div style={{ fontSize: 14, letterSpacing: 4, color: C.textMuted, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 10, fontWeight: 700 }}>
                Analyzing your answer...
              </div>
              <p style={{ fontSize: 15, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                {getLoadingMessages()[loadingMsgIndex]}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
                {[0,1,2,3,4].map(i => (
                  <span
                    key={i}
                    className={`star-pa-${i}`}
                    style={{
                      fontSize: 24,
                      display: 'inline-block',
                      filter: 'drop-shadow(0 0 6px #fbbf24)',
                    }}
                  >⭐</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback result */}
        {result && !loading && (
          authenticatedUser ? (
            <>
              <FeedbackPanel
                result={result}
                attemptNumber={attemptNumber - 1 || 1}
                questionId={questionId}
                user={authenticatedUser}
                onNextQuestion={() => {
                  setResult(null);
                  setTextAnswer('');
                  voice.setTranscript('');
                  setAnalysisText('');
                  setLoading(false);
                  window.scrollTo(0, 0);
                  window.history.replaceState({}, document.title, '/');
                  if (onNextQuestion) onNextQuestion();
                }}
              />

              {/* Post-first-session encouragement hook */}
              <div style={{
                marginTop: 28,
                padding: '24px',
                background: C.greenLight,
                border: `1px solid ${C.greenBorder}`,
                borderRadius: 16,
              }}>
                <p style={{
                  fontSize: 14,
                  color: C.text,
                  lineHeight: 1.6,
                  marginBottom: 16,
                  margin: 0,
                  marginBottom: 16,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  That's your baseline. Most users improve in their first week with one question a day. Want to try your next question now?
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {onNextQuestion && (
                    <button
                      onClick={onNextQuestion}
                      style={{
                        flex: 1,
                        minWidth: 140,
                        padding: '13px 0',
                        background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                        border: 'none',
                        borderRadius: 50,
                        color: '#fff',
                        fontSize: 11,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      Try Next Question
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{
              background: C.bgMuted,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '32px 24px',
              textAlign: 'center',
              animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Your score is ready. See how you did.
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create an account to unlock your score, competency breakdown, and the expert answer. Takes 30 seconds.
              </div>
              <button
                onClick={() => {
                  requireAuth('Sign in to see your score and the expert rewrite', null, { defaultTab: 'signup' });
                }}
                style={{
                  padding: '10px 24px',
                  background: C.green,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.greenHover}
                onMouseLeave={e => e.currentTarget.style.background = C.green}
              >
                Sign Up
              </button>
              <button
                onClick={onBack}
                style={{
                  marginTop: 12,
                  padding: '10px 24px',
                  background: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.textMuted,
                  fontSize: 11,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                ← Back to Q&A
              </button>
            </div>
          )
        )}

        <div style={{ height: 60 }} />
      </div>

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => window.location.href = '/?page=pricing'}
        />
      )}
    </div>
  );
}
