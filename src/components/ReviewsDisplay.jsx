import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8',
  text: '#0A0A0A', textMuted: '#6b6b6b',
  border: '#E8E6E1',
};
const FONT = "'Plus Jakarta Sans', sans-serif";

function StarDisplay({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ fontSize: 14, color: n <= rating ? '#F59E0B' : '#D1D5DB' }}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const name = review.show_name && review.display_name ? review.display_name : 'Anonymous PM';
  const date = new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  return (
    <div style={{
      background: C.bg, borderRadius: 16, padding: '20px 22px',
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex', flexDirection: 'column', gap: 12,
      width: '100%', boxSizing: 'border-box',
    }}>
      <StarDisplay rating={review.rating} />
      <p style={{ fontSize: 13, lineHeight: 1.7, color: C.text, fontFamily: FONT, margin: 0 }}>
        "{review.review_text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: FONT }}>{name}</span>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>{date}</span>
      </div>
    </div>
  );
}

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, display_name, show_name, rating, review_text, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setReviews(data || []));
  }, []);

  if (reviews.length === 0) return null;

  if (isMobile) {
    return (
      <div style={{ padding: '0 16px', maxWidth: 600, margin: '0 auto', marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 24, fontFamily: FONT, textAlign: 'center' }}>
          What PMs Are Saying
        </div>
        <ReviewCard review={reviews[currentIndex]} />
        {reviews.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 }}>
            <button
              onClick={() => setCurrentIndex(i => (i - 1 + reviews.length) % reviews.length)}
              style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#a78bfa', padding: '4px 12px' }}
            >
              ←
            </button>
            <span style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT }}>
              {currentIndex + 1} of {reviews.length}
            </span>
            <button
              onClick={() => setCurrentIndex(i => (i + 1) % reviews.length)}
              style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#a78bfa', padding: '4px 12px' }}
            >
              →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', marginBottom: 48 }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 24, fontFamily: FONT, textAlign: 'center' }}>
        What PMs Are Saying
      </div>
      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12,
        scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        justifyContent: reviews.length < 3 ? 'center' : 'flex-start',
        alignItems: 'stretch',
      }}>
        {reviews.map(r => (
          <div key={r.id} style={{ minWidth: 264, maxWidth: 300, flexShrink: 0 }}>
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
