import React from 'react';

const C = {
  bg: '#FAFAF8',
  text: '#1B1B18',
  textMuted: '#5C5C57',
  border: '#E8E6E1',
};

const RAINBOW = 'linear-gradient(135deg, #F472B6, #A78BFA, #60A5FA, #34D399)';

function FounderAvatar() {
  const [imageLoaded, setImageLoaded] = React.useState(true);

  return imageLoaded ? (
    <img
      src="/founder.jpg"
      alt="Shraddha Dudhgaoli"
      onError={() => setImageLoaded(false)}
      style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        objectFit: 'cover',
        objectPosition: 'center',
      }}
    />
  ) : (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1B1B18, #3a3a35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 36,
        fontWeight: 600,
        color: '#FFFFFF',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      SD
    </div>
  );
}

export default function About() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .about-container { padding: 40px 16px !important; }
          .about-header { padding-bottom: 40px !important; }
          .about-bio-section { max-width: 100% !important; margin-bottom: 40px !important; }
          .about-name { font-size: 24px !important; }
          .about-title { font-size: 14px !important; }
          .about-bio-text { font-size: 15px !important; line-height: 1.8 !important; }
          .about-numbers { padding-top: 40px !important; margin-top: 40px !important; }
          .about-links { flex-direction: column !important; gap: 16px !important; }
        }
      `}</style>

      <div className="about-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>

        {/* Header */}
        <div className="about-header" style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 48,
            fontWeight: 400,
            color: C.text,
            marginBottom: 8,
            background: RAINBOW,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            About InterviewAlpha.ai
          </h1>
          <p style={{ fontSize: 18, color: C.textMuted, marginBottom: 0 }}>
            Practice real interviews. Get real feedback. Build real confidence.
          </p>
        </div>

        {/* Founder Section */}
        <div className="about-bio-section" style={{ maxWidth: 680, margin: '0 auto 80px' }}>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <FounderAvatar />
          </div>

          {/* Name and Title */}
          <h2 className="about-name" style={{
            fontSize: 22,
            fontWeight: 600,
            color: C.text,
            textAlign: 'center',
            marginBottom: 6,
          }}>
            Shraddha Dudhgaoli
          </h2>
          <p className="about-title" style={{
            fontSize: 14,
            color: C.textMuted,
            textAlign: 'center',
            marginBottom: 32,
            fontWeight: 500,
          }}>
            Founder & Builder, InterviewAlpha.ai
          </p>

          {/* Bio Text */}
          <div className="about-bio-text" style={{ fontSize: 16, lineHeight: 1.8, color: C.text }}>
            <p style={{ marginBottom: 20 }}>
              I've spent 16 years building products, with 10 of those years deep in fintech, working across some of the most complex systems in financial services.
            </p>

            <p style={{ marginBottom: 20 }}>
              My time at Mastercard, UBS, and Western Union taught me that great products aren't won at the feature layer but at the last mile, where infrastructure, trust, and real user problems all come together to create something that actually works.
            </p>

            <p style={{ marginBottom: 20 }}>
              Over the years, I drove 5X SME acquisition growth, 40% year-over-year transaction volume increases, and GTM strategies that delivered 60% developer platform adoption in just two quarters, while simultaneously leading multi-region cloud migrations with SOC2 and ISO compliance built in from day one, reinforcing my belief that in fintech, trust isn't a feature but the entire foundation.
            </p>

            <p style={{ marginBottom: 20 }}>
              Two pivotal decisions across my career shaped how I think about AI product leadership today.
            </p>

            <p style={{ marginBottom: 20 }}>
              The first was when I noticed investment transaction data sitting in systems purely as a record-keeping ledger, and I made the call to treat it as predictive behavioral intelligence instead, which led us to build a Liquidity Stress Model that could predict when high-net-worth clients were entering spending phases, shifting advisory from reactive to proactive so the system alerted advisors before the client ever picked up the phone.
            </p>

            <p style={{ marginBottom: 20 }}>
              The second was when I saw AI being used purely as a defensive fraud shield through post-settlement batch processing, and I pushed the move to near-real-time event streaming with Kafka and Flink, adopting Federated Learning so the system could learn from transaction patterns without exposing personally identifiable information, turning Data Privacy by Design into an engineering standard rather than a compliance checkbox.
            </p>

            <p style={{ marginBottom: 20 }}>
              Those experiences planted a seed that grew into InterviewAlpha.ai, after I kept seeing thousands of talented professionals getting rejected from interviews with zero feedback, where nobody told them what went wrong and nobody helped them get better.
            </p>

            <p style={{ marginBottom: 20 }}>
              That frustration is exactly why I built InterviewAlpha.ai, an AI interviewer that does what no company will by telling you exactly where you stand, scoring you across 8 competencies, and showing you precisely what to fix so you walk into your next interview with real confidence.
            </p>

            <p style={{ marginBottom: 20 }}>
              Today InterviewAlpha.ai has thousands of expert questions spanning Product Management and Data Science, with company-specific prep for Google, Amazon, Meta, Apple, Flipkart, Razorpay, and more, while we continue expanding into Consulting, Finance, Sales and Marketing, and General Management to serve every professional preparing for their next career move.
            </p>

            <p style={{ marginBottom: 20 }}>
              I'm an AI Tinkerer and builder at heart, someone who personally tests, prompts, and stress-tests LLMs, RAG pipelines, and production AI systems before ever briefing engineers, which is why my roadmaps are always grounded in what actually works rather than vendor demos.
            </p>

            <p style={{ marginBottom: 0 }}>
              The next wave of AI won't be smarter chatbots but agentic systems that manage outcomes end to end, and InterviewAlpha.ai is built on that belief from the ground up.
            </p>
          </div>

          {/* Contact Links */}
          <div className="about-links" style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.linkedin.com/in/shraddha-d-9399ba26/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14,
                color: C.textMuted,
                textDecoration: 'none',
                transition: 'color 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              Connect on LinkedIn
            </a>
            <a
              href="mailto:communications@interviewalpha.ai"
              style={{
                fontSize: 14,
                color: C.textMuted,
                textDecoration: 'none',
                transition: 'color 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.color = C.text}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
            >
              communications@interviewalpha.ai
            </a>
          </div>
        </div>

        {/* By The Numbers */}
        <div className="about-numbers" style={{ marginTop: 80, paddingTop: 64, borderTop: `1px solid ${C.border}` }}>
          <h3 style={{
            fontSize: 28,
            fontWeight: 600,
            color: C.text,
            textAlign: 'center',
            marginBottom: 56,
            fontFamily: "'Instrument Serif', serif",
          }}>
            By The Numbers
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 40,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {[
              { label: 'Thousands of expert questions', value: '' },
              { label: 'Growing community of professionals', value: '' },
              { label: '2 roles live (PM & Data Science)', value: '' },
              { label: '10+ company-specific prep tracks', value: '' },
              { label: 'More roles coming soon', value: '' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 8,
                  fontFamily: "'Instrument Serif', serif",
                }}>
                  {item.value || '-'}
                </div>
                <p style={{ fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
