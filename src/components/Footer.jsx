export default function Footer() {
  return (
    <footer style={{
      background: '#F5F3EF',
      borderTop: '1px solid #E8E6E1',
      padding: '32px 28px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <p style={{ fontSize: 12, color: '#5C5C57', margin: '0 0 10px', letterSpacing: 0.3 }}>
          © 2026 InterviewAlpha™. All rights reserved.
        </p>
        <p style={{ fontSize: 11, color: '#5C5C57', lineHeight: 1.75, margin: '0 0 10px', letterSpacing: 0.2 }}>
          InterviewAlpha, the InterviewAlpha logo, 'Alpha your Interview Assistant', 'PM Prep Supercharged', and the IA logo are trademarks of Shraddha Dudhgaoli.
        </p>
        <p style={{ fontSize: 11, color: '#5C5C57', lineHeight: 1.75, margin: '0 0 22px', letterSpacing: 0.2, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          The content, questions, answers, scoring frameworks, and AI evaluation methodologies on this platform are proprietary and protected under intellectual property laws. Unauthorized reproduction, distribution, or commercial use of any material from this website is strictly prohibited.
        </p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#" style={{ fontSize: 12, color: '#9C9C97', textDecoration: 'none', letterSpacing: 0.5 }}
            onMouseEnter={e => e.currentTarget.style.color = '#E8650A'}
            onMouseLeave={e => e.currentTarget.style.color = '#9C9C97'}
          >Terms of Service</a>
          <span style={{ color: '#CCCCCC', fontSize: 11 }}>|</span>
          <a href="#" style={{ fontSize: 12, color: '#9C9C97', textDecoration: 'none', letterSpacing: 0.5 }}
            onMouseEnter={e => e.currentTarget.style.color = '#E8650A'}
            onMouseLeave={e => e.currentTarget.style.color = '#9C9C97'}
          >Privacy Policy</a>
          <span style={{ color: '#CCCCCC', fontSize: 11 }}>|</span>
          <a href="mailto:shraddhadh@gmail.com" style={{ fontSize: 12, color: '#E8650A', textDecoration: 'none', letterSpacing: 0.5 }}>
            Contact: shraddhadh@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
