import { useState, useEffect } from 'react';
import FreeSessionCountdown from './FreeSessionCountdown';
import WeeklyActiveBar from './WeeklyActiveBar';
import FeedbackPreview from './FeedbackPreview';
import ReviewsDisplay from './ReviewsDisplay';

const C = {
  bg: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.5)',
  textSoft: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)',
  green: '#FDCD34',
  greenLight: 'rgba(253, 205, 52, 0.12)',
  redWarm: '#1B1B18',
  redWarmLight: 'rgba(27, 27, 24, 0.08)',
};


export default function LandingPage({ user, onNavigate, profile }) {
  // Hero section  . proper two-column layout with container
  const HeroSection = () => (
    <div style={{
      background: C.bg,
      paddingTop: '40px',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-container {
            grid-template-columns: 1fr !important;
            padding: 32px 16px !important;
            gap: 32px !important;
          }
          .hero-left {
            max-width: 100% !important;
          }
          .hero-right {
            max-width: 100% !important;
            width: 100% !important;
            gap: 12px !important;
          }
          .hero-headline { font-size: 26px !important; }
          .hero-subheadline { font-size: 15px !important; }
          .hero-cta {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
          }
        }
      `}</style>

      <div className="hero-container" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '40px',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 32px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* LEFT COLUMN  . 55% */}
        <div className="hero-left" style={{
          flex: '0 0 55%',
          maxWidth: '100%',
          minWidth: 0,
          overflow: 'visible'
        }}>
          <WeeklyActiveBar />

          {/* Eyebrow */}
          <p style={{
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.95rem',
            color: '#111',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            AI interview coaching for{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>
              Product Management
            </span>
            {', '}
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>
              Project Management
            </span>
            {', '}
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>
              Data Science
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700
            }}>
              , and Consulting roles
            </span>
          </p>

          {/* Headline */}
          <h1 className="hero-headline" style={{
            fontSize: '36px',
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.2,
            marginBottom: '16px',
            maxWidth: '480px',
            fontFamily: "'Instrument Serif', serif",
          }}>
            Your next interview is coming. Are you actually ready?
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline" style={{
            fontSize: '16px',
            color: C.textSoft,
            lineHeight: 1.6,
            marginBottom: '12px',
            maxWidth: '480px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
          }}>
            Most candidates think they are. Most candidates are wrong.
          </p>

          <p className="hero-subheadline" style={{
            fontSize: '16px',
            color: C.textSoft,
            lineHeight: 1.6,
            marginBottom: '12px',
            maxWidth: '480px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
          }}>
            They studied the answers. Interviews test how you think under pressure, not what you memorized.
          </p>

          <p className="hero-subheadline" style={{
            fontSize: '16px',
            color: C.textSoft,
            lineHeight: 1.6,
            marginBottom: '28px',
            maxWidth: '480px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
          }}>
            Answer one real question right now. Free. No signup.
          </p>

          {/* Free Session Countdown */}
          <FreeSessionCountdown
            user={user}
            profile={profile}
          />

          {/* Primary CTA  . inline-block, not full width */}
          <button
            className="hero-cta"
            onClick={() => window.location.href = '/?page=practice&new_user=true'}
            style={{
              display: 'inline-block',
              height: '44px',
              padding: '0 28px',
              background: 'var(--gradient-brand)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Answer your first question
          </button>

          {/* Reassurance text - hidden for logged-in users */}
          {!user && (
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginTop: '12px',
              marginBottom: '0',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 900,
              textShadow: '0 0 0 #1B1B18',
            }}>
              No resume. No setup. Free. Takes 2 minutes.
            </p>
          )}

          {/* Secondary link */}
          <p style={{ fontSize: '0.95rem', marginTop: '12px', color: '#111', lineHeight: 1.5, fontWeight: 600 }}>
            <a onClick={() => onNavigate('practice')} style={{ color: '#6b6b6b', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}>
              Or browse questions free.
            </a>
            {' '}Thousands of{' '}
            <strong style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Product Managers, Project Managers, Data Science, and Consulting
            </strong>
            {' '}questions and answers to practice from.
          </p>

          {/* Community proof */}
          <p style={{
            fontSize: '0.78rem',
            color: '#9a9a9a',
            marginTop: '8px',
            fontWeight: 500
          }}>
            Thousands of Product Managers, Project Managers, Data Science, and Consulting aspirants practicing right now. Your interview could be next week.
          </p>
        </div>

        {/* RIGHT COLUMN  . How It Works in vertical layout */}
        <div className="hero-right" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          {/* Section label */}
          <p style={{
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.95rem',
            color: '#111',
            fontWeight: 600,
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Here's what happens next
          </p>

          {/* Step 1 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              1
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Pick any question
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                Thousands of real questions across Product Management and Data Science by company, role, or topic.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              2
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Answer in your own words
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                No scripts, no templates. Just your thinking, exactly like a real interview.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', width: '100%' }}>
            <span style={{
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
            }}>
              3
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontWeight: 600,
                margin: '0 0 3px',
                color: '#111',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.95rem',
              }}>
                Get scored in seconds
              </p>
              <p style={{
                color: '#6b6b6b',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                wordWrap: 'break-word',
              }}>
                AI scores you across 8 competencies and shows the expert version, so you know exactly what to improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // All reviews for rotating ticker
  const ALL_REVIEWS = [
    { name: 'Shrey Chandra', role: 'Product Manager', text: 'This is something amazing for product managers. I often find it difficult to find a resource where I can practice actual product sense questions.' },
    { name: 'Mridula Rao', role: 'Job Seeker', text: 'Just checked out your AMAZING product. Wanted to THANK YOU!! I am looking at opportunities now and this is by far one of THE BEST products I have seen.', source: 'LinkedIn' },
    { name: 'Harjot Singh Bedi', role: 'Product Manager Aspirant', text: 'This is exactly what I needed before my interviews. The AI feedback is brutally honest.' },
    { name: 'Simranpreet Kaur', role: 'MBA Student', text: 'I answered 3 questions and already knew where I was going wrong. No other platform does this.' },
    { name: 'Sofia Laurent', role: 'Product Manager', text: 'The expert rewrite feature alone is worth it. I could see exactly how a senior Product Manager would answer.' },
    { name: 'Akash Kamble', role: 'DS Aspirant', text: 'Finally a platform that gives real feedback and not just model answers to memorize.' },
    { name: 'Kyaw Zin Thant', role: 'Job Seeker', text: 'I was so nervous about interviews. After a week on InterviewAlpha I actually feel ready.' },
    { name: 'Dhruv Pandit', role: 'Data Scientist', text: 'Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks.' },
    { name: 'Myra Tiwari', role: 'Product Manager Aspirant', text: 'I upgraded to Pro and it was 100% worth it. Unlimited practice changed how I prepare.' },
    { name: 'Sagar Mane', role: 'MBA Student', text: 'The Pro plan pays for itself if you land even one good role. Subscribed without hesitation.' },
    { name: 'Chloe Bennett', role: 'Product Manager', text: 'Worth every penny. I use it every day in the week before interviews now.' },
    { name: 'Navdeep Dhaliwal', role: 'DS Student', text: 'Upgraded to Pro and I practice daily. My confidence has gone through the roof.' },
    { name: 'Tanvi Deshpande', role: 'Product Manager Aspirant', text: 'Scored 4/10 on my first try. A week later I was consistently hitting 8. That\'s the product working.' },
    { name: 'Vishal Jadhav', role: 'Data Scientist', text: 'My SQL answers went from average to structured in 5 sessions. The feedback is that specific.' },
    { name: 'Gauri Joshi', role: 'Job Seeker', text: 'I went from blanking on metrics questions to answering them with confidence. Game changer.' },
    { name: 'Lucas Harrison', role: 'Product Manager Aspirant', text: 'The 8 competency scoring is what sets this apart. You know exactly what to fix.' },
    { name: 'Prachi Kulkarni', role: 'Job Seeker', text: 'Used the free sessions before subscribing. By session 3 I knew I had to upgrade.' },
    { name: 'Gurleen Sandhu', role: 'DS Aspirant', text: 'Used InterviewAlpha the night before my Google interview. Felt so much more prepared.' },
    { name: 'Pooja Gavhane', role: 'Product Manager', text: 'Worth every penny compared to paid coaching. You get better feedback here at a fraction of the cost.' },
    { name: 'Rahul Waghmare', role: 'DS Student', text: 'Love that they have company-specific questions. Practicing Flipkart and Amazon questions separately is so useful.' },
    { name: 'Shreyas Joglekar', role: 'Data Scientist', text: 'I tried 3 other platforms. None of them give feedback like this. InterviewAlpha is in a different league.' },
    { name: 'Aria Mehta', role: 'Product Manager Aspirant', text: 'Other platforms give you answers to memorize. This one teaches you to think. Huge difference.' },
    { name: 'Siddharth Rao', role: 'MBA Student', text: 'The expert rewrite showed me how a senior Product Manager actually structures their thinking. Nothing else does this.' },
    { name: 'Nina Castellano', role: 'DS Aspirant', text: 'I have used YouTube, books, and prep courses. InterviewAlpha is the only thing that actually simulates a real interview.' },
    { name: 'Manreet Oberoi', role: 'MBA Student', text: 'The ATS resume checker found 3 things I had never noticed. Fixed them and started getting more callbacks.' },
    { name: 'Mia Robertson', role: 'Product Manager Aspirant', text: 'The voice answer feature is brilliant. I can practice anywhere, even on my commute.' },
    { name: 'Nguyen Bao Chau', role: 'Data Scientist', text: 'Questions change and feel fresh every time. I never feel like I am just rehearsing the same thing.' },
    { name: 'Elena Volkov', role: 'Job Seeker', text: 'The salary guide is a bonus I didn\'t expect. Now I know exactly what to ask for in negotiations.' },
    { name: 'Rattanakorn Phosri', role: 'DS Student', text: 'Practiced case studies here for 2 weeks before my final round. Cleared it comfortably.' },
    { name: 'Batmunkh Gantulga', role: 'MBA Student', text: 'I improved my product sense score by 3 points in one week. The tips actually work.' },
    { name: 'Omkar Patil', role: 'Product Manager Aspirant', text: 'Subscribed day 1. No regrets. This is the real deal.' },
    { name: 'Rujuta Mahajan', role: 'DS Aspirant', text: 'Worth every penny. Cleared my first data science interview after 2 weeks here.' },
    { name: 'Praewpan Suksomboon', role: 'Product Manager', text: 'Practiced 5 questions the morning of my interview. Got the offer. Coincidence? I think not.' },
    { name: 'Liam Thornton', role: 'Product Manager', text: 'Best investment I made in my job search. Period.' },
  ];

  // Rotating reviews component
  const RotatingReviews = () => {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setIndex(i => (i + 1) % ALL_REVIEWS.length);
          setVisible(true);
        }, 500);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    const review = ALL_REVIEWS[index];

    return (
      <div style={{ background: C.bg, paddingTop: '40px', marginTop: '0' }}>
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          {/* Rotating review card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            border: '1px solid #e4e1db',
            marginBottom: '20px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Quote */}
            <p style={{
              fontSize: '0.95rem',
              color: '#111',
              lineHeight: 1.7,
              fontStyle: 'italic',
              marginBottom: '20px',
              flex: 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              "{review.text}"
            </p>

            {/* Author */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0
              }}>
                {review.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <p style={{ fontWeight: 700, color: '#111', margin: 0, fontSize: '0.88rem' }}>
                  {review.name}
                  {review.source && (
                    <span style={{
                      marginLeft: '8px',
                      background: '#f0f7ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '999px',
                      padding: '1px 8px',
                      fontSize: '0.65rem',
                      color: '#0a66c2',
                      fontWeight: 600,
                      verticalAlign: 'middle'
                    }}>in LinkedIn</span>
                  )}
                </p>
                <p style={{ color: '#9a9a9a', fontSize: '0.75rem', margin: 0 }}>
                  {review.role}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Trust strip section
  const TrustSection = () => <ReviewsDisplay />;

  // Guided paths section
  const GuidedPathsSection = () => (
    <div style={{ background: C.bg, paddingTop: '0' }}>
      <style>{`
        @media (max-width: 768px) {
          .paths-container { padding: 0 20px !important; }
          .paths-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
      <div className="paths-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Section heading */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 900,
          color: '#1B1B18',
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textShadow: '0 0 0 #1B1B18',
        }}>
          Where do you want to start?
        </h2>

        {/* 2x2 grid */}
        <div className="paths-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I have an interview coming up
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Practice company-specific questions
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start prepping
            </button>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I want to test my skills
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Answer one question and see how you score
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Try a question
            </button>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              I'm exploring new roles
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Start with fundamentals for any role
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start with basics
            </button>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E6E1',
            borderRadius: '16px',
            padding: '20px',
            transition: 'border-color 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.text}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Just browsing
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#1B1B18',
              marginBottom: '16px',
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 16px 0',
            }}>
              Thousands of questions with expert answers
            </p>
            <button onClick={() => onNavigate('practice')} style={{
              fontSize: '13px',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Browse questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Product proof section
  const ProductProofSection = () => (
    <div style={{ background: C.bg, paddingTop: '40px', marginBottom: '0' }}>
      <style>{`
        @media (max-width: 768px) {
          .proof-container { padding: 0 20px !important; }
          .proof-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .proof-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="proof-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Section label */}
        <div style={{
          fontSize: '13px',
          letterSpacing: '2px',
          color: '#1B1B18',
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: '48px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textShadow: '0 0 0 #1B1B18',
        }}>
          What you get with every practice session
        </div>

        {/* 5 feature cards grid */}
        <div className="proof-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Practice by category
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Product Management: Product sense, strategy, metrics, behavioral<br />DS: Statistics, ML, SQL, probability, case studies
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Prep by company
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Google, Amazon, Flipkart, Meesho, PhonePe, Razorpay, Zomato, Swiggy
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Instant scored feedback
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              8 competencies scored on every answer you give
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Expert rewrite included
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              See how a senior Product Manager or Data Scientist would answer the same question
            </p>
          </div>

          {/* Card 5 */}
          <div style={{
            background: '#F5F3EF',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '12px',
            }}>
            </div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B1B18',
              marginBottom: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: '0 0 8px 0',
            }}>
              Resume Tools
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#1B1B18',
              margin: 0,
              lineHeight: 1.5,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              ATS score checker and AI resume optimizer for every application
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Coming soon section
  const ComingSoonSection = () => (
    <div style={{ background: C.bg, paddingTop: '40px' }}>
      <style>{`
        @media (max-width: 768px) {
          .coming-container { padding: 0 20px !important; }
        }
      `}</style>
      <div className="coming-container" style={{
        maxWidth: '1080px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px',
        textAlign: 'center',
      }}>
        {/* Section label */}
        <div style={{
          fontSize: '14px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#1B1B18',
          fontWeight: 900,
          marginBottom: '16px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Coming soon
        </div>

        <p style={{
          fontSize: '16px',
          color: C.textSoft,
          lineHeight: 1.6,
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
        }}>
          Software Engineering · Product Design · Analytics
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <HeroSection />
      <FeedbackPreview onNavigate={onNavigate} />
      <GuidedPathsSection />
      <ProductProofSection />
      <TrustSection />
      <ComingSoonSection />
    </div>
  );
}
