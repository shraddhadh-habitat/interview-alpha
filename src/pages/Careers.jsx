import { useEffect } from 'react';

const C = {
  bg: '#FAFAF8',
  text: '#1B1B18',
  textSoft: '#5C5C57',
  textMuted: '#9C9C97',
  border: '#E8E6E1',
  green: '#16A34A',
};

export default function Careers() {
  useEffect(() => {
    document.title = 'Careers | Join InterviewAlpha.ai';
    return () => { document.title = 'Interview Preparation Questions & Answers | InterviewAlpha.ai™'; };
  }, []);

  const handleApplyMarketing = () => {
    window.location.href = 'mailto:communications@interviewalpha.ai?subject=Marketing%20Intern%20Application%20-%20InterviewAlpha.ai';
  };

  const handleApplyGeneral = () => {
    window.location.href = 'mailto:communications@interviewalpha.ai?subject=General%20Application%20-%20InterviewAlpha.ai';
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .careers-container { padding: 0 20px !important; }
          .why-join-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 28px !important; }
        }
      `}</style>

      <div className="careers-container" style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>

        {/* ─── HERO SECTION ─── */}
        <div style={{ marginBottom: 80, textAlign: 'center' }}>
          <h1 className="hero-title" style={{
            fontSize: 32,
            fontWeight: 700,
            color: C.text,
            marginBottom: 16,
            fontFamily: "'Instrument Serif', serif",
            lineHeight: 1.2,
          }}>
            Join InterviewAlpha.ai
          </h1>
          <p style={{
            fontSize: 16,
            color: C.textSoft,
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            We're building the future of interview preparation. Join us.
          </p>
        </div>

        {/* ─── WHY JOIN US SECTION ─── */}
        <div style={{ marginBottom: 80 }}>
          <div className="why-join-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}>
            {[
              {
                title: 'Early stage, real impact',
                text: 'Every feature you ship reaches users directly. No layers of bureaucracy.',
              },
              {
                title: 'Learn by building',
                text: 'Work alongside the founder on product, growth, and AI. Perfect for your resume and your skills.',
              },
              {
                title: 'Remote friendly',
                text: 'Work from anywhere in India. We care about output, not office hours.',
              },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff',
                border: `0.5px solid ${C.border}`,
                borderRadius: 16,
                padding: 24,
              }}>
                <h3 style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 12,
                  fontFamily: "'Instrument Serif', serif",
                  margin: '0 0 12px 0',
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: C.textSoft,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── OPEN POSITIONS SECTION ─── */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 500,
            color: C.text,
            marginBottom: 32,
            fontFamily: "'Instrument Serif', serif",
            margin: '0 0 32px 0',
          }}>
            Open Positions
          </h2>

          {/* Marketing Intern Position */}
          <div style={{
            background: '#fff',
            border: `0.5px solid ${C.border}`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: 8,
                fontFamily: "'Instrument Serif', serif",
                margin: '0 0 8px 0',
              }}>
                Marketing Intern
              </h3>
              <p style={{
                fontSize: 13,
                color: C.textMuted,
                margin: 0,
                marginBottom: 12,
              }}>
                Internship · Remote · 3-6 months
              </p>
              <p style={{
                fontSize: 13,
                color: C.textSoft,
                lineHeight: 1.6,
                margin: 0,
              }}>
                We're looking for a hungry, creative marketing intern to help InterviewAlpha.ai reach thousands of aspiring professionals preparing for their dream roles.
              </p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 10px 0',
              }}>
                Key Responsibilities
              </h4>
              <ul style={{
                fontSize: 13,
                color: C.textSoft,
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: 20,
              }}>
                <li>Manage and grow InterviewAlpha.ai's LinkedIn, Twitter, and Instagram presence</li>
                <li>Create engaging content around interview tips, career advice, and product updates</li>
                <li>Run outreach campaigns to PM, Data Science, and MBA communities</li>
                <li>Track and report on content performance and user acquisition metrics</li>
                <li>Collaborate with the founder on growth experiments and partnerships</li>
                <li>Engage with users, gather feedback, and share insights with the product team</li>
              </ul>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 10px 0',
              }}>
                What We're Looking For
              </h4>
              <ul style={{
                fontSize: 13,
                color: C.textSoft,
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: 20,
              }}>
                <li>Currently pursuing or recently completed MBA, marketing, or communications degree</li>
                <li>Strong written communication skills</li>
                <li>Familiarity with LinkedIn, Instagram, and content marketing</li>
                <li>Self-starter who can work independently with minimal supervision</li>
                <li><strong>Bonus:</strong> experience with SEO, email marketing, or community building</li>
                <li><strong>Bonus:</strong> personal interest in career development, interviewing, or edtech</li>
              </ul>
            </div>

            <div style={{ marginBottom: 20, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
              <p style={{
                fontSize: 13,
                color: C.textSoft,
                margin: 0,
              }}>
                <strong>Stipend:</strong> Performance-based stipend + pre-placement opportunity for exceptional candidates
              </p>
            </div>

            <button
              onClick={handleApplyMarketing}
              style={{
                height: 44,
                padding: '0 28px',
                background: C.text,
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2A2A24'}
              onMouseLeave={e => e.currentTarget.style.background = C.text}
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* ─── NO OPEN ROLES SECTION ─── */}
        <div style={{
          background: '#fff',
          border: `0.5px solid ${C.border}`,
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
        }}>
          <h3 style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
            fontFamily: "'Instrument Serif', serif",
            margin: '0 0 12px 0',
          }}>
            No open roles that fit?
          </h3>
          <p style={{
            fontSize: 13,
            color: C.textSoft,
            lineHeight: 1.6,
            marginBottom: 16,
            margin: '0 0 16px 0',
          }}>
            We're always looking for talented people. Send your resume and a note about why you want to join.
          </p>
          <button
            onClick={handleApplyGeneral}
            style={{
              fontSize: 13,
              color: C.text,
              background: 'none',
              border: `0.5px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            Send us your resume
          </button>
        </div>

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
