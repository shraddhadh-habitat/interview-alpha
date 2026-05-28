import { useState } from 'react';

export default function ReviewPrompt({ score, userName, onSubmit, onDismiss }) {
  const [step, setStep] = useState('ask'); // 'ask' | 'write' | 'done'
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Only show for scores 6 and above
  if (!score || score < 6) return null;

  const handleStarClick = (star) => {
    setRating(star);
    if (star >= 4) {
      setStep('write');
    } else {
      // Low rating - ask for feedback privately
      setStep('write');
    }
  };

  const handleSubmit = async () => {
    if (!review.trim() || rating === 0) return;
    await onSubmit({ rating, review, score });
    setStep('done');
  };

  if (step === 'done') return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 99999,
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '320px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e4e1db',
      textAlign: 'center',
      animation: 'slideInRight 0.4s ease'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
      <p style={{ fontWeight: 700, color: '#111', marginBottom: '4px' }}>Thank you!</p>
      <p style={{ fontSize: '0.82rem', color: '#6b6b6b' }}>Your review helps other aspirants find InterviewAlpha.</p>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={onDismiss} style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 99998,
        animation: 'fadeIn 0.3s ease'
      }} />

      {/* Prompt card */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
        background: '#ffffff',
        borderRadius: '20px',
        padding: '36px',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Close */}
        <button onClick={onDismiss} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', fontSize: '1.2rem',
          cursor: 'pointer', color: '#9a9a9a'
        }}>×</button>

        {step === 'ask' && (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px', textAlign: 'center' }}>⭐</div>
            <h3 style={{
              fontWeight: 800, fontSize: '1.2rem',
              color: '#111', marginBottom: '8px', textAlign: 'center'
            }}>
              You scored {score}/10. Nice work!
            </h3>
            <p style={{
              color: '#6b6b6b', fontSize: '0.88rem',
              lineHeight: 1.6, marginBottom: '24px', textAlign: 'center'
            }}>
              How would you rate your InterviewAlpha experience so far,{' '}
              {userName || 'there'}?
            </p>

            {/* Star rating */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: '8px', marginBottom: '20px'
            }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{
                    background: 'none', border: 'none',
                    fontSize: '2rem', cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    transform: (hoveredStar >= star || rating >= star) ? 'scale(1.2)' : 'scale(1)',
                    filter: (hoveredStar >= star || rating >= star) ? 'none' : 'grayscale(1)',
                  }}
                >⭐</button>
              ))}
            </div>

            <p style={{
              textAlign: 'center', fontSize: '0.75rem', color: '#9a9a9a'
            }}>
              Tap a star to rate
            </p>
          </>
        )}

        {step === 'write' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '16px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{
                  fontSize: '1.2rem',
                  filter: s <= rating ? 'none' : 'grayscale(1)'
                }}>⭐</span>
              ))}
            </div>
            <h3 style={{
              fontWeight: 800, fontSize: '1.1rem',
              color: '#111', marginBottom: '8px', textAlign: 'center'
            }}>
              {rating >= 4 ? 'Tell us what worked' : 'What can we improve?'}
            </h3>
            <p style={{
              color: '#6b6b6b', fontSize: '0.82rem',
              marginBottom: '16px', textAlign: 'center'
            }}>
              {rating >= 4
                ? 'Your review helps other PM and DS aspirants find us.'
                : 'Your feedback helps us build a better product.'}
            </p>

            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder={rating >= 4
                ? "e.g. The AI feedback showed me exactly where I was going wrong with product sense questions..."
                : "Tell us what we can do better..."}
              style={{
                width: '100%',
                minHeight: '100px',
                border: '1.5px solid #e4e1db',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#111',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.borderColor = '#a78bfa'}
              onBlur={e => e.target.style.borderColor = '#e4e1db'}
            />

            <button
              onClick={handleSubmit}
              disabled={!review.trim()}
              style={{
                background: review.trim()
                  ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)'
                  : '#e4e1db',
                color: review.trim() ? '#ffffff' : '#9a9a9a',
                border: 'none',
                borderRadius: '10px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: review.trim() ? 'pointer' : 'not-allowed',
                width: '100%',
                fontFamily: 'inherit',
                marginBottom: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              Submit Review
            </button>

            <button onClick={() => setStep('ask')} style={{
              background: 'none', border: 'none',
              color: '#9a9a9a', fontSize: '0.78rem',
              cursor: 'pointer', width: '100%',
              fontFamily: 'inherit'
            }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </>
  );
}
