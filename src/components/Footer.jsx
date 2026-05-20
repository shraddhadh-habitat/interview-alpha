const C = {
  bg: '#1B1B18',
  link: 'rgba(255,255,255,0.5)',
  linkHover: '#FFFFFF',
  heading: 'rgba(255,255,255,0.7)',
  muted: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.1)',
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
        transition: 'color 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = C.linkHover; }}
      onMouseLeave={e => { e.currentTarget.style.color = C.link; }}
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
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'interview' }))}>
              Live AI Interview
            </FooterLink>
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'practice' }))}>
              Practice Q&A
            </FooterLink>
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'scorecard' }))}>
              Scorecard
            </FooterLink>
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'salary' }))}>
              Salary Guide
            </FooterLink>
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'upgrade' }))}>
              Upgrade to Pro
            </FooterLink>
          </div>

          {/* Col 2  . Company */}
          <div>
            <FooterHeading>Company</FooterHeading>
            <FooterLink onClick={() => window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'about' }))}>
              About
            </FooterLink>
            <FooterLink onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/';
                setTimeout(() => {
                  const section = document.getElementById('how-it-works');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }, 500);
              }
            }}>
              How it Works
            </FooterLink>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: 14,
                  color: C.link,
                  textDecoration: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Blog
              </a>
              <ComingSoon />
            </div>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: 14,
                  color: C.link,
                  textDecoration: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Careers
              </a>
              <ComingSoon />
            </div>
          </div>

          {/* Col 3  . Legal & Contact */}
          <div>
            {/* Legal sub-section */}
            <div style={{ marginBottom: 32 }}>
              <FooterHeading>Legal</FooterHeading>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
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
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.linkHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.link; }}
              >
                communications@interviewalpha.ai
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="footer-bottom" style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            © 2026 InterviewAlpha™. All rights reserved.
          </p>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
            Questions, scoring frameworks, and AI methodologies are proprietary and protected under IP law.
          </p>
        </div>
      </div>
    </footer>
  );
}
