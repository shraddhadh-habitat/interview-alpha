const C = {
  bg: '#FAFAF8',
  bgCard: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.1)',
  yellow: '#FDCD34',
};

const NAV_H = 60;

const templates = [
  {
    name: 'Clean Professional',
    bestFor: 'Experienced professionals, 5+ years',
    features: 'Minimal design, clear hierarchy, ATS-optimized',
    sections: ['Summary', 'Experience', 'Skills', 'Education'],
  },
  {
    name: 'Fresh Graduate',
    bestFor: 'Entry-level, internships, campus placements',
    features: 'Projects and education highlighted, skills-first layout',
    sections: ['Education', 'Projects', 'Skills', 'Experience', 'Activities'],
  },
  {
    name: 'Tech / Data Science',
    bestFor: 'Engineers, data scientists, analysts',
    features: 'Technical skills section, project-focused, GitHub/portfolio links',
    sections: ['Skills', 'Experience', 'Projects', 'Education', 'Certifications'],
  },
  {
    name: 'Product Manager',
    bestFor: 'PM roles at startups and enterprises',
    features: 'Impact-driven bullets, metrics-heavy, cross-functional experience',
    sections: ['Summary', 'Experience', 'Key Projects', 'Skills', 'Education'],
  },
  {
    name: 'Consulting / Finance',
    bestFor: 'MBB, Big 4, investment banking',
    features: 'Achievement-focused, structured format, leadership emphasis',
    sections: ['Education', 'Experience', 'Leadership', 'Skills', 'Interests'],
  },
  {
    name: 'Career Switcher',
    bestFor: 'Changing industries or roles',
    features: 'Transferable skills highlighted, functional layout',
    sections: ['Summary', 'Relevant Skills', 'Experience', 'Education'],
  },
];

const tips = [
  'Keep it to one page unless you have 10+ years of experience',
  'Start every bullet point with an action verb and include a number',
  'Remove "References available upon request" - it wastes space',
  'Use a standard font: Calibri, Arial, or Garamond at 10-11pt',
  'Save as PDF unless the application specifically asks for DOCX',
];

export default function ResumeTemplates({ hideAtsButton = false }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.text,
      paddingTop: NAV_H,
      boxSizing: 'border-box',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .templates-container { padding: 24px 16px !important; }
          .templates-hero { padding: 32px 16px !important; }
          .templates-grid { grid-template-columns: 1fr !important; }
          .template-button { min-height: 44px !important; }
        }
        @media (max-width: 1024px) {
          .templates-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="templates-hero" style={{ width: '100%', background: C.bgCard, padding: '48px 28px', borderBottom: `1px solid ${C.border}`, boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', textAlign: 'center', boxSizing: 'border-box' }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            color: C.text,
          }}>
            Resume Templates
          </h1>
          <p style={{
            fontSize: 16,
            color: C.textMuted,
            marginBottom: 0,
            lineHeight: 1.6,
            maxWidth: 600,
            margin: '0 auto',
          }}>
            Professional, ATS-friendly resume templates. Download, fill in your details, and apply.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-container" style={{ width: '100%', maxWidth: 1080, margin: '0 auto', paddingTop: '24px', paddingBottom: '48px', paddingLeft: '28px', paddingRight: '28px', boxSizing: 'border-box' }}>
        <div className="templates-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          marginBottom: 64,
        }}>
          {templates.map((template, idx) => (
            <div key={idx} style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: 24,
            }}>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                marginBottom: 12,
                margin: '0 0 12px 0',
              }}>
                {template.name}
              </h3>

              <span style={{
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '3px 12px',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                {template.bestFor}
              </span>

              <p style={{
                fontSize: 13,
                color: C.textMuted,
                marginBottom: 12,
                lineHeight: 1.6,
                margin: '12px 0',
              }}>
                {template.features}
              </p>

              <div style={{ marginBottom: 16 }}>
                <p style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textMuted,
                  marginBottom: 8,
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}>
                  Sections
                </p>
                <p style={{
                  fontSize: 13,
                  color: C.text,
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {template.sections.join(', ')}
                </p>
              </div>

              <div style={{ width: '100%' }}>
                <a
                  className="template-button"
                  href={`mailto:communications@interviewalpha.ai?subject=Request Template: ${template.name}`}
                  style={{
                    background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    width: '100%',
                    padding: '12px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Request Template
                </a>
                <p style={{
                  fontSize: 12,
                  color: C.textMuted,
                  marginTop: 8,
                  marginBottom: 0,
                  textAlign: 'center',
                }}>
                  We'll email it to you within 24 hours
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p style={{
          fontSize: 12,
          color: C.textMuted,
          textAlign: 'center',
          marginBottom: 64,
        }}>
          Templates are in DOCX format, compatible with Microsoft Word and Google Docs.
        </p>

        {/* Tips Section */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            color: C.text,
            marginBottom: 28,
            textAlign: 'center',
            margin: '0 0 28px 0',
          }}>
            Resume Tips from Hiring Managers
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 16,
            maxWidth: 600,
            margin: '0 auto',
          }}>
            {tips.map((tip, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: 16,
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>
                <p style={{
                  fontSize: 14,
                  color: C.text,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!hideAtsButton && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'resume-tools' }))}
              style={{
                padding: '14px 32px',
                height: 44,
                background: C.yellow,
                color: C.text,
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(253, 205, 52, 0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Check if your resume passes ATS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
