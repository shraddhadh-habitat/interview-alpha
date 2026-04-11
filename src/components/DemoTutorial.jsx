import { useState, useEffect } from 'react';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#1A1A1A', textMuted: '#444444',
  border: '#E5E5E5',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
};

const STEPS = [
  {
    id: 'welcome',
    icon: '◆',
    label: 'Welcome',
    title: 'Welcome to InterviewAlpha',
    subtitle: 'Your AI-powered PM interview coach',
    body: `InterviewAlpha gives you everything you need to land your next PM role — from live mock interviews with real-time feedback, to a 1100+ question practice bank covering every level from APM to CPO.\n\nThis 60-second tour will show you what's waiting for you.`,
  },
  {
    id: 'profile',
    icon: '⊡',
    label: 'Your Profile',
    title: 'Start with Your Context',
    subtitle: 'Resume + Job Description = hyper-targeted coaching',
    body: `Paste your resume and the job description you're targeting before your first session.\n\nInterviewAlpha uses this context to ask the exact questions a Senior PM at that company would ask — not generic questions, but follow-ups that reference your specific experience and the role's stated requirements.\n\nYour profile auto-saves and pre-fills every new session.`,
  },
  {
    id: 'interview',
    icon: '▶',
    label: 'Live Interview',
    title: 'The Live Interview Simulator',
    subtitle: 'Three tracks. Real pressure. Expert feedback.',
    body: `Choose your track — Product Sense, Execution, or Behavioral — and enter a real-time mock interview with an AI interviewer that stays in character.\n\nSpeak or type your answers. After each response you get structured feedback on structure, user empathy, and analytical rigor.\n\nEnd the session to receive your overall score, filler word analysis, high-signal keyword detection, and a Director-level rewrite of your answer.`,
  },
  {
    id: 'practiceqa',
    icon: '≡',
    label: 'Practice Q&A',
    title: 'Browse 1100+ PM Questions',
    subtitle: 'Expert answers across every designation',
    body: `The Practice Q&A library covers every PM level from Associate PM to CPO — across both product and behavioral question categories.\n\nFilter by designation, search by keyword, and expand any question to read a structured expert answer that demonstrates the frameworks and thinking patterns a top PM would use.\n\nThese are frameworks, not scripts. Replace example stories with your own.`,
  },
  {
    id: 'practicemode',
    icon: '✎',
    label: 'Practice Mode',
    title: 'Practice Any Question',
    subtitle: 'Answer it. Get scored. Track your progress.',
    body: `On any question in the Practice Q&A library, click "Practice This Question" to enter Practice Mode.\n\nType or speak your answer. InterviewAlpha evaluates it against the expert answer across five competencies: Structure, Depth, Frameworks, Communication, and Trade-off Awareness.\n\nYou get a score out of 100, identified strengths and weaknesses, missing concepts, filler word detection, and an expert rewrite of your answer. Each attempt is numbered and saved to your history.`,
  },
  {
    id: 'sessions',
    icon: '◇',
    label: 'Past Sessions & Leaderboard',
    title: 'Track Your Progress',
    subtitle: 'Every session saved. Competition optional.',
    body: `Every interview session is saved — you can replay the full conversation, review your score breakdown, and see how you've improved over time.\n\nThe Leaderboard shows top performers across all users. Your ranking is based on average session score.\n\nYou're ready. Start with a live interview, or warm up in the Practice Q&A library.`,
  },
];

const globalStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function DemoTutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [animKey, setAnimKey] = useState(0);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setAnimKey(k => k + 1);
    setStep(next);
  };

  const handleClose = () => {
    onClose();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) goTo(step + 1);
    else handleClose();
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.25s ease',
    }}>
      <style>{globalStyles}</style>

      <div style={{
        width: '100%', maxWidth: 580,
        background: C.bg,
        borderRadius: 20,
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Orange accent bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${C.orange}, #D45800)`,
          width: `${((step + 1) / STEPS.length) * 100}%`,
          transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
        }} />

        {/* Skip button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: C.textMuted,
            fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '4px 8px',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
        >
          Skip tour
        </button>

        {/* Content */}
        <div
          key={animKey}
          style={{
            padding: '40px 44px 32px',
            animation: 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* Step icon + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{
              width: 36, height: 36,
              background: C.orangeLight,
              border: `1px solid ${C.orangeBorder}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: C.orange,
            }}>
              {current.icon}
            </span>
            <span style={{
              fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
              color: C.orange, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
            }}>
              Step {step + 1} of {STEPS.length} — {current.label}
            </span>
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28, fontWeight: 700, color: C.text,
            marginBottom: 6, lineHeight: 1.25,
          }}>
            {current.title}
          </h2>
          <p style={{
            fontSize: 13, color: C.orange,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: 24, letterSpacing: 0.3,
          }}>
            {current.subtitle}
          </p>

          {/* Body */}
          <p style={{
            fontSize: 14, lineHeight: 1.85, color: C.textSoft,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            whiteSpace: 'pre-wrap', marginBottom: 36,
          }}>
            {current.body}
          </p>

          {/* Navigation row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Dot nav */}
            <div style={{ display: 'flex', gap: 7 }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === step ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === step ? C.orange : C.border,
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {step > 0 && (
                <button
                  onClick={handleBack}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.textMuted, fontSize: 11,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 28px',
                  background: C.orange,
                  border: 'none', borderRadius: 8,
                  color: '#fff', fontSize: 11,
                  letterSpacing: 1.5, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 500, transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
                onMouseLeave={e => e.currentTarget.style.background = C.orange}
              >
                {isLast ? 'Get Started →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
