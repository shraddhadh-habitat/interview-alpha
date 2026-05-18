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
  // Hero section — proper two-column layout with container
  const HeroSection = () => (
    <div style={{
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      paddingTop: '32px',
      paddingBottom: '40px',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-container { padding: 0 20px !important; }
          .hero-left { max-width: 100% !important; }
          .hero-right { max-width: 100% !important; margin-top: 32px !important; }
          .hero-headline { font-size: 26px !important; }
          .hero-subheadline { font-size: 15px !important; }
          .hero-cta { width: 100% !important; }
        }
      `}</style>

      <div className="hero-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        display: 'flex',
        gap: '48px',
        alignItems: 'center',
      }}>
        {/* LEFT COLUMN — 55% */}
        <div className="hero-left" style={{
          flex: '0 0 55%',
          maxWidth: '100%',
        }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: '12px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: C.textMuted,
            fontWeight: 600,
            marginBottom: '16px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            AI-powered interview practice
          </div>

          {/* Headline */}
          <h1 className="hero-headline" style={{
            fontSize: '36px',
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.2,
            marginBottom: '16px',
            maxWidth: '480px',
            fontFamily: "'Instrument Serif', serif",
          }}>
            Answer one interview question. Get instant feedback.
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline" style={{
            fontSize: '16px',
            color: C.textSoft,
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '420px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Practice real interview questions. See what worked, what didn't, and how to improve — in under 2 minutes.
          </p>

          {/* Primary CTA — inline-block, not full width */}
          <button
            className="hero-cta"
            onClick={onStartPractice}
            style={{
              display: 'inline-block',
              height: '44px',
              padding: '0 28px',
              background: C.text,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
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
            marginTop: '12px',
            marginBottom: '0',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            No resume. No setup. Free. Takes 2 minutes.
          </p>

          {/* Secondary link */}
          <button
            onClick={onBrowseQuestions}
            style={{
              display: 'block',
              marginTop: '8px',
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

        {/* RIGHT COLUMN — 45% */}
        <div className="hero-right" style={{
          flex: '0 0 45%',
          maxWidth: '340px',
        }}>
          {/* Card label */}
          <div style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: C.textMuted,
            fontWeight: 600,
            marginBottom: '12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Sample Feedback Preview
          </div>

          {/* Card container */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Question */}
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '16px',
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              How would you improve Uber's driver retention?
            </p>

            {/* Score */}
            <div style={{
              fontSize: '32px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              6.5<span style={{ fontSize: '18px', color: C.textMuted }}>/10</span>
            </div>

            {/* What worked */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#1A7F37',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
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
                color: '#CF222E',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px',
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
  );

  // Trust strip section
  const TrustSection = () => (
    <div style={{ background: C.bg, paddingTop: '40px', paddingBottom: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .trust-container { padding: 0 20px !important; }
        }
      `}</style>
      <div className="trust-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          {/* Testimonial card */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '14px',
              fontStyle: 'italic',
              color: C.text,
              lineHeight: 1.7,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              "This is something amazing for product managers. I often find it difficult to find a resource where I can practice actual product sense questions."
            </p>

            {/* Attribution */}
            <p style={{
              fontSize: '13px',
              fontWeight: 500,
              color: C.textSoft,
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
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
    <div style={{ background: C.bg, paddingTop: '48px', paddingBottom: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .how-container { padding: 0 20px !important; }
          .how-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
      <div className="how-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
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
        <div className="how-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
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

            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Pick any question
            </h3>

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
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
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

            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Answer in your words
            </h3>

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
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
          }}>
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

            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Get scored in seconds
            </h3>

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
    <div style={{ background: C.bg, paddingTop: '48px', paddingBottom: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .paths-container { padding: 0 20px !important; }
          .paths-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
      <div className="paths-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
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
        <div className="paths-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I have an interview coming up
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
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
            border: `1px solid ${C.border}`,
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I want to test my skills
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
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
            border: `1px solid ${C.border}`,
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I'm switching roles
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Start with fundamentals
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
            border: `1px solid ${C.border}`,
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Just browsing
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
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
    <div style={{ background: C.bg, paddingTop: '48px', paddingBottom: '80px' }}>
      <style>{`
        @media (max-width: 768px) {
          .proof-container { padding: 0 20px !important; }
          .proof-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
      <div className="proof-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
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
        <div className="proof-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}>
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
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
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Free. No signup needed to browse.
          </p>
        </div>
      </div>
    </div>
  );

  // Coming soon section
  const ComingSoonSection = () => (
    <div style={{ background: C.bg, paddingTop: '48px', paddingBottom: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .coming-container { padding: 0 20px !important; }
        }
      `}</style>
      <div className="coming-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        textAlign: 'center',
      }}>
        {/* Section label */}
        <div style={{
          fontSize: '13px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: C.textMuted,
          fontWeight: 600,
          marginBottom: '16px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Coming soon
        </div>

        <p style={{
          fontSize: '16px',
          color: C.textSoft,
          lineHeight: 1.6,
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Software Engineering · Data Science · Product Design · Analytics
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <GuidedPathsSection />
      <ComingSoonSection />
      <ProductProofSection />
    </div>
  );
}
