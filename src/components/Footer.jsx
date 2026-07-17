import { useAuth } from '../contexts/AuthContext';

const C = {
  bg: '#f0ede8',
  link: '#3d3d3d',
  linkHover: 'var(--gradient-brand)',
  heading: '#111111',
  muted: '#6b6b6b',
  border: '#e8e6e1',
};

function FooterLink({ children, onClick, href, email = false }) {
  const navigate = (tabId) => {
    window.dispatchEvent(new CustomEvent('ia:navigate', { detail: tabId }));
  };

  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        else if (href) window.location.href = href;
      }}
      style={{
        fontSize: 14,
        color: C.link,
        textDecoration: 'none',
        display: 'block',
        marginBottom: 12,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--gradient-brand)';
        e.currentTarget.style.backgroundClip = 'text';
        e.currentTarget.style.WebkitBackgroundClip = 'text';
        e.currentTarget.style.WebkitTextFillColor = 'transparent';
        e.currentTarget.style.color = 'transparent';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = C.link;
        e.currentTarget.style.background = 'none';
        e.currentTarget.style.backgroundClip = 'unset';
        e.currentTarget.style.WebkitBackgroundClip = 'unset';
        e.currentTarget.style.WebkitTextFillColor = 'unset';
      }}
    >
      {children}
    </a>
  );
}

function FooterHeading({ children }) {
  return (
    <div style={{
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: C.heading,
      marginBottom: 18,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {children}
    </div>
  );
}

function ComingSoon() {
  return (
    <span style={{ fontSize: 11, color: C.muted, marginLeft: 6 }}>
      (Coming Soon)
    </span>
  );
}

export default function Footer() {
  const { requireAuth } = useAuth();

  return (
    <footer style={{ background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.link }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 48px !important; text-align: center !important; }
          .footer-bottom { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
        }
      `}</style>

      {/* Main content */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 80 }}>

          {/* Col 1  . Product */}
          <div>
            <FooterHeading>Product</FooterHeading>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'interview' })); }}>
              Live AI Interview
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' })); }}>
              Practice Q&A
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'scorecard' })); }}>
              My Progress
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'resume-tools' })); }}>
              Resume Tools
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'salary' })); }}>
              Salary Guide
            </FooterLink>
            <FooterLink onClick={() => {
              window.scrollTo(0, 0);
              requireAuth('Sign up to upgrade your plan', () => {
                window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'upgrade' }));
              });
            }}>
              Upgrade to Pro
            </FooterLink>
          </div>

          {/* Col 2  . Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'about' })); }}>
              About
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'leadership' })); }}>
              Leadership
            </FooterLink>
            <FooterLink onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.location.href = '/';
                setTimeout(() => {
                  const section = document.getElementById('how-it-works');
                  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 800);
              }
            }}>
              How it Works
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'blog' })); }}>
              Blog
            </FooterLink>
            <FooterLink onClick={() => { window.scrollTo(0, 0); window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'careers' })); }}>
              Careers
            </FooterLink>
          </div>

          {/* Col 3  . Legal & Contact */}
          <div>
            {/* Legal sub-section */}
            <div style={{ marginBottom: 32 }}>
              <FooterHeading>Legal</FooterHeading>
              <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'terms' }))}>
                Terms of Service
              </FooterLink>
              <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'privacy' }))}>
                Privacy Policy
              </FooterLink>
            </div>

            {/* Contact sub-section */}
            <div>
              <FooterHeading>Contact</FooterHeading>
              <a
                href="mailto:communications@interviewalpha.ai"
                style={{
                  fontSize: 14,
                  color: C.link,
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: 12,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--gradient-brand)';
                  e.currentTarget.style.backgroundClip = 'text';
                  e.currentTarget.style.WebkitBackgroundClip = 'text';
                  e.currentTarget.style.WebkitTextFillColor = 'transparent';
                  e.currentTarget.style.color = 'transparent';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = C.link;
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.backgroundClip = 'unset';
                  e.currentTarget.style.WebkitBackgroundClip = 'unset';
                  e.currentTarget.style.WebkitTextFillColor = 'unset';
                }}
              >
                communications@interviewalpha.ai
              </a>
              <a
                href="https://www.linkedin.com/in/shraddha-d-9399ba26"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: C.link,
                  textDecoration: 'none',
                  display: 'block',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--gradient-brand)';
                  e.currentTarget.style.backgroundClip = 'text';
                  e.currentTarget.style.WebkitBackgroundClip = 'text';
                  e.currentTarget.style.WebkitTextFillColor = 'transparent';
                  e.currentTarget.style.color = 'transparent';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = C.link;
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.backgroundClip = 'unset';
                  e.currentTarget.style.WebkitBackgroundClip = 'unset';
                  e.currentTarget.style.WebkitTextFillColor = 'unset';
                }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="footer-bottom" style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            © 2026 InterviewAlpha.ai™. All rights reserved.
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
            Questions, scoring frameworks, and AI methodologies are proprietary and protected under IP law.
          </p>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '16px 24px',
          borderTop: '1px solid rgba(27,27,24,0.08)',
          fontSize: 11,
          color: 'rgba(27,27,24,0.4)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.6,
        }}>
          InterviewAlpha is an independent interview preparation platform and is not affiliated with, endorsed by, or connected to any companies mentioned in practice questions.
        </div>
      </div>
    </footer>
  );
}
