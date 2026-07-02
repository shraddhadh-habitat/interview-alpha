import { useState, useEffect, useRef } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const dropdownButtonRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  const tabs = [
    { id: 'ats-checker', label: 'ATS Checker' },
    { id: 'resume-optimizer', label: 'Resume Optimizer' },
    { id: 'templates', label: 'Templates' },
    { id: 'resume-score', label: 'Resume Score' },
  ];

  const isMobile = windowWidth < 1024;
  const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Select Tab';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownButtonRef.current && !dropdownButtonRef.current.contains(e.target) &&
        dropdownMenuRef.current && !dropdownMenuRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setDropdownOpen(false);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxSizing: 'border-box',
    }}>
      {/* Hero + Tabs Bar - single sticky container */}
      <div style={{
        position: 'sticky',
        top: NAV_H,
        background: '#FAFAF8',
        zIndex: 10,
        borderBottom: '1px solid #e4e4f0',
      }}>
        {/* Hero section */}
        <div className="resume-tools-hero" style={{ padding: '32px 0' }}>
          <div style={{ width: '100%', maxWidth: 1390, margin: '0 auto', padding: '0 28px', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#4a4a6a', margin: '0 0 8px 0', letterSpacing: 0.5, textTransform: 'uppercase' }}>Tools</p>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, fontWeight: 600, margin: '0 0 8px 0', color: C.text }}>Resume Tools</h1>
              <p style={{ fontSize: 16, color: C.textMuted, margin: 0, lineHeight: 1.6 }}>Optimize your resume for ATS, improve your content, and use professional templates</p>
            </div>
          </div>
        </div>

        {/* Tabs bar — no separate sticky, no top offset */}
        <div style={{ borderTop: '1px solid #e4e4f0' }}>
          <style>{`
            .resume-tabs::-webkit-scrollbar { display: none; }
            .resume-tabs { -ms-overflow-style: none; scrollbar-width: none; }
            .resume-tab-btn {
              background: none;
              border: none;
              transition: all 0.2s;
            }
            .resume-tab-btn.inactive {
              color: #4a4a6a;
              border-bottom: 2px solid transparent;
              font-weight: 500;
            }
            .resume-tab-btn.inactive:hover {
              color: #1B1B18;
            }
            .resume-tab-btn.active {
              border-bottom: 2px solid #a259f7;
              color: #1B1B18;
              font-weight: 500;
            }
            .resume-dropdown-trigger {
              display: none;
            }
            @media (max-width: 1023px) {
              .resume-tabs { display: none !important; }
              .resume-dropdown-trigger { display: flex !important; }
            }
            @media (max-width: 768px) {
              .resume-tab-btn { padding: 12px 14px !important; font-size: 13px !important; min-height: 44px !important; }
            }
            @media (max-width: 768px) {
              .resume-tools-hero {
                padding: 20px 16px;
              }
              .resume-tools-hero h1 {
                font-size: 22px;
              }
              .resume-tools-hero p {
                font-size: 13px;
              }
            }
          `}</style>
          {/* Mobile dropdown trigger */}
          <button
            className="resume-dropdown-trigger"
            ref={dropdownButtonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              position: 'relative',
              padding: '12px 16px',
              minHeight: 60,
              background: '#FFFFFF',
              border: 'none',
              borderBottom: '2px solid transparent',
              fontSize: 13,
              fontWeight: 600,
              color: '#1B1B18',
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: isMobile ? 'flex' : 'none',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            {activeTabLabel}
            <span style={{ fontSize: 16 }}>▼</span>
          </button>

          {/* Mobile dropdown menu */}
          {isMobile && dropdownOpen && (
            <div
              ref={dropdownMenuRef}
              style={{
                position: 'fixed',
                top: `${NAV_H + 60}px`,
                left: 0,
                right: 0,
                background: '#FFFFFF',
                border: `1px solid #e4e4f0`,
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 20,
                overflow: 'hidden',
                maxWidth: '100vw',
              }}
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 16px',
                    background: activeTab === tab.id ? '#a259f7' : '#FFFFFF',
                    border: 'none',
                    borderBottom: tab.id !== tabs[tabs.length - 1].id ? `1px solid ${C.border}` : 'none',
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? '#FFFFFF' : '#4a4a6a',
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = 'rgba(168, 230, 207, 0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.background = '#FFFFFF';
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop inline tabs */}
          <div className="resume-tabs" style={{
            display: isMobile ? 'none' : 'flex',
            overflowX: 'auto',
            overflowY: 'visible',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: '8px',
            padding: '0 28px',
            width: '100%',
            maxWidth: '1390px',
            margin: '0 auto',
            background: '#FAFAF8',
            justifyContent: 'center',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`resume-tab-btn ${activeTab === tab.id ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  minHeight: 'auto',
                  fontSize: 13,
                  fontWeight: 500,
                  color: activeTab === tab.id ? '#1B1B18' : '#4a4a6a',
                  background: 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid #a259f7' : '2px solid transparent',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  border: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#1B1B18';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#4a4a6a';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
