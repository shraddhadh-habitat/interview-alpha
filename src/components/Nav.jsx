import { useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#444444',
  border: '#E5E5E5',
  orange: '#E8650A',
  orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)',
  orangeBorder: 'rgba(232,101,10,0.2)',
  golden: '#B8860B',
  green: '#1B8C3A',
  greenLight: 'rgba(27,140,58,0.08)',
  greenBorder: 'rgba(27,140,58,0.2)',
  red: '#D32F2F',
  redLight: 'rgba(211,47,47,0.07)',
  redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00',
  yellowLight: 'rgba(198,127,0,0.06)',
  yellowBorder: 'rgba(198,127,0,0.15)',
};

const FREE_SESSION_LIMIT = 3;
const PRO_SESSION_LIMIT = 100;

function SubscriptionBadge({ profile, onUpgradeClick }) {
  const status = profile?.subscription_status ?? 'free';
  const used = profile?.free_sessions_used ?? 0;
  const monthly = profile?.monthly_sessions_used ?? 0;

  if (status === 'active') {
    return (
      <span style={{ padding: '4px 10px', background: C.orangeLight, border: `1px solid rgba(232,101,10,0.3)`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.orange, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
        ◆ Pro · {monthly}/{PRO_SESSION_LIMIT} this month
      </span>
    );
  }
  if (status === 'pending') {
    return <span style={{ padding: '4px 10px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.yellow, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>⏳ Pending</span>;
  }
  if (status === 'expired') {
    return <button onClick={onUpgradeClick} style={{ padding: '4px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.red, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace", cursor: 'pointer', whiteSpace: 'nowrap' }}>Expired · Renew</button>;
  }
  const remaining = Math.max(0, FREE_SESSION_LIMIT - used);
  return remaining > 0 ? (
    <span style={{ padding: '4px 10px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 20, fontSize: 10, fontWeight: 600, color: C.green, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
      {remaining}/{FREE_SESSION_LIMIT} Free Sessions Left
    </span>
  ) : (
    <button onClick={onUpgradeClick} style={{ padding: '5px 12px', background: 'rgba(232,101,10,0.1)', border: `1px solid rgba(232,101,10,0.3)`, borderRadius: 6, color: C.orange, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>Upgrade</button>
  );
}

export default function Nav({ user, page, setPage, onReplayDemo, profile, onUpgradeClick, isAdmin }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isFree = profile?.subscription_status === 'free' || !profile?.subscription_status;

  const tabs = [
    { id: 'interview', label: 'Interview' },
    { id: 'practice', label: 'Practice Q&A' },
    { id: 'sessions', label: 'Past Sessions' },
    { id: 'progress', label: 'My Progress' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'salary', label: 'Salary Guide' },
    ...(isFree ? [{ id: 'upgrade', label: '◆ Upgrade' }] : []),
    ...(isAdmin ? [{ id: 'admin', label: 'Admin' }] : []),
  ];

  const handleNav = (tabId) => {
    setDrawerOpen(false);
    if (tabId === 'upgrade') {
      onUpgradeClick();
    } else {
      setPage(tabId);
    }
  };

  const navStyles = `
    .nav-tabs {
      display: flex;
      gap: 2px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .nav-tabs::-webkit-scrollbar { display: none; }
    .nav-tabs { -ms-overflow-style: none; scrollbar-width: none; }
    .nav-tabs {
      display: flex;
      gap: 2px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .nav-tabs::-webkit-scrollbar { display: none; }
    .nav-tab {
      padding: 8px 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      color: ${C.golden};
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      font-family: 'DM Mono', monospace;
      font-weight: 700;
      white-space: nowrap;
      transition: all 0.2s;
      min-height: 36px;
    }
    .nav-tab:hover { color: ${C.orange}; }
    .nav-tab.active, .nav-tab.upgrade {
      background: ${C.orangeLight};
      border-color: ${C.orangeBorder};
      color: ${C.orange};
    }
    .nav-tab.admin { color: ${C.red}; }
    .hamburger-btn {
      display: none;
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: ${C.text};
      padding: 0;
      line-height: 1;
      min-height: 44px;
      min-width: 44px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .drawer-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 200;
    }
    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      max-width: 85vw;
      background: #fff;
      z-index: 201;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-shadow: -4px 0 32px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .drawer.open { transform: translateX(0); }
    .drawer-overlay.open { display: block; }
    @media (max-width: 1024px) {
      .nav-user-email { display: none; }
      .nav-tab { padding: 6px 8px; font-size: 10px; }
    }
    @media (max-width: 767px) {
      .nav-tabs { display: none !important; }
      .nav-right { display: none !important; }
      .hamburger-btn { display: flex !important; }
    }
  `;

  return (
    <>
      <style>{navStyles}</style>

      {/* Orange accent line */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.orange}, #D45800)`, zIndex: 100 }} />

      {/* Nav bar */}
      <div style={{ position: 'fixed', top: 3, left: 0, right: 0, height: 52, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 99, fontFamily: "'DM Mono', monospace" }}>
        {/* Logo + Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flex: 1 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: -0.5, flexShrink: 0 }}>
            <span style={{ color: C.golden }}>I</span><span style={{ color: C.orange }}>A</span><sup style={{ fontSize: 12, color: '#E8650A', verticalAlign: 'super' }}>™</sup>
          </span>
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab${page === tab.id ? ' active' : ''}${tab.id === 'upgrade' ? ' upgrade' : ''}${tab.id === 'admin' ? ' admin' : ''}`}
                onClick={() => handleNav(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: user info + logout */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span className="nav-user-email" style={{ fontSize: 11, color: C.textMuted, letterSpacing: 0.5 }}>{user?.email}</span>
          <SubscriptionBadge profile={profile} onUpgradeClick={onUpgradeClick} />
          {onReplayDemo && (
            <button onClick={onReplayDemo} style={{ padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>Tour</button>
          )}
          <button onClick={() => supabase.auth.signOut()} style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>Logout</button>
        </div>

        {/* Hamburger (mobile only) */}
        <button className="hamburger-btn" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">☰</button>
      </div>

      {/* Drawer overlay */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* Drawer */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>
            <span style={{ color: C.golden }}>I</span><span style={{ color: C.orange }}>A</span><sup style={{ fontSize: 10, color: '#E8650A', verticalAlign: 'super' }}>™</sup>
          </span>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: C.textMuted, lineHeight: 1, minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8, wordBreak: 'break-all' }}>{user?.email}</div>
        <div style={{ marginBottom: 20 }}><SubscriptionBadge profile={profile} onUpgradeClick={() => { setDrawerOpen(false); onUpgradeClick(); }} /></div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '14px 16px', minHeight: 48,
                background: page === tab.id ? C.orangeLight : 'transparent',
                border: `1px solid ${page === tab.id ? C.orangeBorder : 'transparent'}`,
                borderRadius: 8,
                color: tab.id === 'admin' ? C.red : (page === tab.id || tab.id === 'upgrade') ? C.orange : C.text,
                fontSize: 14, fontFamily: "'DM Mono', monospace",
                fontWeight: page === tab.id ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setDrawerOpen(false); supabase.auth.signOut(); }}
          style={{ marginTop: 16, width: '100%', padding: '14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 8, color: C.red, fontSize: 13, fontFamily: "'DM Mono', monospace", cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
