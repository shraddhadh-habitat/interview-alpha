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

export default function LandingPage({ user, onNavigate, onLogin }) {
  // Hero section  . proper two-column layout with container
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
          .hero-container {
            padding: 0 20px !important;
            flex-direction: column !important;
            gap: 24px !important;
          }
          .hero-left {
            flex: 1 !important;
            max-width: 100% !important;
          }
          .hero-right {
            flex: 1 !important;
            max-width: 100% !important;
            width: 100% !important;
            margin-top: 0 !important;
          }
          .hero-headline { font-size: 26px !important; }
          .hero-subheadline { font-size: 15px !important; }
          .hero-cta {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
          }
          .hero-card-label {
            font-size: 10px !important;
            letter-spacing: 1px !important;
          }
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
        {/* LEFT COLUMN  . 55% */}
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
            Practice real interview questions. See what worked, what didn't, and how to improve in under 2 minutes.
          </p>

          {/* Primary CTA  . inline-block, not full width */}
          <button
            className="hero-cta"
            onClick={() => onNavigate('practice')}
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
            Answer your first question
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
            onClick={() => onNavigate('practice')}
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
            or browse questions free
          </button>
        </div>

        {/* RIGHT COLUMN  . 45% */}
        <div className="hero-right" style={{
          flex: '0 0 45%',
          maxWidth: '340px',
        }}>
          {/* Card label */}
          <div className="hero-card-label" style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: C.textMuted,
            fontWeight: 600,
            marginBottom: '12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Sample Questions
          </div>

          {/* Card 1 - Product Management */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '12px',
          }}>
            {/* Role label */}
            <div style={{
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: C.green,
              fontWeight: 700,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Product Management
            </div>
            {/* Question */}
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '12px',
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 12px 0',
            }}>
              WhatsApp has 500M users in India but makes almost no money from them. You're the PM tasked with building WhatsApp's first revenue product for India without hurting user trust or daily engagement. What do you build, how do you price it, and what's your biggest risk?
            </p>
            <div style={{
              fontSize: '11px',
              color: C.textMuted,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Tap to answer →
            </div>
          </div>

          {/* Card 2 - Data Science */}
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Role label */}
            <div style={{
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: C.green,
              fontWeight: 700,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Data Science
            </div>
            {/* Question */}
            <p style={{
              fontSize: '13px',
              fontWeight: 600,
              color: C.text,
              marginBottom: '12px',
              lineHeight: 1.6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 12px 0',
            }}>
              Zomato notices that restaurants with 4.1 star ratings get 3x more orders than restaurants with 4.0 stars. But your analysis shows that the 4.0 rated restaurants actually have better food quality based on repeat order rates. What's happening, how would you prove it, and what would you recommend to fix the rating system?
            </p>
            <div style={{
              fontSize: '11px',
              color: C.textMuted,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Tap to answer →
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
              Shrey C., Product Manager
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
    <div id="how-it-works" style={{ background: C.bg, paddingTop: '48px', paddingBottom: '48px' }}>
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
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Start prepping
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
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Try a question
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
              I'm exploring new roles
            </h3>
            <p style={{
              fontSize: '13px',
              color: C.textSoft,
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Start with fundamentals for any role
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Start with basics
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
              Thousands of questions with expert answers
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: `0.5px solid ${C.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              color: C.text,
              background: 'none',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              Browse questions
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
            onClick={() => onNavigate('practice')}
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
            Answer your first question
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
          Software Engineering · Product Design · Analytics
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
