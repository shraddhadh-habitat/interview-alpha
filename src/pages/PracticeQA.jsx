import { useState, useMemo, useEffect } from 'react';
import { pmQuestions, PM_LEVELS } from '../data/pmQuestions';
import { supabase } from '../lib/supabase';
import PracticeMode from './PracticeMode';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#555555', textMuted: '#999999',
  border: '#E5E5E5', borderLight: '#F0F0F0',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
};

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 2000px; } }
  * { box-sizing: border-box; }
  input:focus { outline: none; }
  ::selection { background: rgba(232,101,10,0.18); }
`;

function ChevronIcon({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={open ? C.orange : C.textMuted} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ScoreBadge({ score, attempts }) {
  const color = score >= 70 ? C.green : score >= 40 ? C.yellow : '#D32F2F';
  const bg = score >= 70 ? C.greenLight : score >= 40 ? C.yellowLight : 'rgba(211,47,47,0.07)';
  const border = score >= 70 ? C.greenBorder : score >= 40 ? C.yellowBorder : 'rgba(211,47,47,0.18)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <span style={{
        padding: '2px 8px',
        background: bg, border: `1px solid ${border}`,
        borderRadius: 20, fontSize: 10,
        color, fontFamily: "'DM Mono', monospace",
        fontWeight: 600, letterSpacing: 0.5,
      }}>
        {score}
      </span>
      {attempts > 1 && (
        <span style={{ fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
          ×{attempts}
        </span>
      )}
    </div>
  );
}

function QuestionCard({ question, questionId, index, isOpen, onToggle, onPractice, practiceData }) {
  return (
    <div style={{
      background: C.bg,
      border: `1px solid ${isOpen ? C.orangeBorder : C.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: isOpen ? '0 2px 16px rgba(232,101,10,0.07)' : 'none',
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
          background: isOpen ? C.orange : C.bgMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace",
          color: isOpen ? '#fff' : C.textMuted,
          transition: 'background 0.2s, color 0.2s', marginTop: 1,
        }}>
          {index + 1}
        </div>

        {/* Question text */}
        <span style={{
          flex: 1, fontSize: 14, lineHeight: 1.65,
          fontFamily: "'Source Serif 4', serif",
          color: C.text, fontWeight: isOpen ? 600 : 400,
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
          borderTop: `1px solid ${C.orangeBorder}`,
          background: C.orangeLight,
          animation: 'fadeUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ padding: '20px 22px 16px' }}>
            <div style={{
              fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
              color: C.orange, fontFamily: "'DM Mono', monospace",
              fontWeight: 500, marginBottom: 12,
            }}>
              Expert Answer
            </div>
            <div style={{
              fontSize: 14, lineHeight: 1.8, color: C.textSoft,
              fontFamily: "'Source Serif 4', serif",
              whiteSpace: 'pre-wrap',
            }}>
              {question.a}
            </div>
          </div>
          {/* Practice button */}
          <div style={{ padding: '0 22px 18px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onPractice(); }}
              style={{
                padding: '9px 20px',
                background: C.orange, border: 'none', borderRadius: 7,
                color: '#fff', fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", fontWeight: 500,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
              onMouseLeave={e => e.currentTarget.style.background = C.orange}
            >
              ✎ Practice This Question
            </button>
            {practiceData && (
              <span style={{ marginLeft: 12, fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
                Best: {practiceData.best_score}/100 · {practiceData.attempts} attempt{practiceData.attempts !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticeQA({ user }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [category, setCategory] = useState('product');
  const [search, setSearch] = useState('');
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState(null); // { question, questionId, designation, category }
  const [practiceStats, setPracticeStats] = useState({}); // { [questionId]: { best_score, attempts } }

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
      n += (bank.product?.length || 0) + (bank.behavioral?.length || 0);
    }
    return n;
  }, []);

  // If in practice mode, render PracticeMode instead
  if (practiceQuestion) {
    return (
      <PracticeMode
        question={practiceQuestion.question}
        questionId={practiceQuestion.questionId}
        designation={practiceQuestion.designation}
        category={practiceQuestion.category}
        user={user}
        onBack={() => {
          setPracticeQuestion(null);
          // Refresh stats after coming back
          if (user) {
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
          }
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'DM Mono', monospace" }}>
      <style>{globalStyles}</style>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 28px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 10 }}>INTERVIEW PREP</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            Practice Q&amp;A
          </h2>
          <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Source Serif 4', serif" }}>
            {totalCount} questions across {PM_LEVELS.length} PM designations — from APM to CPO.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div style={{
          padding: '14px 18px',
          background: C.yellowLight, border: `1px solid ${C.yellowBorder}`,
          borderRadius: 8, marginBottom: 32,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
          <p style={{ fontSize: 12, lineHeight: 1.65, color: C.yellow, fontFamily: "'Source Serif 4', serif", margin: 0 }}>
            <strong style={{ fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>Framework Guide, Not a Script.</strong>{' '}
            These answers demonstrate structured thinking patterns and PM frameworks. For behavioral questions, replace the example stories with your own real experiences. Numbers used are illustrative — always use your actual data in interviews.
          </p>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>

          {/* Category toggle */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'product', label: 'Product Questions' },
              { id: 'behavioral', label: 'Behavioral Questions' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setExpandedKeys(new Set()); setAllExpanded(false); }}
                style={{
                  padding: '10px 22px',
                  background: category === cat.id ? C.orange : C.bg,
                  border: `1px solid ${category === cat.id ? C.orange : C.border}`,
                  borderRadius: 8,
                  color: category === cat.id ? '#fff' : C.textMuted,
                  fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  fontWeight: category === cat.id ? 500 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Designation pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              onClick={() => { setSelectedLevel(null); setExpandedKeys(new Set()); setAllExpanded(false); }}
              style={{
                padding: '6px 14px',
                background: selectedLevel === null ? C.orange : C.bg,
                border: `1px solid ${selectedLevel === null ? C.orange : C.border}`,
                borderRadius: 20, fontSize: 11, letterSpacing: 1,
                color: selectedLevel === null ? '#fff' : C.textMuted,
                cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              All Levels
            </button>
            {PM_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => { setSelectedLevel(level); setExpandedKeys(new Set()); setAllExpanded(false); }}
                style={{
                  padding: '6px 14px',
                  background: selectedLevel === level ? C.orange : C.bg,
                  border: `1px solid ${selectedLevel === level ? C.orange : C.border}`,
                  borderRadius: 20, fontSize: 11, letterSpacing: 0.5,
                  color: selectedLevel === level ? '#fff' : C.textMuted,
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search + Expand */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 10,
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '0 16px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setExpandedKeys(new Set()); setAllExpanded(false); }}
                placeholder="Search questions..."
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  color: C.text, fontSize: 13, fontFamily: "'Source Serif 4', serif",
                  padding: '11px 0',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              )}
            </div>
            <button
              onClick={handleExpandAll}
              style={{
                padding: '10px 18px', background: C.bg,
                border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.textSoft, fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
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
            <span style={{ fontSize: 11, color: C.orange, letterSpacing: 0.5 }}>
              {expandedKeys.size} expanded
            </span>
          )}
        </div>

        {/* Question list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>◆</div>
            <div style={{ fontSize: 13, fontFamily: "'Source Serif 4', serif" }}>No questions match your filters.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((item, displayIndex) => (
              <QuestionCard
                key={item.key}
                question={item.question}
                questionId={item.key}
                index={displayIndex}
                isOpen={expandedKeys.has(item.key)}
                onToggle={() => toggleCard(item.key)}
                onPractice={() => setPracticeQuestion({
                  question: item.question,
                  questionId: item.key,
                  designation: item.level,
                  category,
                })}
                practiceData={practiceStats[item.key] || null}
              />
            ))}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
