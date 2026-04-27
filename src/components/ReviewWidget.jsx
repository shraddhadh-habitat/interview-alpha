import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  red: '#CF222E', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
};
const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';
const FONT = "'Plus Jakarta Sans', sans-serif";

function Stars({ value, hover, onRate, onHover, onLeave, size = 36 }) {
  return (
    <div style={{ display: 'flex', gap: 6 }} onMouseLeave={onLeave}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onRate(n)}
          onMouseEnter={() => onHover(n)}
          style={{
            fontSize: size, cursor: 'pointer', lineHeight: 1,
            color: n <= (hover || value) ? '#F59E0B' : '#D1D5DB',
            transition: 'color 0.1s',
            userSelect: 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewWidget({ user, profile }) {
  const [visible, setVisible]               = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showModal, setShowModal]           = useState(false);

  // Modal form state
  const [rating, setRating]         = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [showName, setShowName]     = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (!user || !profile) return;
    const sessionsUsed = (profile.free_sessions_used ?? 0) + (profile.monthly_sessions_used ?? 0);
    if (sessionsUsed < 1) return;
    setVisible(true);
    setDisplayName(user.email?.split('@')[0] || '');
    // Check if already submitted (policy allows users to read own reviews)
    supabase.from('reviews').select('id').eq('user_id', user.id).limit(1)
      .then(({ data }) => { if (data?.length > 0) setAlreadySubmitted(true); });
  }, [user, profile]);

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a star rating.'); return; }
    if (reviewText.trim().length < 50) { setError(`At least 50 characters required (${reviewText.trim().length} so far).`); return; }
    if (reviewText.trim().length > 300) { setError('Review must be 300 characters or less.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const { error: err } = await supabase.from('reviews').insert({
        user_id:      user.id,
        user_email:   user.email,
        display_name: displayName.trim() || user.email?.split('@')[0],
        show_name:    showName,
        rating,
        review_text:  reviewText.trim(),
      });
      if (err) throw err;
      setSubmitted(true);
      setAlreadySubmitted(true);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  if (!visible) return null;

  const charCount = reviewText.trim().length;

  return (
    <>
      <style>{`
        .rw-fab {
          position: fixed; bottom: 24px; right: 24px; z-index: 800;
          display: flex; align-items: center; gap: 8px;
          padding: 12px 20px; border: none; border-radius: 50px;
          font-family: ${FONT}; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          white-space: nowrap;
        }
        .rw-fab:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.2); }
        @media (max-width: 480px) {
          .rw-fab { width: 48px; height: 48px; padding: 0; border-radius: 50%; justify-content: center; font-size: 20px; }
          .rw-fab-text { display: none; }
        }
        .rw-modal-card {
          width: 100%; max-width: 480px;
          background: ${C.bg}; border-radius: 20px;
          padding: 32px 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: rw-fadeUp 0.3s cubic-bezier(0.22,1,0.36,1);
          max-height: 90vh; overflow-y: auto;
        }
        @keyframes rw-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 480px) {
          .rw-modal-card {
            border-radius: 20px 20px 0 0; max-width: 100%;
            position: fixed; bottom: 0; left: 0; right: 0; max-height: 92vh;
          }
        }
        .rw-input {
          width: 100%; padding: 12px 14px;
          border: 1.5px solid ${C.border}; border-radius: 12px;
          font-size: 14px; font-family: ${FONT}; color: ${C.text};
          background: ${C.bg}; transition: border-color 0.2s; box-sizing: border-box;
        }
        .rw-input:focus { outline: none; border-color: ${C.green}; }
      `}</style>

      {/* Floating button */}
      <button
        className="rw-fab"
        onClick={() => !alreadySubmitted && setShowModal(true)}
        disabled={alreadySubmitted}
        style={{
          background: alreadySubmitted ? C.greenLight : '#0A0A0A',
          color: alreadySubmitted ? C.green : '#fff',
          border: alreadySubmitted ? `1.5px solid ${C.greenBorder}` : 'none',
          cursor: alreadySubmitted ? 'default' : 'pointer',
        }}
      >
        {alreadySubmitted ? '✓' : '⭐'}
        <span className="rw-fab-text">
          {alreadySubmitted ? 'Review Submitted' : 'Leave a Review'}
        </span>
      </button>

      {/* Modal */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 8500,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px 16px',
          }}
        >
          <div className="rw-modal-card">
            {submitted ? (
              /* Thank you state */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
                <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontWeight: 400, color: C.text, marginBottom: 12 }}>
                  Thank you!
                </h3>
                <p style={{ fontSize: 14, color: C.textMuted, fontFamily: FONT, lineHeight: 1.7, marginBottom: 28 }}>
                  Your review will appear after approval.
                </p>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '12px 32px', background: C.green, border: 'none',
                    borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 600,
                    fontFamily: FONT, cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, color: C.text, margin: 0 }}>
                    Leave a Review
                  </h3>
                  <button
                    onClick={closeModal}
                    style={{ background: 'none', border: 'none', fontSize: 20, color: C.textMuted, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}
                  >
                    ×
                  </button>
                </div>

                {/* Stars */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT, marginBottom: 12 }}>
                    Your Rating
                  </div>
                  <Stars
                    value={rating}
                    hover={hoverRating}
                    onRate={setRating}
                    onHover={setHoverRating}
                    onLeave={() => setHoverRating(0)}
                    size={40}
                  />
                </div>

                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT, marginBottom: 8 }}>
                    Name
                  </label>
                  <input
                    className="rw-input"
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your name (shown publicly)"
                  />
                </div>

                {/* Show name checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer', fontFamily: FONT, fontSize: 13, color: C.textMuted }}>
                  <input
                    type="checkbox"
                    checked={showName}
                    onChange={e => setShowName(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: C.green, cursor: 'pointer' }}
                  />
                  Display my name with the review
                </label>

                {/* Review text */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.textMuted, fontFamily: FONT, marginBottom: 8 }}>
                    Your Review
                  </label>
                  <textarea
                    className="rw-input"
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="How has InterviewAlpha helped your PM prep?"
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 11, fontFamily: FONT }}>
                  <span style={{ color: charCount < 50 ? C.textMuted : C.green }}>
                    {charCount < 50 ? `${charCount}/50 min` : `${charCount} chars`}
                  </span>
                  <span style={{ color: charCount > 300 ? C.red : C.textMuted }}>{charCount}/300</span>
                </div>

                {error && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: FONT }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: '100%', height: 48, background: submitting ? C.bgMuted : RAINBOW,
                    border: 'none', borderRadius: 12, color: submitting ? C.textMuted : '#fff',
                    fontSize: 15, fontWeight: 700, fontFamily: FONT,
                    cursor: submitting ? 'wait' : 'pointer', transition: 'opacity 0.2s',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
