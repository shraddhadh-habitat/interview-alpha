import { useState, useMemo, useEffect } from 'react';
import { pmQuestions, PM_LEVELS } from '../data/pmQuestions';
import { supabase } from '../lib/supabase';
import PracticeMode from './PracticeMode';
import { useAuth } from '../contexts/AuthContext';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#0A0A0A', textSoft: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1', borderLight: '#F0EDE8',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
  success: '#1A7F37', successLight: 'rgba(27,140,58,0.08)', successBorder: 'rgba(27,140,58,0.2)',
};

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
  * { box-sizing: border-box; }
  input:focus { outline: none; }
  ::selection { background: rgba(22,163,74,0.18); }
  @media (max-width: 480px) {
    .pqa-container { padding: 20px 16px 40px !important; }
    .pqa-level-select { width: 100% !important; min-width: 0 !important; }
    .pqa-search-row { flex-wrap: wrap !important; }
    .pqa-expand-btn { width: 100% !important; }
  }
`;

function ReportIssueModal({ questionId, user, onClose }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await supabase.from('question_reports').insert({
      user_id: user.id,
      question_id: questionId,
      report_text: text.trim(),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '0 16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
          width: '100%', maxWidth: 440,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 14, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
              Thanks — we'll review this.
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: 20, padding: '8px 22px',
                background: C.green, border: 'none', borderRadius: 10,
                color: '#fff', fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 10, letterSpacing: 3, color: C.textMuted, textTransform: 'uppercase', marginBottom: 14 }}>
              Report Issue
            </div>
            <label style={{ fontSize: 13, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'block', marginBottom: 10 }}>
              What's wrong with this answer?
            </label>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Describe the issue — e.g. outdated info, factual error, unclear explanation..."
              rows={4}
              style={{
                width: '100%', padding: '10px 14px',
                border: `1px solid ${C.border}`, borderRadius: 12,
                fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: C.text, lineHeight: 1.6, resize: 'vertical',
                background: C.bgSoft, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 18px', background: 'transparent',
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  color: C.textMuted, fontSize: 11, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                style={{
                  padding: '8px 18px',
                  background: text.trim() && !submitting ? C.green : C.bgMuted,
                  border: 'none', borderRadius: 10,
                  color: text.trim() && !submitting ? '#fff' : C.textMuted,
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: text.trim() && !submitting ? 'pointer' : 'default',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.2s',
                }}
              >
                {submitting ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const TEASER_LEN = 120;

function BlurredAnswer({ text, bgColor = 'rgb(236,247,241)' }) {
  const { user, requireAuth } = useAuth();
  const hasMore = text.length > TEASER_LEN;
  const teaser = hasMore ? text.slice(0, TEASER_LEN) : text;
  const rest = hasMore ? text.slice(TEASER_LEN) : '';

  const textStyle = {
    fontSize: 15, lineHeight: 1.8, color: C.textMuted,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    whiteSpace: 'pre-wrap',
  };

  if (user || !hasMore) {
    return <div style={textStyle}>{text}</div>;
  }

  return (
    <div>
      <div style={textStyle}>{teaser}</div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...textStyle, filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
          {rest}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 0%, ${bgColor} 55%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingTop: 48,
        }}>
          <button
            onClick={() => requireAuth('Sign up to read the full expert answer')}
            style={{
              padding: '10px 24px', minHeight: 44,
              background: C.green, border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(22,163,74,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            Sign up to read full answer →
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={open ? C.green : C.textMuted} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ScoreBadge({ score, attempts }) {
  const color = score >= 70 ? C.success : score >= 40 ? C.yellow : '#CF222E';
  const bg = score >= 70 ? C.successLight : score >= 40 ? C.yellowLight : 'rgba(211,47,47,0.07)';
  const border = score >= 70 ? C.successBorder : score >= 40 ? C.yellowBorder : 'rgba(211,47,47,0.18)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <span style={{
        padding: '2px 8px',
        background: bg, border: `1px solid ${border}`,
        borderRadius: 20, fontSize: 10,
        color, fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600, letterSpacing: 0.5,
      }}>
        {score}
      </span>
      {attempts > 1 && (
        <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          ×{attempts}
        </span>
      )}
    </div>
  );
}

function QuestionCard({ question, questionId, index, isOpen, onToggle, onPractice, practiceData, onReport }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: `1px solid ${isOpen ? C.greenBorder : C.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: isOpen ? '0 2px 16px rgba(22,163,74,0.07)' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      animation: 'fadeUp 0.3s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Question row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16,
          padding: '18px 22px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Number badge */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: isOpen ? C.green : C.bgMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: isOpen ? '#fff' : C.text,
          transition: 'background 0.2s, color 0.2s', marginTop: 1,
        }}>
          {index + 1}
        </div>

        {/* Question text */}
        <span style={{
          flex: 1, fontSize: 15, lineHeight: 1.65,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: C.text, fontWeight: isOpen ? 600 : 500,
          transition: 'font-weight 0.1s',
        }}>
          {question.q}
        </span>

        {/* Score badge (if practiced) */}
        {practiceData && (
          <ScoreBadge score={practiceData.best_score} attempts={practiceData.attempts} />
        )}

        <ChevronIcon open={isOpen} />
      </button>

      {/* Answer panel */}
      {isOpen && (
        <div style={{
          borderTop: `1px solid ${C.greenBorder}`,
          background: C.greenLight,
          animation: 'fadeUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{
                padding: '3px 10px', background: '#8250DF', color: '#fff',
                borderRadius: 20, fontSize: 10, fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
              }}>
                Expert Answer
              </span>
            </div>
            <BlurredAnswer text={question.a} />
          </div>
          {/* Practice button + Report link */}
          <div style={{ padding: '0 22px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={(e) => { e.stopPropagation(); onPractice(); }}
                style={{
                  padding: '10px 22px',
                  background: C.green, border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
                  transition: 'background 0.2s',
                  boxShadow: '0 1px 2px rgba(22,163,74,0.3)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.greenHover}
                onMouseLeave={e => e.currentTarget.style.background = C.green}
              >
                Practice This Question →
              </button>
              {practiceData && (
                <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Best: {practiceData.best_score}/100 · {practiceData.attempts} attempt{practiceData.attempts !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onReport(); }}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 11, color: C.textMuted, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
                textDecoration: 'underline', textUnderlineOffset: 3,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.green}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              Report Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticeQA({ user, profile, checkSession, onSessionUsed }) {
  const { requireAuth } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [category, setCategory] = useState('product');
  const [search, setSearch] = useState('');
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState(null); // { question, questionId, designation, category }
  const [practiceStats, setPracticeStats] = useState({}); // { [questionId]: { best_score, attempts } }
  const [reportTarget, setReportTarget] = useState(null); // questionId being reported
  const [showWelcome, setShowWelcome] = useState(() => {
    const flag = sessionStorage.getItem('ia:welcome');
    if (flag) { sessionStorage.removeItem('ia:welcome'); return true; }
    return false;
  });

  // Pre-load a featured/quick question passed via sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem('ia:quickQuestion');
    if (raw) {
      sessionStorage.removeItem('ia:quickQuestion');
      try { setPracticeQuestion(JSON.parse(raw)); } catch {}
    }
  }, []);

  // Load practice stats for current user
  useEffect(() => {
    if (!user) return;
    supabase
      .from('practice_attempts')
      .select('question_id, score')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        const stats = {};
        for (const row of data) {
          if (!stats[row.question_id]) stats[row.question_id] = { best_score: row.score, attempts: 1 };
          else {
            stats[row.question_id].attempts += 1;
            if (row.score > stats[row.question_id].best_score) stats[row.question_id].best_score = row.score;
          }
        }
        setPracticeStats(stats);
      });
  }, [user]);

  const filtered = useMemo(() => {
    const results = [];
    const levels = selectedLevel ? [selectedLevel] : PM_LEVELS;
    for (const level of levels) {
      const bank = pmQuestions[level];
      if (!bank) continue;
      const questions = bank[category] || [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (search && !q.q.toLowerCase().includes(search.toLowerCase()) && !q.a.toLowerCase().includes(search.toLowerCase())) continue;
        results.push({ key: `${level}-${category}-${i}`, level, question: q, localIndex: i });
      }
    }
    return results;
  }, [selectedLevel, category, search]);

  const toggleCard = (key) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setAllExpanded(false);
  };

  const handleExpandAll = () => {
    if (allExpanded) { setExpandedKeys(new Set()); setAllExpanded(false); }
    else { setExpandedKeys(new Set(filtered.map(f => f.key))); setAllExpanded(true); }
  };

  const totalCount = useMemo(() => {
    let n = 0;
    for (const level of PM_LEVELS) {
      const bank = pmQuestions[level];
      if (!bank) continue;
      n += (bank.product?.length || 0) + (bank.behavioral?.length || 0) + (bank.ai?.length || 0) + (bank.ai_technical?.length || 0);
    }
    return n;
  }, []);

  // If in practice mode, render PracticeMode instead
  if (practiceQuestion) {
    const currentIdx = filtered.findIndex(f => f.key === practiceQuestion.questionId);
    const nextItem = currentIdx !== -1 && currentIdx < filtered.length - 1 ? filtered[currentIdx + 1] : null;
    const handleNextQuestion = nextItem ? () => setPracticeQuestion({
      question: nextItem.question,
      questionId: nextItem.key,
      designation: nextItem.level,
      category,
    }) : null;

    const refreshStats = () => {
      if (!user) return;
      supabase.from('practice_attempts').select('question_id, score').eq('user_id', user.id)
        .then(({ data }) => {
          if (!data) return;
          const stats = {};
          for (const row of data) {
            if (!stats[row.question_id]) stats[row.question_id] = { best_score: row.score, attempts: 1 };
            else { stats[row.question_id].attempts += 1; if (row.score > stats[row.question_id].best_score) stats[row.question_id].best_score = row.score; }
          }
          setPracticeStats(stats);
        });
    };

    return (
      <PracticeMode
        question={practiceQuestion.question}
        questionId={practiceQuestion.questionId}
        designation={practiceQuestion.designation}
        category={practiceQuestion.category}
        user={user}
        profile={profile}
        checkSession={checkSession}
        onSessionUsed={onSessionUsed}
        onNextQuestion={handleNextQuestion}
        onBack={() => {
          setPracticeQuestion(null);
          refreshStats();
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{globalStyles}</style>

      {reportTarget && (
        <ReportIssueModal
          questionId={reportTarget}
          user={user}
          onClose={() => setReportTarget(null)}
        />
      )}

      <div className="pqa-container" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 28px' }}>

        {/* Welcome banner — shown only on first login */}
        {showWelcome && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
            padding: '16px 20px', marginBottom: 24,
            background: C.greenLight, border: `1px solid ${C.greenBorder}`,
            borderRadius: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{ fontSize: 14, color: C.success, lineHeight: 1.6 }}>
              <strong>Welcome!</strong> Try answering a question below — tap <strong>'Practice This Question'</strong> on any question to get AI feedback.
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              style={{
                background: 'none', border: 'none', fontSize: 18, color: C.textMuted,
                cursor: 'pointer', lineHeight: 1, flexShrink: 0, padding: 0,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 400, color: C.text, marginBottom: 8 }}>
            Practice Q&amp;A
          </h2>
          <p style={{ fontSize: 15, color: C.textMuted, margin: '0 0 16px' }}>
            1,100+ expert questions across 10 PM levels
          </p>
          <div style={{
            padding: '12px 16px',
            background: C.bgMuted, border: `1px solid ${C.border}`,
            borderRadius: 12, marginBottom: 0,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: C.textMuted, margin: 0 }}>
              Answers represent expert frameworks. Replace example stories with your own experiences for behavioral questions.{' '}
              <span style={{ fontSize: 11, opacity: 0.7 }}>Last updated: March 2026.</span>
            </p>
          </div>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'product', label: 'Product Questions' },
              { id: 'behavioral', label: 'Behavioral Questions' },
              { id: 'ai', label: 'AI & PM Questions' },
              { id: 'ai_technical', label: 'AI Technical for PMs' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setExpandedKeys(new Set()); setAllExpanded(false); }}
                style={{
                  padding: '8px 20px',
                  background: category === cat.id ? C.green : C.bgMuted,
                  border: 'none',
                  borderRadius: 20,
                  color: category === cat.id ? '#fff' : C.textMuted,
                  fontSize: 13,
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: category === cat.id ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Designation dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="pqa-level-select"
              value={selectedLevel || ''}
              onChange={e => { setSelectedLevel(e.target.value || null); setExpandedKeys(new Set()); setAllExpanded(false); }}
              style={{
                padding: '9px 16px',
                background: C.bg,
                border: `1px solid ${selectedLevel ? C.green : C.border}`,
                borderRadius: 12, fontSize: 14, letterSpacing: 0.5,
                color: selectedLevel ? C.green : C.textSoft,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: selectedLevel ? 500 : 400,
                outline: 'none', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: 32,
                minWidth: 200, width: '100%', maxWidth: 280,
              }}
            >
              <option value="">All Levels</option>
              {PM_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Search + Expand */}
          <div className="pqa-search-row" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: C.bg, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: '0 16px',
            }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setExpandedKeys(new Set()); setAllExpanded(false); }}
                placeholder="Search questions..."
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  color: C.text, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  padding: '12px 0',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              )}
            </div>
            <button
              className="pqa-expand-btn"
              onClick={handleExpandAll}
              style={{
                padding: '10px 18px', background: C.bg,
                border: `1px solid ${C.border}`, borderRadius: 12,
                color: C.textSoft, fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSoft; }}
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>

        {/* Results count */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16, padding: '0 4px',
        }}>
          <span style={{ fontSize: 11, color: C.textMuted, letterSpacing: 1 }}>
            {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
            {search && ` matching "${search}"`}
          </span>
          {expandedKeys.size > 0 && (
            <span style={{ fontSize: 11, color: C.green, letterSpacing: 0.5 }}>
              {expandedKeys.size} expanded
            </span>
          )}
        </div>

        {/* Question list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 24px', color: C.textMuted }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: C.text, marginBottom: 10 }}>
              You haven&apos;t practiced any questions yet
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>
              Try a different filter, or browse all categories to find your next challenge.
            </div>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); }}
              style={{
                padding: '12px 28px', background: C.green, border: 'none',
                borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Browse Questions →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((item, displayIndex) => (
              <QuestionCard
                key={item.key}
                question={item.question}
                questionId={item.key}
                index={displayIndex}
                isOpen={expandedKeys.has(item.key)}
                onToggle={() => toggleCard(item.key)}
                onPractice={() => requireAuth('Sign up to practice with AI scoring', () => setPracticeQuestion({
                  question: item.question,
                  questionId: item.key,
                  designation: item.level,
                  category,
                }))}
                practiceData={practiceStats[item.key] || null}
                onReport={() => requireAuth('Sign up to report question issues', () => setReportTarget(item.key))}
              />
            ))}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
