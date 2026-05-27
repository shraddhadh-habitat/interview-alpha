import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const REVIEWS = [
  // General praise
  { name: 'Harjot Singh Bedi', role: 'PM Aspirant', text: 'This is exactly what I needed before my interviews. The AI feedback is brutally honest.' },
  { name: 'Simranpreet Kaur', role: 'MBA Student', text: 'I answered 3 questions and already knew where I was going wrong. No other platform does this.' },
  { name: 'Sofia Laurent', role: 'Product Manager', text: 'The expert rewrite feature alone is worth it. I could see exactly how a senior PM would answer.' },
  { name: 'Akash Kamble', role: 'DS Aspirant', text: 'Finally a platform that gives real feedback and not just model answers to memorise.' },
  { name: 'Kyaw Zin Thant', role: 'Job Seeker', text: 'I was so nervous about interviews. After a week on InterviewAlpha I actually feel ready.' },

  // Subscription mentions
  { name: 'Dhruv Pandit', role: 'Data Scientist', text: 'Subscribed after my first free session. Worth every penny — I got an offer within 3 weeks.' },
  { name: 'Myra Tiwari', role: 'PM Aspirant', text: 'I upgraded to Pro and it was 100% worth it. Unlimited practice changed how I prepare.' },
  { name: 'Sagar Mane', role: 'MBA Student', text: 'The Pro plan pays for itself if you land even one good role. Subscribed without hesitation.' },
  { name: 'Chloe Bennett', role: 'Product Manager', text: 'Worth every penny. I use it every day in the week before interviews now.' },
  { name: 'Navdeep Dhaliwal', role: 'DS Student', text: 'Upgraded to Pro and I practice daily. My confidence has gone through the roof.' },

  // Score and improvement
  { name: 'Tanvi Deshpande', role: 'PM Aspirant', text: 'Scored 4/10 on my first try. A week later I was consistently hitting 8. That\'s the product working.' },
  { name: 'Vishal Jadhav', role: 'Data Scientist', text: 'My SQL answers went from average to structured in 5 sessions. The feedback is that specific.' },
  { name: 'Gauri Joshi', role: 'Job Seeker', text: 'I went from blanking on metrics questions to answering them with confidence. Game changer.' },
  { name: 'Lucas Harrison', role: 'PM Aspirant', text: 'The 8 competency scoring is what sets this apart. You know exactly what to fix.' },
  { name: 'Batmunkh Gantulga', role: 'MBA Student', text: 'I improved my product sense score by 3 points in one week. The tips actually work.' },

  // Before interview
  { name: 'Gurleen Sandhu', role: 'DS Aspirant', text: 'Used InterviewAlpha the night before my Google interview. Felt so much more prepared.' },
  { name: 'Praewpan Suksomboon', role: 'Product Manager', text: 'Practiced 5 questions the morning of my interview. Got the offer. Coincidence? I think not.' },
  { name: 'Kiara Desai', role: 'PM Aspirant', text: 'My placement interview is next week and I feel calm for the first time. This platform did that.' },
  { name: 'Rattanakorn Phosri', role: 'DS Student', text: 'Practiced case studies here for 2 weeks before my final round. Cleared it comfortably.' },
  { name: 'Prachi Kulkarni', role: 'Job Seeker', text: 'Used the free sessions before subscribing. By session 3 I knew I had to upgrade.' },

  // Comparison
  { name: 'Shreyas Joglekar', role: 'Data Scientist', text: 'I tried 3 other platforms. None of them give feedback like this. InterviewAlpha is in a different league.' },
  { name: 'Aria Mehta', role: 'PM Aspirant', text: 'Other platforms give you answers to memorise. This one teaches you to think. Huge difference.' },
  { name: 'Siddharth Rao', role: 'MBA Student', text: 'The expert rewrite showed me how a senior PM actually structures their thinking. Nothing else does this.' },
  { name: 'Nina Castellano', role: 'DS Aspirant', text: 'I have used YouTube, books, and prep courses. InterviewAlpha is the only thing that actually simulates a real interview.' },
  { name: 'Pooja Gavhane', role: 'Product Manager', text: 'Worth every penny compared to paid coaching. You get better feedback here at a fraction of the cost.' },

  // Specific features
  { name: 'Mia Robertson', role: 'PM Aspirant', text: 'The voice answer feature is brilliant. I can practice anywhere — even on my commute.' },
  { name: 'Rahul Waghmare', role: 'DS Student', text: 'Love that they have company-specific questions. Practicing Flipkart and Amazon questions separately is so useful.' },
  { name: 'Elena Volkov', role: 'Job Seeker', text: 'The salary guide is a bonus I didn\'t expect. Now I know exactly what to ask for in negotiations.' },
  { name: 'Nguyen Bao Chau', role: 'Data Scientist', text: 'Questions change and feel fresh every time. I never feel like I am just rehearsing the same thing.' },
  { name: 'Manreet Oberoi', role: 'MBA Student', text: 'The ATS resume checker found 3 things I had never noticed. Fixed them and started getting more callbacks.' },

  // Short punchy
  { name: 'Omkar Patil', role: 'PM Aspirant', text: 'Subscribed day 1. No regrets. This is the real deal.' },
  { name: 'Rujuta Mahajan', role: 'DS Aspirant', text: 'Worth every penny. Cleared my first data science interview after 2 weeks here.' },
  { name: 'Liam Thornton', role: 'Product Manager', text: 'Best investment I made in my job search. Period.' },
];

export default function ReviewTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const show = setTimeout(() => setVisible(true), 2000);
    const rotate = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % REVIEWS.length);
        setVisible(true);
      }, 600);
    }, 8000);
    return () => { clearTimeout(show); clearInterval(rotate); };
  }, []);

  if (!mounted) return null;

  const el = document.getElementById('review-ticker-root');
  if (!el) return null;

  const review = REVIEWS[index];

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999,
      background: '#ffffff',
      borderRadius: '16px',
      padding: '20px 24px',
      maxWidth: '300px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid #e4e1db',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      pointerEvents: 'none'
    }}>
      {/* Quote */}
      <p style={{
        fontSize: '0.88rem',
        color: '#111',
        lineHeight: 1.6,
        fontStyle: 'italic',
        marginBottom: '12px',
        margin: '0 0 12px 0',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        "{review.text}"
      </p>

      {/* Attribution */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        <p style={{
          fontWeight: 700,
          color: '#111',
          fontSize: '0.82rem',
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {review.name}
        </p>
        <p style={{
          color: '#9a9a9a',
          fontSize: '0.75rem',
          margin: 0,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          {review.role}
        </p>
      </div>
    </div>,
    el
  );
}
