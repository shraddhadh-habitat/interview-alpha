import { useCallback } from 'react';

const C = {
  bg: '#FAFAF8',
  text: '#1B1B18',
  textMuted: '#9C9C97',
  textSoft: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A',
  greenLight: 'rgba(22, 163, 74, 0.08)',
  redWarm: '#DC6D6D',
  redWarmLight: 'rgba(220, 109, 109, 0.08)',
};

export default function LandingPage({ onStartPractice, onBrowseQuestions }) {
  // Hero section
  const HeroSection = () => (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Desktop: 60/40 side-by-side; Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE — 60% */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div style={{
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              AI-powered PM interview practice
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: 500,
              color: C.text,
              lineHeight: 1.15,
              marginBottom: '20px',
              fontFamily: "'Instrument Serif', serif",
            }}>
              Get the interview feedback no company will give you
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: '16px',
              color: C.textSoft,
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '520px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              One question. One answer. Instant feedback on what you nailed and what you missed.
            </p>

            {/* Primary CTA */}
            <button
              onClick={onStartPractice}
              style={{
                width: '100%',
                maxWidth: '360px',
                height: '48px',
                background: C.text,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                marginBottom: '20px',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2A2A24'}
              onMouseLeave={e => e.currentTarget.style.background = C.text}
            >
              Answer your first question →
            </button>

            {/* Reassurance text */}
            <p style={{
              fontSize: '13px',
              color: C.textMuted,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              No resume. No setup. Free. Takes 2 minutes.
            </p>

            {/* Secondary link */}
            <button
              onClick={onBrowseQuestions}
              style={{
                background: 'none',
                border: 'none',
                color: C.textSoft,
                fontSize: '14px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textSoft}
            >
              or browse questions free →
            </button>
          </div>

          {/* RIGHT SIDE — 40% (Feedback card) */}
          <div className="lg:col-span-5">
            {/* Card title */}
            <div style={{
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Sample feedback preview
            </div>

            {/* Card container */}
            <div style={{
              background: '#fff',
              border: `0.5px solid ${C.border}`,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {/* Question */}
              <p style={{
                fontSize: '14px',
                fontWeight: 500,
                color: C.text,
                marginBottom: '20px',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                How would you improve Uber's driver retention?
              </p>

              {/* Score */}
              <div style={{
                fontSize: '28px',
                fontWeight: 500,
                color: C.text,
                marginBottom: '24px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                6.5<span style={{ fontSize: '18px', color: C.textMuted }}>/10</span>
              </div>

              {/* What worked */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: C.green,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  ✓ What worked
                </div>
                <p style={{
                  fontSize: '13px',
                  color: C.textSoft,
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Clear problem definition. Good user segmentation.
                </p>
              </div>

              {/* What to improve */}
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: C.redWarm,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  → What to improve
                </div>
                <p style={{
                  fontSize: '13px',
                  color: C.textSoft,
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  Missing trade-off analysis. Metrics too vague.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Trust strip section
  const TrustSection = () => (
    <div style={{ background: C.bg, paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          {/* Testimonial card */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '24px 28px',
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '14px',
              fontStyle: 'italic',
              color: C.text,
              lineHeight: 1.7,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              "This is something amazing for product managers. I often find it difficult to find a resource where I can practice actual product sense questions."
            </p>

            {/* Attribution */}
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              color: C.textSoft,
              margin: 0,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              — Shrey C., Product Manager
            </p>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: C.border,
              margin: '16px 0',
            }} />

            {/* Proof line */}
            <p style={{
              fontSize: '13px',
              color: C.textMuted,
              textAlign: 'center',
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              150+ PMs signed up · Google · Amazon · Meta · Flipkart prep
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // How it works section
  const HowItWorksSection = () => (
    <div style={{ background: C.bg, paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div style={{
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: C.textMuted,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          How it works
        </div>

        {/* 3 cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
          {/* Card 1 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
            {/* Number circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F5F3EF',
              color: C.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 auto 16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              1
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Pick any question
            </h3>

            {/* Subtitle */}
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              1,100+ PM questions. Or let Alpha pick for you.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
            {/* Number circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F5F3EF',
              color: C.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 auto 16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              2
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Answer in your words
            </h3>

            {/* Subtitle */}
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Type or speak. No prep needed. No right format.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
            {/* Number circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F5F3EF',
              color: C.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 600,
              margin: '0 auto 16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              3
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Get scored in seconds
            </h3>

            {/* Subtitle */}
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              8 competencies. What you nailed. What to fix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
    </div>
  );
}
