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

// ── Section 1: PM Coaches & Mentors ──────────────────────────────────────────
const COACHES = [
  { name: 'Shravan Tikoo',   tagline: 'PM career coach. Product sense, execution, interview breakdowns.',                                         url: 'https://www.youtube.com/c/TheSwagWalaPM',          btn: 'YouTube →' },
  { name: 'Sugat Nayak',     tagline: 'PM mentor for Indian tech. Interviews, career transitions, product strategy.',                             url: 'https://www.youtube.com/@SugatNayak',              btn: 'YouTube →' },
  { name: 'Diego Granados',  tagline: 'High-energy PM coach. Real-talk feedback, mock interviews.',                                               url: 'https://www.youtube.com/c/PMDiegoGranados',        btn: 'YouTube →' },
  { name: 'Dr. Nancy Li',    tagline: 'Former Google PM. Interview frameworks, career coaching.',                                                  url: 'https://www.youtube.com/c/drnancyli',              btn: 'YouTube →' },
  { name: 'Lenny Rachitsky', tagline: 'Former Airbnb PM. In-depth interviews with world-class product leaders.',                                  url: 'https://www.youtube.com/@LennysPodcast',           btn: 'YouTube →' },
  { name: 'Peter Yang',      tagline: 'Former Meta PM. Product sense, strategy frameworks.',                                                      url: 'https://www.youtube.com/@peteryangyt',             btn: 'YouTube →' },
  { name: 'Sachin Sharma',   tagline: 'PM content creator. PM skills, interview prep, and product case studies from Indian and global tech companies.', url: 'https://www.youtube.com/@catchupwithsachin',   btn: 'YouTube →' },
  { name: 'Dr. Bart Jaworski', tagline: 'PM coach and YouTuber. Product management tips, interview prep, and career advice.',                            url: 'https://www.youtube.com/@DrBartPM',             btn: 'YouTube →' },
  { name: 'Aakash Gupta',      tagline: 'Former Faire & Yahoo PM. Product growth, metrics, and strategy deep-dives.',                                   url: 'https://www.youtube.com/@growproduct',          btn: 'YouTube →' },
];

// ── Section 2: Books ──────────────────────────────────────────────────────────
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

        {/* ── Section 1: PM Coaches & Mentors ── */}
        <SectionLabel>PM Coaches &amp; Mentors</SectionLabel>
        <div className="coaches-grid">
          {COACHES.map(coach => <CoachCard key={coach.name} coach={coach} />)}
        </div>

        {/* ── Section 2: Recommended Books ── */}
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
