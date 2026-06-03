import { useState, useEffect } from 'react';

// ============================================================
// TRACKS DATA: Add new tracks here in future
// Each track needs: id, label, emoji, color, example
// ============================================================
const TRACKS = [
  {
    id: 'pm',
    label: 'Product Management',
    emoji: '📦',
    color: '#a78bfa',
    example: {
      category: 'PRODUCT MANAGEMENT',
      question: "Zepto delivers in 10 minutes. A competitor just announced 7-minute delivery. You're the PM. Do you match them or differentiate? What's your strategy?",
      sampleAnswer: "I wouldn't chase the 7-minute promise immediately. First, I'd look at whether delivery speed is actually the #1 churn reason. It might be product quality or pricing. If data shows speed matters, I'd A/B test 8-min delivery in 2 pilot cities before committing infra costs. Meanwhile I'd differentiate on reliability. Guaranteed 10 mins, every time. Since broken promises hurt more than slow ones.",
      overallScore: 7,
      competencies: [
        { label: 'Problem Framing',      score: 8 },
        { label: 'Data Driven Thinking', score: 7 },
        { label: 'Strategic Thinking',   score: 8 },
        { label: 'User Empathy',         score: 6 },
        { label: 'Communication',        score: 7 },
        { label: 'Prioritisation',       score: 8 },
        { label: 'Trade-off Analysis',   score: 7 },
        { label: 'Execution Clarity',    score: 6 },
      ],
      expertRewrite: `Before deciding on speed, I would validate the assumption. I would pull churn data segmented by delivery time. If less than 15% of churned users cited speed, matching 7 mins is a costly distraction.

I would differentiate on reliability with a Zepto Promise. Guaranteed 10 mins or your next order free. This builds trust, is defensible, and costs less than shaving 3 mins off logistics. If speed data proves critical, I would test 8-min delivery in Mumbai and Bangalore first, measure NPS delta, then decide on full rollout.`,
    }
  },
  {
    id: 'ds',
    label: 'Data Science',
    emoji: '📊',
    color: '#7ec8c8',
    example: {
      category: 'DATA SCIENCE',
      question: "Zomato's delivery time prediction model is 91% accurate overall, but restaurant partners say it's wrong 'all the time.' How do you investigate this gap?",
      sampleAnswer: "91% overall accuracy can hide poor performance in specific segments. I'd start by breaking down accuracy by restaurant type, city, time of day, and order size. The partners saying it's wrong 'all the time' suggests the errors are concentrated. Maybe in peak hours or specific cuisines. I'd look at the confusion matrix and check if the model systematically over or under predicts for certain groups.",
      overallScore: 7,
      competencies: [
        { label: 'Problem Decomposition', score: 8 },
        { label: 'Statistical Thinking',  score: 8 },
        { label: 'Data Intuition',        score: 7 },
        { label: 'Hypothesis Formation',  score: 7 },
        { label: 'Communication',         score: 6 },
        { label: 'Business Context',      score: 7 },
        { label: 'Technical Depth',       score: 8 },
        { label: 'Actionability',         score: 6 },
      ],
      expertRewrite: `This is a classic aggregate vs. segment accuracy problem. Overall 91% accuracy is misleading. I would immediately segment performance by restaurant category, order volume tier, city, and time slot. My hypothesis: the model was trained on historical data that over-represents high-volume restaurants, so it performs well on average but fails on edge cases like new restaurants or weekend peak slots.

I would compute accuracy per segment, identify the worst-performing slices, then retrain with stratified sampling or build separate models per segment. I would also talk to 5 restaurant partners to understand which specific predictions feel wrong. Qualitative signal often points directly at the data problem.`,
    }
  },
  // ============================================================
  // ADD NEW TRACKS HERE IN FUTURE: example:
  // {
  //   id: 'swe',
  //   label: 'Software Engineering',
  //   emoji: '💻',
  //   color: '#f97316',
  //   example: { ... }
  // },
  // {
  //   id: 'design',
  //   label: 'Product Design',
  //   emoji: '🎨',
  //   color: '#ec4899',
  //   example: { ... }
  // },
  // ============================================================
];

// ============================================================
// COMPONENT
// Updated spacing: AI Score and Expert Rewrite cards in tight 8px gap
// ============================================================
export default function FeedbackPreview({ onNavigate }) {
  const [activeTrack, setActiveTrack] = useState('pm');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const track = TRACKS.find(t => t.id === activeTrack);
  const ex = track.example;

  return (
    <section style={{
      maxWidth: '960px',
      margin: '0 auto',
      padding: '40px 24px',
      paddingBottom: '0',
      marginBottom: '0',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <p style={{
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '0.95rem',
          color: '#111',
          fontWeight: 600,
          marginBottom: '10px'
        }}>
          See it in action
        </p>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
          fontWeight: 800,
          color: '#111',
          marginBottom: '10px',
          lineHeight: 1.25
        }}>
          Answer this question. See your real score.
        </h2>
        <p style={{ color: '#111', fontSize: '0.95rem', fontWeight: 600 }}>
          AI precision. Human expertise. Guaranteed.
        </p>
      </div>

      {/* Track switcher tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        {TRACKS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTrack(t.id)}
            style={{
              background: activeTrack === t.id
                ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)'
                : '#ffffff',
              color: activeTrack === t.id ? '#ffffff' : '#6b6b6b',
              border: activeTrack === t.id ? 'none' : '1.5px solid #e4e1db',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'inherit'
            }}
          >
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Feedback layout - wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

        {/* TOP ROW - two columns */}
        <div className="feedback-preview-grid" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '16px',
          alignItems: 'start'
        }}>
          {/* LEFT - Question + Sample Answer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Question */}
            <div style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid #e4e1db',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                color: '#fff',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: '12px'
              }}>
                {ex.category}
              </span>
              <p style={{
                fontSize: '0.92rem',
                color: '#111',
                lineHeight: 1.7,
                fontWeight: 500,
                margin: 0
              }}>
                {ex.question}
              </p>
            </div>

            {/* Interactive answer input */}
            <div style={{
              background: '#f9f8f6',
              borderRadius: '14px',
              padding: '20px',
              marginTop: '12px'
            }}>
              <p style={{
                color: '#111',
                fontSize: '0.85rem',
                fontWeight: 700,
                margin: '0 0 12px'
              }}>
                How would you answer this?
              </p>

              <div
                onClick={() => onNavigate && onNavigate('practice')}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px dashed #a78bfa',
                  fontSize: '0.85rem',
                  color: '#9a9a9a',
                  background: 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: 1.6
                }}
              >
                Click here to type your answer and get scored...
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '10px'
              }}>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openLoginModal', { detail: { destination: 'practice' } });
                    window.dispatchEvent(event);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  🎙️ Answer by Voice
                </button>
                <button
                  onClick={() => {
                    const event = new CustomEvent('openLoginModal', { detail: { destination: 'practice' } });
                    window.dispatchEvent(event);
                  }}
                  style={{
                    flex: 1,
                    background: 'white',
                    color: '#a78bfa',
                    border: '1.5px solid #a78bfa',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  ✍️ Type Answer
                </button>
              </div>

              <p style={{
                color: '#9a9a9a',
                fontSize: '0.72rem',
                textAlign: 'center',
                margin: '10px 0 0'
              }}>
                Sign in to get AI feedback scored on your own answer
              </p>
            </div>
          </div>

          {/* RIGHT - What would you score? CTA */}
          <div style={{
            background: '#f9f8f6',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              ?
            </div>
            <p style={{
              color: '#111',
              fontWeight: 800,
              fontSize: '1.1rem',
              margin: 0
            }}>
              What would you score?
            </p>
            <p style={{
              color: '#6b6b6b',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              margin: 0
            }}>
              Answer this question to get scored across 8 competencies. Most candidates are surprised by what they find out.
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent('openLoginModal', { detail: { destination: 'practice' } });
                window.dispatchEvent(event);
              }}
              style={{
                background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Find out my score →
            </button>
          </div>
        </div>

        {/* Expert Rewrite - Teaser */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(168,230,207,0.1),rgba(167,139,250,0.1))',
          border: '1.5px solid rgba(167,139,250,0.2)',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '20px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <p style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#a78bfa',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 8px'
          }}>
            ✨ Expert Rewrite
          </p>
          <p style={{
            color: '#111',
            fontWeight: 700,
            fontSize: '0.95rem',
            margin: '0 0 8px'
          }}>
            See how a senior interviewer would answer this question
          </p>
          <p style={{
            color: '#6b6b6b',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            margin: '0 0 16px'
          }}>
            Every practice session includes a full expert rewrite showing exactly what a top candidate would say instead of what you said.
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent('openLoginModal', { detail: { destination: 'practice' } });
              window.dispatchEvent(event);
            }}
            style={{
              background: 'white',
              color: '#a78bfa',
              border: '1.5px solid #a78bfa',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Answer to unlock expert rewrite →
          </button>
        </div>

      </div>

      {/* Bottom CTA */}
      <p style={{
        textAlign: 'center',
        fontSize: '0.95rem',
        color: '#111',
        marginTop: '16px',
        marginBottom: '0',
        fontWeight: 600
      }}>
        Dhruv scored 4 out of 10 on his first try. Two weeks later he had an offer. What would your score be?
      </p>
    </section>
  );
}
