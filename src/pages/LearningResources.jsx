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
const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';

// ── Section 1: PM Coaches & Mentors ──────────────────────────────────────────
const COACHES = [
  { name: 'Shravan Tikoo',    tagline: 'PM career coach. Product sense, execution, interview breakdowns.',                                          url: 'https://www.youtube.com/c/TheSwagWalaPM',        btn: 'YouTube →' },
  { name: 'Aakash Gupta',     tagline: 'Former Faire & Yahoo PM. Product growth, metrics, and strategy deep-dives.',                                url: 'https://www.youtube.com/@growproduct',           btn: 'YouTube →' },
  { name: 'Sugat Nayak',      tagline: 'PM mentor for Indian tech. Interviews, career transitions, product strategy.',                              url: 'https://www.youtube.com/@SugatNayak',            btn: 'YouTube →' },
  { name: 'Diego Granados',   tagline: 'High-energy PM coach. Real-talk feedback, mock interviews.',                                                url: 'https://www.youtube.com/c/PMDiegoGranados',      btn: 'YouTube →' },
  { name: 'Dr. Nancy Li',     tagline: 'Former Google PM. Interview frameworks, career coaching.',                                                   url: 'https://www.youtube.com/c/drnancyli',            btn: 'YouTube →' },
  { name: 'Lenny Rachitsky',  tagline: 'Former Airbnb PM. In-depth interviews with world-class product leaders.',                                   url: 'https://www.youtube.com/@LennysPodcast',         btn: 'YouTube →' },
  { name: 'Peter Yang',       tagline: 'Former Meta PM. Product sense, strategy frameworks.',                                                       url: 'https://www.youtube.com/@peteryangyt',           btn: 'YouTube →' },
  { name: 'Sachin Sharma',    tagline: 'PM content creator. PM skills, interview prep, and product case studies from Indian and global tech.',      url: 'https://www.youtube.com/@catchupwithsachin',    btn: 'YouTube →' },
  { name: 'Dr. Bart Jaworski',tagline: 'PM coach and YouTuber. Product management tips, interview prep, and career advice.',                        url: 'https://www.youtube.com/@DrBartPM',              btn: 'YouTube →' },
];

// ── Section 2: Recommended Books ─────────────────────────────────────────────
const BOOK_CATEGORIES = [
  {
    id: 'core',
    label: 'Core Product Management',
    badge: { bg: 'rgba(22,163,74,0.08)', color: '#16A34A', border: 'rgba(22,163,74,0.2)' },
    books: [
      { title: 'Inspired',                   author: 'Marty Cagan',     url: 'https://www.amazon.in/dp/1119387507' },
      { title: 'Empowered',                  author: 'Marty Cagan',     url: 'https://www.amazon.in/dp/111969129X' },
      { title: 'Escaping the Build Trap',    author: 'Melissa Perri',   url: 'https://www.amazon.in/dp/149197379X' },
      { title: 'Lean Product Playbook',      author: 'Dan Olsen',       url: 'https://www.amazon.in/dp/1118960874' },
      { title: 'Hooked',                     author: 'Nir Eyal',        url: 'https://www.amazon.in/dp/0241184835' },
      { title: 'Continuous Discovery Habits',author: 'Teresa Torres',   url: 'https://www.amazon.in/dp/1736633309' },
      { title: 'The Mom Test',               author: 'Rob Fitzpatrick', url: 'https://www.amazon.in/dp/1492180742' },
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy & Business',
    badge: { bg: 'rgba(130,80,223,0.08)', color: '#8250DF', border: 'rgba(130,80,223,0.2)' },
    books: [
      { title: 'Good Strategy Bad Strategy', author: 'Richard Rumelt',  url: 'https://www.amazon.in/dp/0307886239' },
      { title: '7 Powers',                   author: 'Hamilton Helmer', url: 'https://www.amazon.in/dp/0998116319' },
      { title: 'Measure What Matters',       author: 'John Doerr',     url: 'https://www.amazon.in/dp/024134848X' },
    ],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    badge: { bg: 'rgba(2,132,199,0.08)', color: '#0284C7', border: 'rgba(2,132,199,0.2)' },
    books: [
      { title: 'Lean Analytics',                          author: 'Alistair Croll',  url: 'https://www.amazon.in/dp/1449335675' },
      { title: 'Trustworthy Online Controlled Experiments',author: 'Ron Kohavi',     url: 'https://www.amazon.in/dp/1108724264' },
      { title: 'Superforecasting',                        author: 'Philip Tetlock', url: 'https://www.amazon.in/dp/0804136718' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Machine Learning for PMs',
    badge: { bg: 'rgba(217,70,239,0.08)', color: '#A21CAF', border: 'rgba(217,70,239,0.2)' },
    books: [
      { title: 'Building Machine Learning Powered Applications', author: 'Emmanuel Ameisen', url: 'https://www.amazon.in/dp/149204511X',                             btn: 'Buy on Amazon →' },
      { title: 'Machine Learning Yearning',                      author: 'Andrew Ng',        url: 'https://info.deeplearning.ai/machine-learning-yearning-book',    btn: 'Free PDF →'      },
      { title: 'You Look Like a Thing and I Love You',           author: 'Janelle Shane',    url: 'https://www.amazon.in/dp/0316525243',                             btn: 'Buy on Amazon →' },
      { title: 'Prediction Machines',                            author: 'Ajay Agrawal',     url: 'https://www.amazon.in/dp/1633695670',                             btn: 'Buy on Amazon →' },
      { title: 'Artificial Intelligence Basics',                 author: 'Tom Taulli',       url: 'https://www.amazon.in/dp/1484250273',                             btn: 'Buy on Amazon →' },
    ],
  },
  {
    id: 'systems',
    label: 'Systems Thinking',
    badge: { bg: 'rgba(234,179,8,0.10)', color: '#92400E', border: 'rgba(234,179,8,0.3)' },
    books: [
      { title: 'Thinking in Systems', author: 'Donella Meadows', url: 'https://www.amazon.in/dp/1603580557' },
    ],
  },
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
        padding: 24, display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>
        {coach.name}
      </div>
      <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif", flex: 1, marginBottom: 20 }}>
        {coach.tagline}
      </div>
      <a
        href={coach.url} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '7px 14px', background: 'transparent',
          border: `1.5px solid ${C.green}`, borderRadius: 8, color: C.green,
          fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
          textDecoration: 'none', transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.greenLight; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        {coach.btn}
      </a>
    </div>
  );
}

function BookCard({ book, badge }) {
  const [hovered, setHovered] = useState(false);
  const btnLabel = book.btn || 'Buy on Amazon →';
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.09)' : '0 2px 6px rgba(0,0,0,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        padding: 20, display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Category badge */}
      <span style={{
        alignSelf: 'flex-start', marginBottom: 12,
        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
        whiteSpace: 'nowrap',
      }}>
        {badge.label}
      </span>

      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.3, marginBottom: 6, flex: 1 }}>
        {book.title}
      </div>

      {/* Author */}
      <div style={{ fontSize: 14, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 20 }}>
        {book.author}
      </div>

      {/* Rainbow gradient border button */}
      <a href={book.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
        <div style={{ background: RAINBOW, padding: '1.5px', borderRadius: 9, display: 'inline-block' }}>
          <div style={{
            background: hovered ? '#faf9f7' : C.card,
            borderRadius: 7.5, padding: '6px 14px',
            fontSize: 13, fontWeight: 600, color: C.text,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: 'background 0.15s', whiteSpace: 'nowrap',
          }}>
            {btnLabel}
          </div>
        </div>
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LearningResources() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", paddingTop: NAV_H + 40 }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        .coaches-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .books-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 768px) {
          .lr-page { padding: 24px 16px !important; }
          .coaches-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .books-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .coaches-grid { grid-template-columns: 1fr !important; }
          .books-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="lr-page" style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 60px', animation: 'fadeUp 0.5s ease' }}>

        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400, color: C.text, margin: '0 0 12px', lineHeight: 1.1 }}>
            Learning Resources
          </h1>
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
        <SectionLabel style={{ marginTop: 52 }}>Recommended Books</SectionLabel>

        {BOOK_CATEGORIES.map((cat, ci) => (
          <div key={cat.id} style={{ marginBottom: ci < BOOK_CATEGORIES.length - 1 ? 40 : 0 }}>
            {/* Category heading */}
            <div style={{
              fontSize: 13, fontWeight: 700, color: cat.badge.color,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: cat.badge.color,
              }} />
              {cat.label}
            </div>

            <div className="books-grid">
              {cat.books.map(book => (
                <BookCard key={book.title} book={book} badge={{ ...cat.badge, label: cat.label }} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
