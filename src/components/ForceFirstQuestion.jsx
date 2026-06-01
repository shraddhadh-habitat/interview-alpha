import { useState } from 'react';

const PM_QUESTIONS = [
  "Zepto delivers in 10 minutes. A competitor just announced 7-minute delivery. You are the PM. Do you match them or differentiate? What is your strategy?",
  "WhatsApp makes almost no money in India but has over 500 million users. You are the PM. How do you build a revenue model without hurting trust or daily engagement?",
  "Google Maps wants to grow revenue by 40% next year without showing more ads. You are the PM. What do you build?",
  "CRED has 10 million users who pay credit card bills. Engagement is dropping. You are the PM. How do you fix it?"
];

const DS_QUESTIONS = [
  "Zomato's delivery time prediction model is 91% accurate overall but restaurant partners say it is wrong all the time. How do you investigate this gap?",
  "Flipkart's recommendation model shows higher CTR after an update but revenue per session drops 8%. How do you explain this and what do you do next?",
  "You built a churn model for a D2C brand. It flags 10,000 users monthly but the sales team can only call 500. How do you decide which 500?",
  "An A/B test shows plus 8% conversion after 2 weeks. Your manager wants to ship immediately. What questions do you ask first?"
];

export default function ForceFirstQuestion({ user, onStart, preferredTrack }) {
  const [track, setTrack] = useState(preferredTrack === 'ds' ? 'ds' : 'pm');

  const questions = track === 'ds' ? DS_QUESTIONS : PM_QUESTIONS;

  // Pick question based on time so it feels fresh
  const questionIndex = Math.floor(Date.now() / (1000 * 60 * 30)) % questions.length;
  const question = questions[questionIndex];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#f0ede8',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
            borderRadius: '12px',
            padding: '8px 20px',
            marginBottom: '16px'
          }}>
            <p style={{ color: 'white', fontWeight: 800, fontSize: '0.82rem', margin: 0 }}>
              InterviewAlpha
            </p>
          </div>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
            fontWeight: 900,
            color: '#111',
            margin: '0 0 10px',
            lineHeight: 1.2
          }}>
            Welcome. Your first question is ready.
          </h1>
          <p style={{ color: '#6b6b6b', fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
            No preparation needed. Just answer like you would in a real interview. Takes 2 minutes.
          </p>
        </div>

        {/* Track switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setTrack('pm')}
            style={{
              background: track === 'pm'
                ? 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)'
                : '#ffffff',
              color: track === 'pm' ? 'white' : '#6b6b6b',
              border: track === 'pm' ? 'none' : '1.5px solid #e4e1db',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            📦 Product Management
          </button>
          <button
            onClick={() => setTrack('ds')}
            style={{
              background: track === 'ds'
                ? 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)'
                : '#ffffff',
              color: track === 'ds' ? 'white' : '#6b6b6b',
              border: track === 'ds' ? 'none' : '1.5px solid #e4e1db',
              borderRadius: '999px',
              padding: '8px 20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Data Science
          </button>
        </div>

        {/* Question card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e4e1db'
        }}>
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
            color: 'white',
            borderRadius: '6px',
            padding: '3px 12px',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            {track === 'pm' ? 'PRODUCT MANAGEMENT' : 'DATA SCIENCE'}
          </span>
          <p style={{
            fontSize: '1rem',
            color: '#111',
            lineHeight: 1.7,
            fontWeight: 600,
            margin: 0
          }}>
            {question}
          </p>
        </div>

        {/* What you will get */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(168,230,207,0.1),rgba(167,139,250,0.1))',
          border: '1.5px solid rgba(167,139,250,0.2)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <p style={{ color: '#111', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>
            After you answer you will get:
          </p>
          {[
            'AI score across 8 competencies',
            'Feedback on exactly what was missing',
            'Expert rewrite showing how a senior interviewer would answer'
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#22c55e', fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
              <p style={{ color: '#444', fontSize: '0.82rem', margin: 0 }}>{item}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onStart(question, track)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            padding: '18px',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(167,139,250,0.4)',
            marginBottom: '12px'
          }}
        >
          Answer this question now →
        </button>

        <p style={{
          color: '#9a9a9a',
          fontSize: '0.75rem',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.6
        }}>
          This is session 1 of your 3 free sessions. No credit card needed.
        </p>

      </div>
    </div>
  );
}
