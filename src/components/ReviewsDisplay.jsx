import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8',
  text: '#0A0A0A', textMuted: '#5C5C57',
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
      minWidth: 264, maxWidth: 300, flexShrink: 0,
      background: C.bg, borderRadius: 16, padding: '20px 22px',
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.03)',
      scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <StarDisplay rating={review.rating} />
      <p style={{ fontSize: 13, lineHeight: 1.7, color: C.text, fontFamily: FONT, margin: 0, flex: 1 }}>
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

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 24, fontFamily: FONT }}>
        What PMs Are Saying
      </div>
      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12,
        scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', msOverflowStyle: 'none',
      }}>
        <style>{`.reviews-scroll::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
    </div>
  );
}
