import React from 'react';

const C = {
  bg: '#FAFAF8',
  text: '#1B1B18',
  textMuted: '#5C5C57',
  border: '#E8E6E1',
};

const RAINBOW = 'var(--gradient-brand)';

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
    <div style={{ width: '100%', minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text, boxSizing: 'border-box', overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .about-container { padding: 32px 16px !important; }
          .about-header { padding-bottom: 24px !important; margin-bottom: 32px !important; }
          .about-header h1 { font-size: 24px !important; }
          .about-header p { font-size: 14px !important; }
          .about-bio-section { max-width: 100% !important; margin-bottom: 40px !important; }
          .about-name { font-size: 20px !important; }
          .about-title { font-size: 12px !important; }
          .about-bio-text { font-size: 14px !important; line-height: 1.7 !important; }
          .about-bio-text p { word-break: break-word !important; }
          .about-numbers { padding-top: 32px !important; margin-top: 32px !important; }
          .about-links { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      <div className="about-container" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '80px 40px', boxSizing: 'border-box' }}>

        {/* SECTION 1: Company Story */}
        <div className="about-header" style={{ textAlign: 'center', marginBottom: 64, width: '100%' }}>
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
            Practice real interviews. Get real feedback. Build real confidence.
          </p>
        </div>

        <div className="about-bio-section" style={{ width: '100%', maxWidth: 680, margin: '0 auto 80px', boxSizing: 'border-box' }}>
          <div className="about-bio-text" style={{ width: '100%', fontSize: 16, lineHeight: 1.8, color: C.text, boxSizing: 'border-box', wordBreak: 'break-word' }}>
            <p style={{ marginBottom: 20 }}>
              InterviewAlpha was built for one reason: too many talented professionals were losing opportunities not because they lacked ability, but because they never got the chance to practice with real feedback before the interview that actually mattered.
            </p>

            <p style={{ marginBottom: 20 }}>
              Most candidates prepare by reading frameworks and watching videos. But reading about interviews and actually performing in one are two completely different things. InterviewAlpha closes that gap.
            </p>

            <p style={{ marginBottom: 20 }}>
              We give you a real interview question. You answer it by voice or text. Our AI scores you instantly across 8 competencies and shows you exactly how a stronger answer would have looked.
            </p>

            <p style={{ marginBottom: 0 }}>
              Built for PM, Data Science, and Consulting candidates preparing for roles at top companies and IIM placements, InterviewAlpha combines thousands of expert questions with instant AI feedback to help you walk into every interview knowing exactly where you stand.
            </p>
          </div>
        </div>

        {/* SECTION 2: By The Numbers */}
        <div className="about-numbers" style={{ marginTop: 80, paddingTop: 64, borderTop: `1px solid ${C.border}`, marginBottom: 80 }}>
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
              { label: 'Expert Questions', value: '1,100+' },
              { label: 'Professionals Onboarded', value: '230+' },
              { label: 'Tracks Live', value: '3' },
              { label: 'Company-Specific Prep Tracks', value: '10+' },
              { label: 'Competencies Scored', value: '8' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: 8,
                  fontFamily: "'Instrument Serif', serif",
                }}>
                  {item.value}
                </div>
                <p style={{ fontSize: 14, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Leadership */}
        <div style={{ width: '100%', paddingTop: 64, borderTop: `1px solid ${C.border}` }}>
          <div style={{ textAlign: 'center', marginBottom: 64, width: '100%' }}>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 36,
              fontWeight: 400,
              color: C.text,
              marginBottom: 8,
            }}>
              Leadership
            </h2>
            <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 0 }}>
              The team behind InterviewAlpha
            </p>
          </div>

          <div className="about-bio-section" style={{ width: '100%', maxWidth: 680, margin: '0 auto', boxSizing: 'border-box' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <FounderAvatar />
            </div>

            {/* Name and Title */}
            <h3 className="about-name" style={{
              fontSize: 22,
              fontWeight: 600,
              color: C.text,
              textAlign: 'center',
              marginBottom: 6,
            }}>
              Shraddha Dudhgaoli
            </h3>
            <p className="about-title" style={{
              fontSize: 14,
              color: C.textMuted,
              textAlign: 'center',
              marginBottom: 32,
              fontWeight: 500,
            }}>
              Founder and AI Product Manager
            </p>

            {/* Bio Text */}
            <div className="about-bio-text" style={{ width: '100%', fontSize: 16, lineHeight: 1.8, color: C.text, boxSizing: 'border-box', wordBreak: 'break-word' }}>
              <p style={{ marginBottom: 0 }}>
                Shraddha brings 16 years of product leadership from Mastercard, Western Union, and UBS. She built InterviewAlpha after seeing thousands of strong candidates lose out in interviews not from lack of ability but from lack of real practice with real feedback. She holds an MBA from MIT Pune and is certified in Azure AI and Data Engineering.
              </p>
            </div>

            {/* Contact Links */}
            <div className="about-links" style={{ width: '100%', marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', boxSizing: 'border-box' }}>
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
        </div>
      </div>
    </div>
  );
}
