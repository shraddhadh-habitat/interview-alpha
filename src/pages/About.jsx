import React from 'react';

const C = {
  bg: '#FAFAF8',
  text: '#1B1B18',
  textMuted: '#5C5C57',
  border: '#E8E6E1',
};

const RAINBOW = 'var(--gradient-brand)';

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
              Every year, thousands of talented professionals walk into interviews they should ace and walk out empty-handed.
            </p>

            <p style={{ marginBottom: 20 }}>
              Not because they weren't smart enough. Not because they didn't work hard enough. But because nobody ever told them where they actually stood.
            </p>

            <p style={{ marginBottom: 20 }}>
              They read the frameworks, they watched the videos, they studied the theory, and then they sat across from an interviewer and blanked.
            </p>

            <p style={{ marginBottom: 20 }}>
              That moment of silence is not a talent problem; it is a practice problem.
            </p>

            <p style={{ marginBottom: 20 }}>
              InterviewAlpha exists to solve it.
            </p>

            <p style={{ marginBottom: 20 }}>
              We built a platform where you practice the way interviews actually feel, under pressure, on the spot, with no script. You answer real PM, Data Science, and Consulting questions by voice or text. Our AI scores you instantly across 8 competencies. You see exactly where you fell short and how a stronger answer would have sounded.
            </p>

            <p style={{ marginBottom: 20 }}>
              No guessing. No generic feedback. No waiting weeks to hear back just to get a rejection with zero context.
            </p>

            <p style={{ marginBottom: 20 }}>
              Only honest, instant, expert-level feedback every single time.
            </p>

            <p style={{ marginBottom: 0 }}>
              The difference between the candidate who gets the offer and the one who doesn't is rarely talent. It's preparation. And preparation only works when it's real.
            </p>
          </div>
        </div>

        {/* SECTION 2: By The Numbers */}
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
              { label: 'Expert Questions', value: '10,000+' },
              { label: 'Professionals Onboarded', value: '2,000+' },
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
      </div>
    </div>
  );
}
