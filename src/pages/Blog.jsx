export default function Blog() {
  const C = {
    text: '#1B1B18',
    textMuted: '#0A0A0A',
    border: 'rgba(27, 27, 24, 0.08)',
  };

  const blogPosts = [
    {
      id: 'feedback-black-hole',
      title: 'The Interview Feedback Black Hole',
      subtitle: 'Why the $4.5 billion interview prep industry solves the wrong problem, and what it means for the future of career development',
      date: 'May 21, 2026',
      readingTime: '8 min read',
    },
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      minHeight: '100vh',
      paddingTop: '40px',
      paddingBottom: '60px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .blog-container { padding: 0 20px !important; }
          .blog-title { font-size: 26px !important; }
          .blog-subtitle { font-size: 14px !important; }
        }
      `}</style>

      <div className="blog-container" style={{
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <h1 className="blog-title" style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '32px',
            fontWeight: 400,
            color: C.text,
            marginBottom: '16px',
          }}>
            Blog
          </h1>
          <p className="blog-subtitle" style={{
            fontSize: '16px',
            color: C.textMuted,
            margin: 0,
          }}>
            Insights on interviews, careers, and the future of hiring
          </p>
        </div>

        {/* Blog Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {blogPosts.map(post => (
            <div
              key={post.id}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('ia:navigate', { detail: 'blog-' + post.id }));
              }}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: C.border,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.text;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(27, 27, 24, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: C.text,
                margin: '0 0 12px 0',
                cursor: 'pointer',
              }}>
                {post.title}
              </h2>
              <p style={{
                fontSize: '14px',
                color: C.textMuted,
                margin: '0 0 12px 0',
                lineHeight: 1.6,
              }}>
                {post.subtitle}
              </p>
              <div style={{
                fontSize: '12px',
                color: 'rgba(27, 27, 24, 0.4)',
                display: 'flex',
                gap: '16px',
              }}>
                <span>{post.date}</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
