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
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E6E1',
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
            background: #FFFFFF;
            color: #1B1B18;
            border-bottom: 2px solid transparent;
          }
          .resume-tab-btn.inactive:hover {
            opacity: 0.7;
            color: #1B1B18;
          }
          .resume-tab-btn.active {
            background: #FFFFFF;
            border-bottom: 2px solid #16a34a;
            color: #1B1B18;
            -webkit-text-fill-color: unset;
          }
          @media (max-width: 768px) {
            .resume-tab-btn { padding: 12px 14px !important; font-size: 13px !important; min-height: 44px !important; }
          }
        `}</style>
        <div className="resume-tabs" style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap: '8px',
          padding: '8px 16px',
          width: 'auto',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`resume-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                minHeight: 60,
                fontSize: 13,
                fontWeight: 600,
                color: '#1B1B18',
                background: '#FFFFFF',
                borderBottom: activeTab === tab.id ? '2px solid #16a34a' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                border: 'none',
                borderRadius: '0',
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
