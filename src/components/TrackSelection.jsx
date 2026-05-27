export default function TrackSelection({ user, profile, onSelect }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#f0ede8',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: '24px 16px 40px'
    }}>
      {/* Header with progress */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '32px',
        width: '100%'
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              width: i === 1 ? '24px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === 1
                ? 'linear-gradient(135deg, #a8e6cf, #a78bfa)'
                : '#e4e1db'
            }} />
          ))}
        </div>

        {/* Step label */}
        <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0, fontWeight: 700 }}>
          Step 1 of 3 — Choose your track
        </p>

        {/* Welcome name */}
        <p style={{ fontSize: '0.88rem', color: '#6b6b6b', margin: 0, fontWeight: 600 }}>
          Welcome, {user?.user_metadata?.full_name || user?.user_metadata?.name || profile?.display_name || 'there'}! 👋
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '720px', width: '100%', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#111',
          marginBottom: '8px'
        }}>
          What are you preparing for?
        </h2>
        <p style={{ color: '#6b6b6b', marginBottom: '40px', fontSize: '0.92rem' }}>
          We'll show you the right questions and feedback for your track.
        </p>

        {/* Track cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
          className: 'track-selection-grid'
        }}>

          {/* PM Card */}
          <button
            onClick={() => onSelect('pm')}
            style={{
              background: '#ffffff',
              border: '2px solid transparent',
              borderRadius: '16px',
              padding: '28px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '2px solid #a78bfa';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(167,139,250,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📦</div>
            <h3 style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#111',
              marginBottom: '16px'
            }}>
              Product Management
            </h3>

            {/* PM Categories */}
            {[
              { icon: '🎯', label: 'Product Sense', desc: 'Build, improve, design products' },
              { icon: '📊', label: 'Metrics & Analytics', desc: 'Define success, diagnose drops' },
              { icon: '⚙️', label: 'Execution', desc: 'Prioritization, roadmaps, trade-offs' },
              { icon: '🧭', label: 'Strategy', desc: 'Market entry, competition, growth' },
              { icon: '🤝', label: 'Behavioral', desc: 'Leadership, conflict, stakeholders' },
              { icon: '🔢', label: 'Estimation', desc: 'Market sizing, back-of-envelope' },
              { icon: '🏢', label: 'Company Specific', desc: 'Google, Amazon, Meta, Flipkart' },
              { icon: '🧪', label: 'A/B Testing', desc: 'Experiment design and analysis' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}>
              Practice PM Questions →
            </div>
          </button>

          {/* DS Card */}
          <button
            onClick={() => onSelect('ds')}
            style={{
              background: '#ffffff',
              border: '2px solid transparent',
              borderRadius: '16px',
              padding: '28px 24px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '2px solid #7ec8c8';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(126,200,200,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '2px solid transparent';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📊</div>
            <h3 style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#111',
              marginBottom: '16px'
            }}>
              Data Science
            </h3>

            {/* DS Categories */}
            {[
              { icon: '📐', label: 'Statistics & Probability', desc: 'Distributions, hypothesis testing' },
              { icon: '🤖', label: 'Machine Learning', desc: 'Algorithms, model evaluation, tuning' },
              { icon: '🗄️', label: 'SQL & Data Wrangling', desc: 'Queries, joins, window functions' },
              { icon: '📈', label: 'Product Analytics', desc: 'Funnels, cohorts, A/B testing' },
              { icon: '🧠', label: 'ML System Design', desc: 'Build end-to-end ML pipelines' },
              { icon: '🐍', label: 'Python & Coding', desc: 'Data structures, algorithms' },
              { icon: '💼', label: 'Case Studies', desc: 'Real business DS problems' },
              { icon: '🏢', label: 'Company Specific', desc: 'Google, Amazon, Meta, Flipkart' },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '20px',
              background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}>
              Practice DS Questions →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
