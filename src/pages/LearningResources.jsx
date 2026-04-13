import { useState } from 'react';

const C = {
  bg: '#FAFAF8',
  card: '#FFFFFF',
  bgMuted: '#F5F3EF',
  text: '#0A0A0A',
  textMuted: '#5C5C57',
  textLight: '#9C9C97',
  border: '#E8E6E1',
  green: '#16A34A',
  greenLight: 'rgba(22,163,74,0.08)',
};

const NAV_H = 60;

// ── Section 1: coaches with verified working thumbnails only ─────────────────
const FEATURED = [
  {
    name: 'Sugat Nayak',
    handle: '@SugatNayak',
    channelUrl: 'https://www.youtube.com/@SugatNayak',
    description: 'Product management mentor focused on the Indian tech ecosystem. Covers PM interviews, career transitions, and product strategy for startups and MNCs.',
    videos: [
      { id: 'IuPL0z99xwo', title: 'Interview Experience at PayPal | Product Manager Interview' },
      { id: 'HPopE5cY18w', title: 'PM Interview Experience at Swiggy | Sales to Product Manager' },
      { id: 'HVzFjiA5UMQ', title: 'Interview Experience at PayU | Product Manager Interview Series' },
    ],
  },
  {
    name: 'Lenny Rachitsky',
    handle: '@lennysan',
    channelUrl: 'https://www.youtube.com/@LennysPodcast',
    description: 'Former Airbnb PM and author of the #1 product newsletter. In-depth interviews with world-class product leaders on strategy, growth, and career.',
    videos: [
      { id: '93fCvFkY1Lg', title: 'PM Is Dead. So What Are We Doing Instead? — Lenny & Friends Summit 2024' },
      { id: '4LjddcccYIo', title: 'Mastering Product Strategy and Growing as a PM — Maggie Crowley' },
      { id: 'atS060bNpE0', title: '4 Questions Shreyas Doshi Wishes He\'d Asked Himself Sooner' },
    ],
  },
];

// ── Section 2: compact coach grid ────────────────────────────────────────────
const COACHES = [
  { name: 'Shravan Tikoo',  tagline: 'PM career coach. Product sense, execution, interview breakdowns.',  url: 'https://www.youtube.com/c/TheSwagWalaPM',                         btn: 'YouTube →'  },
  { name: 'Diego Granados', tagline: 'High-energy PM coach. Real-talk feedback, mock interviews.',         url: 'https://www.youtube.com/c/PMDiegoGranados',                      btn: 'YouTube →'  },
  { name: 'Dr. Nancy Li',   tagline: 'Former Google PM. Interview frameworks, career coaching.',           url: 'https://www.youtube.com/c/drnancyli',                             btn: 'YouTube →'  },
  { name: 'Ankit Shukla',   tagline: 'Indian tech PM coach. Fundamentals, case studies.',                 url: 'https://hellopm.co',                                              btn: 'Website →'  },
  { name: 'Clement Kao',    tagline: 'Product Teacher founder. PM interviews, strategy.',                  url: 'https://www.youtube.com/@ProductTeacher',                         btn: 'YouTube →'  },
  { name: 'Mahesh Yadav',   tagline: 'AI product leader. PM interviews, agentic AI.',                     url: 'https://www.linkedin.com/in/initmahesh/',                         btn: 'LinkedIn →' },
  { name: 'Peter Yang',     tagline: 'Former Meta PM. Product sense, strategy frameworks.',                url: 'https://www.youtube.com/@peteryangyt',                           btn: 'YouTube →'  },
  { name: 'Claire Vo',      tagline: 'CEO & former CPO. Product leadership insights.',                    url: 'https://www.linkedin.com/in/clairevo/',                           btn: 'LinkedIn →' },
  { name: 'Sachin Sharma',  tagline: 'PM content creator. Skills, interview prep.',                       url: 'https://www.linkedin.com/in/sachin-sharma-product-career-coach/', btn: 'LinkedIn →' },
];

// ── Section 3: books ─────────────────────────────────────────────────────────
const BOOKS = [
  { title: 'Cracking the PM Interview', author: 'Lewis C. Lin',  url: 'https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818' },
  { title: 'Decode and Conquer',        author: 'Lewis C. Lin',  url: 'https://www.amazon.com/Decode-Conquer-Answers-Management-Interviews/dp/0615930417' },
  { title: 'Inspired',                  author: 'Marty Cagan',   url: 'https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 3,
      textTransform: 'uppercase', color: C.textLight, marginBottom: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', flex: '1 1 0', minWidth: 0 }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
          boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.13)' : '0 1px 4px rgba(0,0,0,0.08)',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'box-shadow 0.18s ease, transform 0.18s ease',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
          />
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 28, color: '#fff' }}>▶</span>
            </div>
          )}
        </div>
        <div style={{
          padding: '9px 11px', background: C.card,
          fontSize: 12, fontWeight: 500, color: C.text,
          fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4,
        }}>
          {video.title}
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ coach }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      padding: 28, marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400,
            color: C.text, margin: '0 0 4px',
          }}>{coach.name}</h2>
          <div style={{ fontSize: 13, color: C.textLight, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{coach.handle}</div>
        </div>
        <a
          href={coach.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '7px 16px',
            background: 'transparent',
            border: `1.5px solid ${C.green}`,
            borderRadius: 10, color: C.green,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.greenLight; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Visit Channel →
        </a>
      </div>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: '0 0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {coach.description}
      </p>
      <div className="lr-video-row" style={{ display: 'flex', gap: 14 }}>
        {coach.videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}

function CoachCard({ coach }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.10)' : '0 2px 6px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        padding: 24,
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        fontSize: 18, fontWeight: 700, color: C.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6,
      }}>
        {coach.name}
      </div>
      <div style={{
        fontSize: 14, color: C.textMuted, lineHeight: 1.5,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flex: 1, marginBottom: 20,
      }}>
        {coach.tagline}
      </div>
      <a
        href={coach.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '7px 14px',
          background: 'transparent',
          border: `1.5px solid ${C.green}`,
          borderRadius: 8, color: C.green,
          fontSize: 13, fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textDecoration: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.greenLight; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        {coach.btn}
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LearningResources() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      paddingTop: NAV_H + 40,
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        .coaches-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .lr-page { padding: 24px 16px !important; }
          .lr-video-row { flex-direction: column !important; }
          .coaches-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .coaches-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="lr-page" style={{ maxWidth: 880, margin: '0 auto', padding: '0 28px 60px', animation: 'fadeUp 0.5s ease' }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400,
            color: C.text, margin: '0 0 12px', lineHeight: 1.1,
          }}>Learning Resources</h1>
          <p style={{ fontSize: 16, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
            Curated content from top PM coaches to supplement your practice.
          </p>
        </div>

        {/* ── Section 1: Featured Video Channels ── */}
        <SectionLabel>Featured Video Channels</SectionLabel>
        {FEATURED.map(coach => <FeaturedCard key={coach.name} coach={coach} />)}

        {/* ── Section 2: PM Coaches & Mentors ── */}
        <SectionLabel style={{ marginTop: 44 }}>PM Coaches &amp; Mentors</SectionLabel>
        <div className="coaches-grid">
          {COACHES.map(coach => <CoachCard key={coach.name} coach={coach} />)}
        </div>

        {/* ── Section 3: Recommended Books ── */}
        <SectionLabel style={{ marginTop: 44 }}>Recommended Books</SectionLabel>
        <div style={{
          background: C.card, borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {BOOKS.map((book, i) => (
            <a
              key={book.title}
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 24px',
                borderBottom: i < BOOKS.length - 1 ? `1px solid ${C.border}` : 'none',
                textDecoration: 'none', background: 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.bgMuted; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 2 }}>{book.title}</div>
                <div style={{ fontSize: 13, color: C.textLight }}>{book.author}</div>
              </div>
              <span style={{ fontSize: 16, color: C.textLight }}>↗</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
