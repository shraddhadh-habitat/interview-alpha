import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { pmQuestions as PM_QUESTIONS } from '../data/pmQuestions';

const C = {
  bg: '#FFFFFF',
  bgSoft: '#FAFAF8',
  text: '#0A0A0A',
  textMuted: '#5C5C57',
  textSoft: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A',
  greenHover: '#15803D',
  yellow: '#C67F00',
};

const NAV_H = 60;

const PRO_TIPS = [
  "Use the CIRCLES framework for product sense: Comprehend, Identify, Report, Cut, List, Evaluate, Summarize.",
  "Always start execution answers with clarifying the goal and defining success metrics.",
  "In behavioral questions, use STAR: Situation, Task, Action, Result — then add what you learned.",
  "For metrics questions, think: North Star metric, Input metrics, Counter metrics, Guardrails.",
  "Amazon interviews map everything to Leadership Principles. Know all 16 by heart.",
];

const ALL_QUESTIONS = (() => {
  const out = [];
  Object.entries(PM_QUESTIONS).forEach(([level, cats]) => {
    Object.entries(cats).forEach(([cat, qs]) => {
      qs.forEach(q => out.push({ ...q, _level: level, _cat: cat }));
    });
  });
  return out;
})();

function calcStreak(sortedDates) {
  if (!sortedDates.length) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const yesterStr = yest.toISOString().split('T')[0];
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterStr) return 0;
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    if (Math.round((prev - curr) / 86400000) === 1) streak++;
    else break;
  }
  return streak;
}

export default function LoggedInDashboard({ user, profile }) {
  const [practiceAttempts, setPracticeAttempts] = useState([]);
  const [streak, setStreak] = useState(null);
  const [lastScore, setLastScore] = useState(null);
  const [weakestCompetency, setWeakestCompetency] = useState(null);

  useEffect(() => {
    if (!user) {
      setStreak(0);
      setPracticeAttempts([]);
      return;
    }
    supabase
      .from('practice_attempts')
      .select('created_at, overall_score, competency_breakdown')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data?.length) {
          setStreak(0);
          setPracticeAttempts([]);
          setLastScore(null);
          setWeakestCompetency(null);
          return;
        }

        const dates = [...new Set(data.map(r => r.created_at.split('T')[0]))].sort((a, b) =>
          b.localeCompare(a)
        );
        setStreak(calcStreak(dates));
        setPracticeAttempts(data);

        if (data[0]?.overall_score) {
          setLastScore(data[0].overall_score);
        }

        if (data.length > 0 && data[0]?.competency_breakdown) {
          const competencies = {};
          data.forEach(attempt => {
            if (attempt.competency_breakdown) {
              Object.entries(attempt.competency_breakdown).forEach(([comp, score]) => {
                if (!competencies[comp]) competencies[comp] = [];
                competencies[comp].push(score);
              });
            }
          });

          let weakest = null;
          let lowestAvg = Infinity;
          Object.entries(competencies).forEach(([comp, scores]) => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (avg < lowestAvg) {
              lowestAvg = avg;
              weakest = comp;
            }
          });
          setWeakestCompetency(weakest && lowestAvg < 5 ? weakest : null);
        }
      });
  }, [user]);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there';
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const dailyQ = ALL_QUESTIONS[dayOfYear % ALL_QUESTIONS.length];
  const todayTip = PRO_TIPS[new Date().getDay() % PRO_TIPS.length];

  return (
    <div
      style={{
        background: C.bgSoft,
        padding: '48px 28px',
        paddingTop: NAV_H + 48,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: C.text,
        }}
      >
        {/* Today's Challenge - only show if they have 1+ attempts */}
        {practiceAttempts.length >= 1 && (
          <div
            style={{
              width: '100%',
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '16px 20px',
              textAlign: 'left',
              marginBottom: 20,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: C.green,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              📅 Today's Challenge
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.text,
                lineHeight: 1.55,
                marginBottom: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {dailyQ.q}
            </div>
            <button
              onClick={() => {
                sessionStorage.setItem(
                  'ia:quickQuestion',
                  JSON.stringify({
                    question: { q: dailyQ.q, a: dailyQ.a },
                    questionId: 'daily-' + dayOfYear,
                    designation: dailyQ._level || 'Senior PM',
                    category: dailyQ._cat || 'product',
                  })
                );
                window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
              }}
              style={{
                padding: '8px 18px',
                background: C.green,
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.greenHover;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.green;
              }}
            >
              Answer a question
            </button>
          </div>
        )}

        {/* Pro Tip - only show if they have 3+ attempts */}
        {practiceAttempts.length >= 3 && (
          <div
            style={{
              width: '100%',
              background: 'rgba(198,127,0,0.05)',
              border: '1px solid rgba(198,127,0,0.18)',
              borderRadius: 14,
              padding: '14px 18px',
              textAlign: 'left',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: C.yellow,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              💡 Pro Tip
            </div>
            <div
              style={{
                fontSize: 13,
                color: C.textSoft,
                lineHeight: 1.65,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {todayTip}
            </div>
          </div>
        )}

        {/* Smart Context-Aware CTA - only for users with at least 1 attempt */}
        {(() => {
          const attemptCount = practiceAttempts.length;
          if (attemptCount === 0) return null;

          let ctaMessage = '';
          let ctaButtonText = '';
          let ctaAction = null;

          if (attemptCount >= 1 && attemptCount < 5) {
            ctaMessage = `You've practiced ${attemptCount} ${attemptCount === 1 ? 'question' : 'questions'}. Keep building momentum.`;
            ctaButtonText = 'Practice next question';
            ctaAction = () => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
          } else if (attemptCount >= 5 && weakestCompetency) {
            ctaMessage = `Your ${weakestCompetency.replace(/_/g, ' ')} needs work. Let's improve it.`;
            ctaButtonText = `Work on ${weakestCompetency.replace(/_/g, ' ')}`;
            ctaAction = () => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
          } else if (attemptCount >= 10 && streak !== null && streak > 0) {
            ctaMessage = `🔥 ${streak} day${streak === 1 ? '' : 's'} streak. Keep it alive.`;
            ctaButtonText = 'Practice today';
            ctaAction = () => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
          } else {
            ctaMessage = `You've completed ${attemptCount} practice questions.`;
            ctaButtonText = 'Practice more questions';
            ctaAction = () => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }));
          }

          return (
            <>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '0.5px solid #E8E6E1',
                  borderRadius: 16,
                  padding: '24px',
                  maxWidth: '100%',
                  marginBottom: 24,
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    color: '#5C5C57',
                    marginBottom: 16,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.6,
                    textAlign: 'center',
                  }}
                >
                  {ctaMessage}
                </p>
                <button
                  onClick={ctaAction}
                  style={{
                    width: '100%',
                    height: 44,
                    background: '#1B1B18',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#0F0F0D';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1B1B18';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  {ctaButtonText}
                </button>
              </div>

              {/* Stats row - only show if they have at least 1 attempt */}
              {attemptCount >= 1 && (
                <div
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    textAlign: 'center',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    marginTop: 16,
                  }}
                >
                  Last score: {lastScore !== null ? `${lastScore}/10` : 'N/A'} · Streak:{' '}
                  {streak !== null ? `${streak} ${streak === 1 ? 'day' : 'days'}` : '0 days'} ·
                  Total: {attemptCount} {attemptCount === 1 ? 'question' : 'questions'}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
