const C = {
  bg: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.5)',
  textSoft: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)',
  green: '#FDCD34',
  greenLight: 'rgba(253, 205, 52, 0.12)',
  redWarm: '#1B1B18',
  redWarmLight: 'rgba(27, 27, 24, 0.08)',
};

const SAMPLE_PM_QUESTION = "WhatsApp has 500M users in India but makes almost no money from them. You're the PM tasked with building WhatsApp's first revenue product for India without hurting user trust or daily engagement. What do you build, how do you price it, and what's your biggest risk?";

const SAMPLE_DS_QUESTION = "Zomato notices that restaurants with 4.1 star ratings get 3x more orders than restaurants with 4.0 stars. But your analysis shows that the 4.0 rated restaurants actually have better food quality based on repeat order rates. What's happening, how would you prove it, and what would you recommend to fix the rating system?";

export default function LandingPage({ user, onNavigate, onLogin }) {
  // Hero section  . proper two-column layout with container
  const HeroSection = () => (
    <div style={{
      background: C.bg,
      paddingTop: '48px',
      paddingBottom: '48px',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr !important;
            padding: 32px 16px !important;
            gap: 32px !important;
          }
          .hero-left {
            max-width: 100% !important;
          }
          .hero-right {
            max-width: 100% !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .hero-headline { font-size: 26px !important; }
          .hero-subheadline { font-size: 15px !important; }
          .hero-cta {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
          }
        }
      `}</style>

      <div className="hero-container" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 32px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
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
            color: '#1B1B18',
            fontWeight: 700,
            marginBottom: '16px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            AI that scores your answers like a real interviewer
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
              background: 'var(--gradient-brand)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Answer your first question
          </button>

          {/* Reassurance text - hidden for logged-in users */}
          {!user && (
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginTop: '12px',
              marginBottom: '0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              textShadow: '0 0 0 #1B1B18',
            }}>
              No resume. No setup. Free. Takes 2 minutes.
            </p>
          )}

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
              fontWeight: 700,
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.text}
            onMouseLeave={e => e.currentTarget.style.color = C.textSoft}
          >
            or browse questions free
          </button>

          {/* Social proof */}
          <p style={{
            margin: '24px 0 0',
            fontSize: '0.8rem',
            color: '#9a9a9a',
            lineHeight: 1.5,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Trusted by 4,000+ PM and Data Science candidates<br/>
            preparing for Google, Amazon, Flipkart &amp; more
          </p>
        </div>

        {/* RIGHT COLUMN  . How It Works in vertical layout */}
        <div className="hero-right" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          {/* Section label */}
          <p style={{
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.72rem',
            color: '#9a9a9a',
            fontWeight: 600,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Here's what happens next
          </p>

          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              1
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Pick any question
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                1,100+ real questions across PM and Data Science — by company, role, or topic.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              2
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Answer in your own words
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                No scripts, no templates. Just your thinking — exactly like a real interview.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              3
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Get scored in seconds
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                AI scores you across 8 competencies and shows the expert version — so you know exactly what to improve.
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
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#1B1B18',
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
              color: '#1B1B18',
              marginBottom: '16px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Shrey C., Product Manager
            </p>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: '#1B1B18',
              margin: '16px 0',
            }} />

            {/* Proof line */}
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              textAlign: 'center',
              margin: 0,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
            }}>
              Thousands signed up · Google · Amazon · Meta · Flipkart prep
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Question cards section (moved from hero right column)
  const QuestionCardsSection = () => (
    <div style={{ background: C.bg, paddingTop: '24px', paddingBottom: '48px' }}>
      <style>{`
        @media (max-width: 768px) {
          .question-cards-container { padding: 0 20px !important; }
          .question-cards-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      {/* Visual connector from hero */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0 16px',
        gap: '4px',
      }}>
        <div style={{
          width: '1px',
          height: '36px',
          background: 'linear-gradient(180deg, #a78bfa 0%, transparent 100%)',
        }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3L8 13M8 13L4 9M8 13L12 9"
            stroke="#a78bfa"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="question-cards-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Card label */}
        <div className="hero-card-label" style={{
          fontSize: '11px',
          letterSpacing: '2px',
          color: '#1B1B18',
          fontWeight: 900,
          marginBottom: '24px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textShadow: '0 0 0 #1B1B18',
          textAlign: 'center',
        }}>
          Sample Questions
        </div>

        <div className="question-cards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
        }}>
          {/* Card 1 - Product Management */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Role label */}
            <div style={{
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontWeight: 700,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              padding: '4px 12px',
              borderRadius: '4px',
              display: 'inline-block',
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
            <button onClick={() => {
              localStorage.setItem('ia_sample_question', JSON.stringify({
                q: SAMPLE_PM_QUESTION,
                a: "Before diving in, I'd want to clarify a few things: Are we optimizing for revenue or user growth? What's the acceptable engagement drop threshold? Is this B2B or B2C revenue?\n\nAssuming we need B2B revenue without touching consumer experience, I'd focus on WhatsApp Business API monetization.\n\nThe core insight is that small businesses in India already use WhatsApp as their primary customer channel. 15M+ businesses use WhatsApp Business. The opportunity is charging businesses for verified accounts, automated messaging, and catalog features that drive sales.\n\nFor V1, I'd build three things: verified business profiles with a blue tick (trust signal for consumers, worth paying for by businesses), broadcast messaging for order updates and promotions (charged per message beyond a free tier), and integrated payments for in-chat purchases (take a small transaction fee).\n\nPricing: freemium model. Free for small businesses under 100 messages per day. Rs 500 per month for premium features. Transaction fee of 1% on in-chat payments.\n\nThe biggest risk is perception. If users feel WhatsApp is becoming spammy or commercial, daily engagement drops. The guardrail: users must opt-in to business messages, businesses get a spam score, and any business with high block rates gets suspended.\n\nSuccess metrics: monthly revenue per business user, business adoption rate, consumer block rate (must stay under 2%), and daily active user retention (must not drop more than 0.5%).",
                questionId: "landing-pm-sample",
                category: "Product Management"
              }));
              onNavigate('practice');
            }} style={{
              fontSize: '11px',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'var(--gradient-brand)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              fontWeight: 700,
              transition: 'opacity 0.2s',
              borderRadius: '6px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Answer this question
            </button>
          </div>

          {/* Card 2 - Data Science */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '24px',
          }}>
            {/* Role label */}
            <div style={{
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontWeight: 700,
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              padding: '4px 12px',
              borderRadius: '4px',
              display: 'inline-block',
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
            <button onClick={() => {
              localStorage.setItem('ia_sample_question', JSON.stringify({
                q: SAMPLE_DS_QUESTION,
                a: "Before diving in, I'd clarify: How are ratings calculated (simple average vs weighted)? What's the sample size difference between 4.0 and 4.1 restaurants? Is this effect consistent across cities and cuisines?\n\nThis is a classic threshold effect combined with selection bias. Here's what's likely happening: users see 4.0 as 'below 4' psychologically, creating a cliff in ordering behavior. Restaurants at 4.1 get more orders, which means more ratings, which stabilizes their score. Restaurants at 4.0 get fewer orders, fewer ratings, and their score is more volatile, one bad review can drop them to 3.9 which is catastrophic.\n\nTo prove this, I'd run three analyses. First, plot order volume against rating as a continuous variable. If there's a cliff at 4.0, that confirms the threshold effect. Second, compare repeat order rate (loyalty proxy) against rating. If 4.0 restaurants have higher repeat rates, their food is genuinely better. Third, check rating volatility. If 4.0 restaurants have fewer total ratings, their score is less reliable.\n\nMy recommendation: move from simple star ratings to a composite score that weights repeat orders, recency, and food quality signals alongside ratings. Show users 'frequently reordered' badges alongside stars. This surfaces the hidden quality signal without removing the familiar star system.\n\nKey tradeoff: changing the rating system could confuse users and upset high-rated restaurants. I'd A/B test the composite badge alongside existing stars first, not replace stars entirely.\n\nSuccess metrics: order distribution equity across rating bands, repeat order rate correlation with displayed score, and overall platform order volume.",
                questionId: "landing-ds-sample",
                category: "Data Science"
              }));
              onNavigate('practice');
            }} style={{
              fontSize: '11px',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'var(--gradient-brand)',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              fontWeight: 700,
              transition: 'opacity 0.2s',
              borderRadius: '6px',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Answer this question
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Guided paths section
  const GuidedPathsSection = () => (
    <div style={{ background: C.bg, paddingTop: '16px', paddingBottom: '48px' }}>
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
          fontWeight: 900,
          color: '#1B1B18',
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textShadow: '0 0 0 #1B1B18',
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
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
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
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I have an interview coming up
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Practice company-specific questions
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start prepping
            </button>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
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
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I want to test my skills
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Answer one question and see how you score
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Try a question
            </button>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
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
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I'm exploring new roles
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Start with fundamentals for any role
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start with basics
            </button>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
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
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Just browsing
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Thousands of questions with expert answers
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
          .proof-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .proof-grid { grid-template-columns: 1fr !important; }
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
          color: '#1B1B18',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textShadow: '0 0 0 #1B1B18',
        }}>
          What you get with every practice session
        </div>

        {/* 5 feature cards grid */}
        <div className="proof-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
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
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Practice by category
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
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
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Prep by company
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
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
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Instant scored feedback
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
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
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Expert rewrite included
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              See how a senior PM would answer the same question
            </p>
          </div>

          {/* Card 5 */}
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
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Resume Tools
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              ATS score checker and AI resume optimizer for every application
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
              background: 'var(--gradient-brand)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Answer your first question
          </button>
          {!user && (
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginTop: '12px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              textShadow: '0 0 0 #1B1B18',
            }}>
              Free. No signup needed to browse.
            </p>
          )}
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
          fontSize: '14px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#1B1B18',
          fontWeight: 900,
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
          fontWeight: 700,
        }}>
          Software Engineering · Product Design · Analytics
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <HeroSection />
      <QuestionCardsSection />
      <TrustSection />
      <GuidedPathsSection />
      <ComingSoonSection />
      <ProductProofSection />
    </div>
  );
}
