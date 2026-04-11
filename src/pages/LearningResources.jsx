import { useState } from 'react';

const C = {
  bg: '#FAFAF8',
  card: '#FFFFFF',
  bgMuted: '#F5F3EF',
  text: '#1B1B18',
  textMuted: '#5C5C57',
  textLight: '#9C9C97',
  border: '#E8E6E1',
  green: '#16A34A',
  greenLight: 'rgba(22,163,74,0.08)',
  greenBorder: 'rgba(22,163,74,0.2)',
};

const NAV_H = 60;

const COACHES = [
  {
    name: 'Shravan Tikoo',
    handle: '@TheSwagWalaPM',
    channelUrl: 'https://www.youtube.com/c/TheSwagWalaPM',
    description: 'PM career coach helping aspiring and experienced PMs crack interviews at top tech companies. Covers product sense, execution, and real interview breakdowns.',
    videos: [
      { id: 'dOrrxtVsbyQ', title: 'The Product Management Job Search in 2024: How to Win' },
    ],
  },
  {
    name: 'Sugat Nayak',
    handle: '@SugatNayak',
    channelUrl: 'https://www.youtube.com/@SugatNayak',
    description: 'Product management mentor focused on Indian tech ecosystem. Covers PM interviews, career transitions, and product strategy for Indian startups and MNCs.',
    videos: [
      { id: 'IuPL0z99xwo', title: 'Interview Experience at PayPal | Product Manager Interview | Real Experience' },
      { id: 'HPopE5cY18w', title: 'Ep 25 - PM Interview Experience at Swiggy | Sales to Product Manager' },
      { id: 'HVzFjiA5UMQ', title: 'Ep 12 - Interview Experience at PayU | Product Manager Interview Series' },
    ],
  },
  {
    name: 'Diego Granados',
    handle: '@PMDiegoGranados',
    channelUrl: 'https://www.youtube.com/c/PMDiegoGranados',
    description: 'High-energy PM interview coach known for real-talk feedback and zero-fluff approach. Covers product sense frameworks, mock interviews, and career strategy.',
    videos: [
      { id: 't4hisfA97pE', title: 'The Ultimate Guide to Your Next Product Management Job' },
    ],
  },
];

const MORE_RESOURCES = [
  { title: 'Cracking the PM Interview', author: 'Lewis C. Lin', type: 'Book', url: 'https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818' },
  { title: 'Decode and Conquer', author: 'Lewis C. Lin', type: 'Book', url: 'https://www.amazon.com/Decode-Conquer-Answers-Management-Interviews/dp/0615930417' },
  { title: 'Inspired', author: 'Marty Cagan', type: 'Book', url: 'https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507' },
  { title: 'Exponent PM Course', author: 'Exponent', type: 'Course', url: 'https://www.tryexponent.com' },
  { title: 'Product Alliance', author: 'Product Alliance', type: 'Course', url: 'https://productalliance.com' },
];

function TypeBadge({ type }) {
  const colors = {
    Book: { bg: 'rgba(22,163,74,0.08)', color: '#16A34A', border: 'rgba(22,163,74,0.2)' },
    Course: { bg: 'rgba(130,80,223,0.08)', color: '#8250DF', border: 'rgba(130,80,223,0.2)' },
    Channel: { bg: 'rgba(22,163,74,0.08)', color: '#16A34A', border: 'rgba(22,163,74,0.2)' },
  };
  const s = colors[type] || colors.Book;
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
      whiteSpace: 'nowrap',
    }}>{type}</span>
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
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.08)',
          borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative' }}>
          <img
            src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
          />
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.18s',
            }}>
              <span style={{ fontSize: 28, color: '#fff' }}>▶</span>
            </div>
          )}
        </div>
        {/* Title */}
        <div style={{
          padding: '10px 12px',
          background: C.card,
          fontSize: 13, fontWeight: 500, color: C.text,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1.4,
        }}>
          {video.title}
        </div>
      </div>
    </a>
  );
}

const BROWSE_LABELS = [
  { icon: '🎬', text: 'More videos on this channel' },
  { icon: '▶', text: 'Watch on YouTube' },
  { icon: '📺', text: 'Explore the full channel' },
];

function BrowseCard({ index }) {
  const [hovered, setHovered] = useState(false);
  const label = BROWSE_LABELS[index] || BROWSE_LABELS[0];
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
        border: `1.5px dashed ${hovered ? C.green : C.border}`,
        background: hovered ? C.greenLight : C.bgMuted,
        transition: 'all 0.18s ease',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 140, padding: 20, textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 28, marginBottom: 10 }}>{label.icon}</span>
      <span style={{
        fontSize: 13, fontWeight: 500, color: hovered ? C.green : C.textMuted,
        fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.4,
        transition: 'color 0.18s',
      }}>{label.text}</span>
    </div>
  );
}

function CoachCard({ coach }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      padding: 28, marginBottom: 24,
    }}>
      {/* Coach header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 400,
            color: C.text, margin: '0 0 4px',
          }}>{coach.name}</h2>
          <div style={{ fontSize: 13, color: C.textLight, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{coach.handle}</div>
        </div>
        <a
          href={coach.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px',
            background: 'transparent',
            border: `1.5px solid ${C.green}`,
            borderRadius: 12, color: C.green,
            fontSize: 13, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.greenLight; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Visit Channel →
        </a>
      </div>

      <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.75, margin: '0 0 24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {coach.description}
      </p>

      {/* Videos — verified thumbnails + "browse more" filler to maintain 3-column grid */}
      <div className="lr-video-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {coach.videos.map(v => <VideoCard key={v.id} video={v} />)}
        {/* Fill remaining slots up to 3 with a styled channel-browse card */}
        {Array.from({ length: Math.max(0, 3 - coach.videos.length) }).map((_, i) => (
          <a
            key={`more-${i}`}
            href={coach.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', flex: '1 1 0', minWidth: 0 }}
          >
            <BrowseCard channelUrl={coach.channelUrl} index={i} total={3 - coach.videos.length} />
          </a>
        ))}
      </div>
    </div>
  );
}

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
        @media (max-width: 768px) {
          .lr-page { padding: 24px 16px !important; }
          .lr-video-row { flex-direction: column !important; }
        }
      `}</style>

      <div className="lr-page" style={{ maxWidth: 880, margin: '0 auto', padding: '0 28px 60px', animation: 'fadeUp 0.5s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400,
            color: C.text, margin: '0 0 12px', lineHeight: 1.1,
          }}>Learning Resources</h1>
          <p style={{ fontSize: 16, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>
            Curated video content from top PM coaches to supplement your practice.
          </p>
        </div>

        {/* Section label */}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: C.textLight, marginBottom: 20 }}>
          Featured Coaches
        </div>

        {/* Coach cards */}
        {COACHES.map(coach => <CoachCard key={coach.name} coach={coach} />)}

        {/* More Resources */}
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: C.textLight, marginBottom: 20 }}>
            More Resources
          </div>
          <div style={{
            background: C.card, borderRadius: 16,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}>
            {MORE_RESOURCES.map((r, i) => (
              <a
                key={r.title}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 24px',
                  borderBottom: i < MORE_RESOURCES.length - 1 ? `1px solid ${C.border}` : 'none',
                  textDecoration: 'none',
                  background: 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.bgMuted; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 2 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: C.textLight }}>{r.author}</div>
                </div>
                <TypeBadge type={r.type} />
                <span style={{ fontSize: 16, color: C.textLight }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
