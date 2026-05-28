import { useState } from 'react';
import ATSChecker from './ATSChecker';
import ResumeOptimizer from './ResumeOptimizer';
import ResumeTemplates from './ResumeTemplates';

const C = {
  bg: '#FAFAF8',
  bgCard: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.5)',
  border: 'rgba(27, 27, 24, 0.12)',
  yellow: '#FDCD34',
};

const NAV_H = 60;

function ResumeScore() {
  const scores = {
    'ATS Compliance': 82,
    'Content Quality': 75,
    'Format & Design': 88,
    'Experience Depth': 70,
    'Skills Visibility': 85,
    'Achievement Metrics': 68,
  };

  const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b) / Object.keys(scores).length);

  const getColor = (score) => {
    if (score < 50) return '#CF222E';
    if (score < 75) return '#C67F00';
    return '#16A34A';
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.text,
      paddingTop: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: 1080, margin: '0 auto', padding: '32px 28px 48px 28px', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 12,
            color: C.text,
            marginTop: '48px',
            textDecoration: 'none',
            borderBottom: 'none',
            boxShadow: 'none'
          }}>
            Resume Quality Score
          </h1>
          <p style={{
            fontSize: 16,
            color: C.textMuted,
            marginBottom: 0,
            lineHeight: 1.6,
          }}>
            Get an instant quality score on your resume across 6 dimensions
          </p>
        </div>

        <div style={{
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: getColor(overallScore),
            marginBottom: 8,
          }}>
            {overallScore}/100
          </div>
          <p style={{
            fontSize: 14,
            color: C.textMuted,
            margin: 0,
          }}>
            Overall Quality Score
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}>
          {Object.entries(scores).map(([dimension, score]) => (
            <div key={dimension} style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20,
            }}>
              <p style={{
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                margin: '0 0 12px 0',
              }}>
                {dimension}
              </p>
              <div style={{
                background: 'rgba(27, 27, 24, 0.06)',
                borderRadius: 8,
                height: 8,
                marginBottom: 12,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${score}%`,
                  background: getColor(score),
                  borderRadius: 8,
                  transition: 'width 0.3s',
                }} />
              </div>
              <p style={{
                fontSize: 16,
                fontWeight: 700,
                color: getColor(score),
                margin: 0,
              }}>
                {score}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'rgba(253, 205, 52, 0.1)',
          border: '1px solid rgba(253, 205, 52, 0.2)',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 13,
            color: C.textMuted,
            margin: 0,
          }}>
            ✨ Coming soon: AI-powered detailed scoring. For now, these are example scores.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResumeToolsHub({ user }) {
  const [activeTab, setActiveTab] = useState('ats-checker');

  const tabs = [
    { id: 'ats-checker', label: 'ATS Checker' },
    { id: 'resume-optimizer', label: 'Resume Optimizer' },
    { id: 'templates', label: 'Templates' },
    { id: 'resume-score', label: 'Resume Score' },
  ];

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Tabs Bar */}
      <div style={{
        position: 'sticky',
        top: NAV_H,
        background: C.bgCard,
        borderBottom: `2px solid ${C.yellow}`,
        zIndex: 10,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <style>{`
          .resume-tabs::-webkit-scrollbar { display: none; }
          .resume-tabs { -ms-overflow-style: none; scrollbar-width: none; }
          .resume-tab-btn {
            background: none;
            border: none;
            transition: all 0.2s;
          }
          .resume-tab-btn.inactive {
            background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .resume-tab-btn.inactive:hover {
            opacity: 0.85;
          }
          .resume-tab-btn.active {
            background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%);
            border-radius: 8px;
            color: #ffffff;
            -webkit-text-fill-color: unset;
          }
          @media (max-width: 768px) {
            .resume-tab-btn { padding: 12px 14px !important; font-size: 12px !important; min-height: 44px !important; }
          }
        `}</style>
        <div className="resume-tabs" style={{
          display: 'flex',
          margin: '0 auto',
          overflowX: 'auto',
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: '8px',
          padding: '8px 16px',
          width: '100%',
          boxSizing: 'border-box',
          maxWidth: '100%',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`resume-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: activeTab === tab.id ? '6px 14px' : '16px 24px',
                minHeight: activeTab === tab.id ? 'auto' : 60,
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === tab.id ? '#ffffff' : undefined,
                WebkitTextFillColor: activeTab === tab.id ? '#ffffff' : undefined,
                background: activeTab === tab.id ? 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)' : 'transparent',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                border: 'none',
                borderRadius: activeTab === tab.id ? '8px' : '0',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.opacity = '0.85';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'ats-checker' && <ATSChecker user={user} />}
        {activeTab === 'resume-optimizer' && <ResumeOptimizer user={user} />}
        {activeTab === 'templates' && (
          <div style={{ width: '100%', paddingTop: 0, boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ResumeTemplates hideAtsButton={true} />
          </div>
        )}
        {activeTab === 'resume-score' && <ResumeScore />}
      </div>
    </div>
  );
}
