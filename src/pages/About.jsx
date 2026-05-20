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
          .about-container { padding: 32px 20px !important; }
          .about-bio-section { max-width: 100% !important; }
          .about-name { font-size: 20px !important; }
          .about-title { font-size: 13px !important; }
          .about-bio-text { font-size: 14px !important; }
        }
      `}</style>

      <div className="about-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
            About InterviewAlpha
          </h1>
          <p style={{ fontSize: 18, color: C.textMuted, marginBottom: 0 }}>
            Built by someone who got rejected without feedback. Now fixing that for everyone.
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
            Founder & Builder, InterviewAlpha
          </p>

          {/* Bio Text */}
          <div className="about-bio-text" style={{ fontSize: 16, lineHeight: 1.8, color: C.text }}>
            <p style={{ marginBottom: 20 }}>
              16 years in product. 10 in fintech. All of it in the deep end.
            </p>

            <p style={{ marginBottom: 20 }}>
              At Mastercard, UBS, and Western Union, I learned that great products aren't won at the feature layer — they're won at the last mile where infrastructure, trust, and real user problems intersect.
            </p>

            <p style={{ marginBottom: 20 }}>
              I've driven 5X SME acquisition growth, 40% YoY transaction volume increases, and GTM strategies that delivered 60% developer platform adoption in two quarters. I've led multi-region cloud migrations with SOC2 and ISO compliance built in — because in fintech, trust isn't a feature, it's the foundation.
            </p>

            <p style={{ marginBottom: 20 }}>
              <strong>Two decisions shaped how I think about AI product leadership.</strong>
            </p>

            <p style={{ marginBottom: 20 }}>
              First: investment transaction data was being treated as a record-keeping ledger. I made the call to treat it as predictive behavioral intelligence. We built a Liquidity Stress Model to predict when high-net-worth clients were entering spending phases. Advisory shifted from reactive to proactive — the system alerted advisors before the client called.
            </p>

            <p style={{ marginBottom: 20 }}>
              Second: AI was being used purely as a defensive fraud shield — post-settlement, batch processing. I pushed the move to near-real-time event streaming with Kafka and Flink, adopting Federated Learning so the system learned from transaction patterns without exposing personally identifiable information. Data Privacy by Design became engineering SOP — not a compliance checkbox.
            </p>

            <p style={{ marginBottom: 20 }}>
              These experiences are why InterviewAlpha exists. I saw thousands of talented professionals getting rejected from interviews with zero feedback. No one told them what they did wrong. No one helped them improve.
            </p>

            <p style={{ marginBottom: 20 }}>
              So I built it. An AI interviewer that does what no company will — tells you exactly where you stand, scores you across 8 competencies, and shows you what to fix.
            </p>

            <p style={{ marginBottom: 20 }}>
              Today InterviewAlpha has thousands of expert questions across Product Management and Data Science, with company-specific prep for Google, Amazon, Meta, Apple, Flipkart, Razorpay, and more. We're expanding to Consulting, Finance, Sales & Marketing, and General Management.
            </p>

            <p style={{ marginBottom: 20 }}>
              I'm an AI Tinkerer — I personally test, prompt, and stress-test LLMs, RAG pipelines, and production AI systems before briefing engineers. My roadmaps are grounded in reality, not vendor demos.
            </p>

            <p style={{ marginBottom: 0 }}>
              The next wave of AI won't be smarter chatbots. It will be agentic systems that manage outcomes end to end. InterviewAlpha is built on that belief.
            </p>
          </div>

          {/* Contact Links */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              Connect on LinkedIn →
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
        <div style={{ marginTop: 80, paddingTop: 64, borderTop: `1px solid ${C.border}` }}>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
                  {item.value || '→'}
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
