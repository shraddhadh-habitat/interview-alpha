import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8',
  text: '#0A0A0A', textMuted: '#0A0A0A',
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

function ReviewCard({ review, isMobile }) {
  const name = review.show_name && review.display_name ? review.display_name : 'Anonymous PM';
  const date = new Date(review.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

  return (
    <div style={{
      minWidth: isMobile ? 'unset' : 264,
      maxWidth: isMobile ? 'unset' : 300,
      width: isMobile ? '100%' : 'auto',
      height: isMobile ? 'auto' : '100%',
      flexShrink: 0,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, display_name, show_name, rating, review_text, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setReviews(data || []));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    };

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile, reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0' : '0 24px' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, marginBottom: 24, fontFamily: FONT, textAlign: 'center' }}>
          What PMs Are Saying
        </div>
      <div
        ref={scrollContainerRef}
        style={{
          display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12,
          scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
          justifyContent: reviews.length < 3 ? 'center' : 'flex-start',
          alignItems: 'stretch',
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 0,
          scrollPaddingLeft: isMobile ? 16 : 0,
        }}>
        <style>{`.reviews-scroll::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map(r => <ReviewCard key={r.id} review={r} isMobile={isMobile} />)}
      </div>

      {isMobile && reviews.length > 1 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
          }}>
            {reviews.map((_, index) => (
              <div
                key={index}
                style={{
                  height: currentIndex === index ? 8 : 6,
                  borderRadius: currentIndex === index ? 999 : '50%',
                  background: currentIndex === index ? '#7c3aed' : '#D1D5DB',
                  width: currentIndex === index ? 24 : 6,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
          <div style={{
            fontSize: 12,
            color: C.textMuted,
            fontFamily: FONT,
            textAlign: 'center',
            marginTop: 8,
          }}>
            swipe to see more
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
