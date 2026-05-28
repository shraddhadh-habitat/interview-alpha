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

  return (
    <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @media (max-width: 768px) {
          .careers-container { padding: 0 20px !important; }
          .gains-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="careers-container" style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>

        {/* ── CAREERS PAGE ── */}

        {/* Header */}
        <p style={{
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '0.72rem',
          color: '#9a9a9a',
          fontWeight: 600,
          marginBottom: '12px'
        }}>
          We're Hiring
        </p>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
          fontWeight: 800,
          color: '#111',
          marginBottom: '12px',
          lineHeight: 1.2
        }}>
          Join InterviewAlpha
        </h1>

        <p style={{
          color: '#6b6b6b',
          fontSize: '1rem',
          lineHeight: 1.7,
          marginBottom: '48px',
          maxWidth: '560px'
        }}>
          We're building the best interview prep platform for PM and Data Science aspirants in India.
          If you want to work on something that directly helps people land their dream jobs,
          we'd love to hear from you.
        </p>

        {/* Job Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          border: '1px solid #e4e1db'
        }}>
          {/* Role header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em'
                }}>INTERNSHIP</span>
                <span style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>3 MONTHS</span>
                <span style={{
                  background: '#f5f3ff',
                  color: '#7c3aed',
                  border: '1px solid #c4b5fd',
                  borderRadius: '6px',
                  padding: '3px 12px',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>REMOTE</span>
              </div>
              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#111',
                margin: 0
              }}>
                Marketing & Sales Intern
              </h2>
            </div>
          </div>

          {/* About the role */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>About the Role</h3>
            <p style={{ color: '#6b6b6b', lineHeight: 1.7, fontSize: '0.92rem' }}>
              InterviewAlpha is growing fast and we need sharp, driven interns who can help us
              reach PM and Data Science aspirants across India. You'll work directly with the
              founder, own real campaigns, and see your work impact thousands of job seekers.
              This is not a coffee-fetching internship. You'll have real ownership and real results
              to show on your resume.
            </p>
          </div>

          {/* What you'll do */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>What You'll Do</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Drive awareness of InterviewAlpha through college communities, LinkedIn, and WhatsApp groups',
                'Identify and reach out to PM and DS aspirants through campus networks and online communities',
                'Represent InterviewAlpha at campus events, webinars, and placement preparation groups',
                'Create and distribute content (posts, reels, stories) that resonates with job seekers',
                'Build relationships with placement cells, student clubs, and career counselors',
                'Track and report on outreach metrics: signups, conversions, engagement',
                'Gather user feedback and share insights with the product team',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a8e6cf, #a78bfa)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>{i + 1}</span>
                  <p style={{ color: '#6b6b6b', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Who we're looking for */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>Who We're Looking For</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                '✅ Final year BE / B.Tech or MBA student (campus placement season experience is a plus)',
                '✅ Strong communicator. Comfortable talking to people, online and offline',
                '✅ Self-starter who doesn\'t need to be told what to do every day',
                '✅ Genuinely interested in careers, hiring, and helping people succeed',
                '✅ Active on LinkedIn or other social platforms',
                '✅ Bonus: You\'ve personally prepared for interviews and know the struggle firsthand',
              ].map((item, i) => (
                <p key={i} style={{
                  color: '#6b6b6b',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  margin: 0,
                  padding: '8px 12px',
                  background: '#fafafa',
                  borderRadius: '8px'
                }}>{item}</p>
              ))}
            </div>
          </div>

          {/* What you'll gain */}
          <div style={{ marginBottom: '36px' }}>
            <h3 style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#111',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>What You'll Gain</h3>
            <div className="gains-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              {[
                { icon: '📜', text: 'Official internship certificate' },
                { icon: '🚀', text: 'Real ownership, not busywork' },
                { icon: '🤝', text: 'Direct mentorship from founder' },
                { icon: '📊', text: 'Measurable results for your resume' },
                { icon: '🌐', text: 'Letter of recommendation' },
                { icon: '🎯', text: 'Access to all InterviewAlpha Pro features' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  background: '#fafafa',
                  borderRadius: '8px',
                  padding: '10px 12px'
                }}>
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  <p style={{ fontSize: '0.82rem', color: '#6b6b6b', margin: 0, fontWeight: 500 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Apply CTA */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(168,230,207,0.1), rgba(167,139,250,0.1))',
            border: '1.5px solid rgba(167,139,250,0.2)',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <p style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: '#111',
              marginBottom: '6px'
            }}>
              Ready to apply?
            </p>
            <p style={{
              color: '#6b6b6b',
              fontSize: '0.85rem',
              marginBottom: '20px'
            }}>
              Send your resume and a 2-line note on why you're the right fit.
            </p>
            <a
              href="mailto:shraddhadh@gmail.com?subject=Application: Marketing and Sales Intern - InterviewAlpha&body=Hi Shraddha,%0A%0AI'm applying for the Marketing and Sales Intern role at InterviewAlpha.%0A%0AAbout me:%0A%0AWhy I'm a good fit:%0A%0AResume attached."
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '12px',
                padding: '14px 32px',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              Apply Now - Email Us →
            </a>
            <p style={{
              fontSize: '0.75rem',
              color: '#9a9a9a',
              marginTop: '12px'
            }}>
              shraddhadh@gmail.com · We respond within 48 hours
            </p>
          </div>
        </div>

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
