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

  // Guided paths section
  const GuidedPathsSection = () => (
    <div style={{ background: C.bg, paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 500,
          color: C.text,
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Where do you want to start?
        </h2>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {/* Card 1 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              I have an interview coming up
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              margin: '0 0 16px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Practice company-specific questions
            </p>
            <button style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Prep for my interview →
            </button>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              I want to check my product sense
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              margin: '0 0 16px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Answer one question and see how you score
            </p>
            <button style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Try a product question →
            </button>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              I'm switching to PM
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              margin: '0 0 16px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Start with APM level fundamentals
            </p>
            <button style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Start with fundamentals →
            </button>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Just browsing
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              margin: '0 0 16px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              1,100+ questions with expert answers
            </p>
            <button style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Browse all questions →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Product proof section
  const ProductProofSection = () => (
    <div style={{ background: C.bg, paddingTop: '64px', paddingBottom: '48px' }}>
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
          What you get with every practice session
        </div>

        {/* 4 feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-3 mb-12">
          {/* Card 1 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
              📋
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Practice by category
            </h3>
            <p style={{
              fontSize: '12px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Product sense, strategy, behavioral, metrics, technical
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
              🏢
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Prep by company
            </h3>
            <p style={{
              fontSize: '12px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Google, Amazon, Meta, Apple, Flipkart, Razorpay
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
              📊
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Instant scored feedback
            </h3>
            <p style={{
              fontSize: '12px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              8 competencies scored on every answer you give
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
              ✏️
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              margin: '0 0 8px 0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Expert rewrite included
            </h3>
            <p style={{
              fontSize: '12px',
              color: C.textSoft,
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              See how a senior PM would answer the same question
            </p>
          </div>
        </div>

        {/* Centered CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onStartPractice}
            style={{
              height: '44px',
              paddingLeft: '32px',
              paddingRight: '32px',
              background: C.text,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2A2A24'}
            onMouseLeave={e => e.currentTarget.style.background = C.text}
          >
            Answer your first question →
          </button>
          <p style={{
            fontSize: '13px',
            color: C.textMuted,
            marginTop: '12px',
            margin: '12px 0 0 0',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Free. No signup needed to browse.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <GuidedPathsSection />
      <ProductProofSection />
    </div>
  );
}
