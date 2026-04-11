const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';

const C = {
  bg: '#0A0A0A',
  bgSoft: '#242420',
  text: '#FAFAF8',
  textMuted: '#9C9C97',
  border: 'rgba(255,255,255,0.08)',
  green: '#16A34A',
};

function FooterLink({ children, href = '#', email = false }) {
  return (
    <a
      href={href}
      style={{ fontSize: 13, color: C.textMuted, textDecoration: 'none', display: 'block', marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.color = email ? C.green : C.text; }}
      onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", color: C.text }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>

      {/* Main content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 28px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 48 }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{
              fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 400,
              marginBottom: 14,
              background: RAINBOW, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'inline-block',
            }}>
              InterviewAlpha™
            </div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.75, marginBottom: 20, maxWidth: 260 }}>
              AI-powered PM interview preparation. Practice with a real-time interviewer, get scored, and level up.
            </p>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              3 free sessions — no credit card required.
            </div>
          </div>

          {/* Col 2 — Product */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 18 }}>Product</div>
            <FooterLink>Live AI Interview</FooterLink>
            <FooterLink>Practice Q&amp;A</FooterLink>
            <FooterLink>Scorecard</FooterLink>
            <FooterLink>Salary Guide</FooterLink>
            <FooterLink>Upgrade to Pro</FooterLink>
          </div>

          {/* Col 3 — Legal & Contact */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 18 }}>Legal &amp; Contact</div>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink href="mailto:shraddhadh@gmail.com" email>shraddhadh@gmail.com</FooterLink>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
            © 2026 InterviewAlpha™. All rights reserved. Questions, scoring frameworks, and AI methodologies are proprietary and protected under IP law.
          </p>
          <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
            Made with ♥ for PM candidates.
          </p>
        </div>
      </div>
    </footer>
  );
}
