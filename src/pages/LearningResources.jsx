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
  greenBorder: 'rgba(22,163,74,0.2)',
};

const NAV_H = 60;

const COACHES = [
  {
    name: 'Shravan Tikoo',
    handle: '@TheSwagWalaPM',
    channelUrl: 'https://www.youtube.com/c/TheSwagWalaPM',
    description: 'PM career coach helping aspiring and experienced PMs crack interviews at top tech companies. Covers product sense, execution, and real interview breakdowns.',
    videos: null,
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
    videos: null,
  },
  {
    name: 'Dr. Nancy Li',
    handle: '@drnancyli',
    channelUrl: 'https://www.youtube.com/c/drnancyli',
    description: 'CEO of PM Accelerator and Forbes-featured AI product leader. Offers free PM interview frameworks, mock interviews, and career coaching with over 1 million YouTube views.',
    videos: null,
  },
  {
    name: 'Ankit Shukla',
    handle: '@HelloPM',
    channelUrl: 'https://hellopm.co',
    description: 'Founder of HelloPM, a PM bootcamp and upskilling platform serving the Indian tech market. Covers PM fundamentals, case studies, and interview prep for top companies.',
    videos: null,
  },
  {
    name: 'Lenny Rachitsky',
    handle: '@lennysan',
    channelUrl: 'https://www.youtube.com/@LennysPodcast',
    description: 'Former Airbnb PM and author of the #1 product newsletter. Hosts in-depth interviews with world-class product leaders and growth experts on strategy, career, and building great products.',
    videos: [
      { id: '93fCvFkY1Lg', title: 'PM Is Dead. So What Are We Doing Instead? — Lenny & Friends Summit 2024' },
      { id: '4LjddcccYIo', title: 'Mastering Product Strategy and Growing as a PM — Maggie Crowley' },
      { id: 'atS060bNpE0', title: '4 Questions Shreyas Doshi Wishes He\'d Asked Himself Sooner' },
    ],
  },
  {
    name: 'Clement Kao',
    handle: '@ProductTeacher',
    channelUrl: 'https://www.productteacher.com',
    description: 'Founder of Product Teacher. Teaches PM interviews, product strategy frameworks, and career transitions through structured, highly accessible educational content.',
    videos: null,
  },
  {
    name: 'Mahesh Yadav',
    handle: '@initmahesh',
    channelUrl: 'https://www.linkedin.com/in/initmahesh/',
    description: 'Former Google, Meta, AWS, and Microsoft AI product leader with 20+ years of experience and 12 patents. Teaches AI product management, agentic AI, and PM interview prep on Maven.',
    videos: null,
  },
  {
    name: 'Peter Yang',
    handle: '@peteryangyt',
    channelUrl: 'https://www.youtube.com/@peteryangyt',
    description: 'Former Meta PM and creator of the Behind the Craft newsletter with 140K+ readers. Makes practical AI tutorials and interviews top product builders on strategy and senior PM thinking.',
    videos: null,
  },
  {
    name: 'Claire Vo',
    handle: '@clairevo',
    channelUrl: 'https://clairevo.com',
    description: '3x CPO and founder of ChatPRD. Known for sharp takes on AI\'s impact on the PM role, what product leadership looks like at scale, and the future of the PM career.',
    videos: null,
  },
  {
    name: 'Sachin Sharma',
    handle: '@catchupwithsachin',
    channelUrl: 'https://www.youtube.com/@catchupwithsachin',
    description: 'Product Career Coach with 10+ years of PM experience who has mentored 1,000+ aspiring PMs. Covers PM skills, interview prep, and product case studies for Indian and global tech.',
    videos: null,
  },
];

const MORE_RESOURCES = [
  { title: 'Cracking the PM Interview', author: 'Lewis C. Lin', type: 'Book', url: 'https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818' },
  { title: 'Decode and Conquer', author: 'Lewis C. Lin', type: 'Book', url: 'https://www.amazon.com/Decode-Conquer-Answers-Management-Interviews/dp/0615930417' },
  { title: 'Inspired', author: 'Marty Cagan', type: 'Book', url: 'https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507' },
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

function buttonLabel(url) {
  if (url.includes('youtube.com')) return 'Visit Channel →';
  if (url.includes('linkedin.com')) return 'Visit LinkedIn →';
  return 'Visit Profile →';
}

function CoachCard({ coach }) {
  const hasVideos = coach.videos && coach.videos.length > 0;
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
          {buttonLabel(coach.channelUrl)}
        </a>
      </div>

      <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.75, margin: hasVideos ? '0 0 24px' : 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {coach.description}
      </p>

      {hasVideos && (
        <div className="lr-video-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {coach.videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
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
