import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF',
  text: '#0A0A0A',
  textMuted: '#5C5C57',
  textLight: '#9C9C97',
  border: '#E8E6E1',
  bgMuted: '#F5F3EF',
  green: '#16A34A',
  greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.06)',
  greenBorder: 'rgba(22,163,74,0.2)',
  success: '#1A7F37',
  successLight: 'rgba(26,127,55,0.06)',
  successBorder: 'rgba(26,127,55,0.2)',
  red: '#CF222E',
  redLight: 'rgba(207,34,46,0.06)',
  redBorder: 'rgba(207,34,46,0.18)',
  yellow: '#C27800',
  yellowLight: 'rgba(194,120,0,0.06)',
  yellowBorder: 'rgba(194,120,0,0.15)',
};

const FREE_SESSION_LIMIT = 3;
const PRO_SESSION_LIMIT = 100;
const RAINBOW = 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFBD59, #4ECB71, #36B5FF, #8B5CF6, #D946EF)';

function SubscriptionBadge({ profile, onUpgradeClick }) {
  const status = profile?.subscription_status ?? 'free';
  const used = profile?.free_sessions_used ?? 0;
  const monthly = profile?.monthly_sessions_used ?? 0;

  if (status === 'active') {
    return (
      <span style={{ padding: '4px 10px', background: C.greenLight, border: `1px solid rgba(22,163,74,0.3)`, borderRadius: 20, fontSize: 11, fontWeight: 600, color: C.green, whiteSpace: 'nowrap' }}>
        ◆ Pro · {monthly}/{PRO_SESSION_LIMIT}
      </span>
    );
  }
  if (status === 'pending') {
    return <span style={{ padding: '4px 10px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 20, fontSize: 11, fontWeight: 600, color: C.yellow, whiteSpace: 'nowrap' }}>⏳ Pending</span>;
  }
  if (status === 'expired') {
    return <button onClick={onUpgradeClick} style={{ padding: '4px 10px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 20, fontSize: 11, fontWeight: 600, color: C.red, cursor: 'pointer', whiteSpace: 'nowrap' }}>Expired · Renew</button>;
  }
  const remaining = Math.max(0, FREE_SESSION_LIMIT - used);
  return remaining > 0 ? (
    <span style={{ padding: '4px 10px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 20, fontSize: 11, fontWeight: 600, color: C.success, whiteSpace: 'nowrap' }}>
      {remaining}/{FREE_SESSION_LIMIT} Free Left
    </span>
  ) : (
    <button
      onClick={onUpgradeClick}
      style={{
        padding: '4px 12px',
        background: RAINBOW, border: 'none',
        borderRadius: 20, color: '#fff', fontSize: 11,
        cursor: 'pointer', fontWeight: 600
      }}
    >
      Upgrade ◆
    </button>
  );
}

export default function Nav({ user, page, setPage, onReplayDemo, profile, onUpgradeClick, isAdmin }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = useState(false);
  const avatarRef = useRef(null);
  const isFree = profile?.subscription_status === 'free' || !profile?.subscription_status;

  const tabs = [
    { id: 'interview', label: 'Interview' },
    { id: 'practice', label: 'Practice' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'salary', label: 'Salary Guide' },
    { id: 'resources', label: 'Resources' },
    ...(isFree ? [{ id: 'upgrade', label: '◆ Upgrade' }] : []),
  ];

  const handleNav = (tabId) => {
    setDrawerOpen(false);
    setAvatarDropOpen(false);
    if (tabId === 'upgrade') {
      onUpgradeClick();
    } else {
      setPage(tabId);
    }
  };

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? 'U';

  const navStyles = `
    .nav-tabs {
      display: flex;
      gap: 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: none;
      scrollbar-width: none;
      height: 60px;
      align-items: stretch;
    }
    .nav-tabs::-webkit-scrollbar { display: none; }
    .nav-tab {
      padding: 0 16px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 15px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      letter-spacing: 0.2px;
      color: #6B7280;
      white-space: nowrap;
      cursor: pointer;
      transition: color 0.15s, transform 0.15s;
      display: flex;
      align-items: center;
    }
    .nav-tab:hover { color: #111827; transform: translateY(-1px); }
    .nav-tab.active {
      background: ${RAINBOW};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      border-bottom: 3px solid transparent;
      position: relative;
    }
    .nav-tab.active::after {
      content: '';
      position: absolute;
      bottom: 0; left: 12px; right: 12px;
      height: 3px;
      background: ${RAINBOW};
      border-radius: 2px 2px 0 0;
    }
    .nav-tab.admin { color: ${C.red}; -webkit-text-fill-color: ${C.red}; }
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
    /* Mobile bottom sheet overlay */
    .drawer-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 200;
    }
    /* Mobile bottom sheet */
    .drawer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      z-index: 201;
      display: flex;
      flex-direction: column;
      padding: 0 0 24px;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
      font-family: 'Plus Jakarta Sans', sans-serif;
      border-radius: 24px 24px 0 0;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      max-height: 85vh;
      overflow-y: auto;
    }
    .drawer.open { transform: translateY(0); }
    .drawer-overlay.open { display: block; }
    @media (max-width: 1024px) {
      .nav-user-email { display: none; }
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

      {/* Nav bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 60,
        background: '#FFFFFF',
        borderBottom: `1px solid ${C.border}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', zIndex: 99,
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400, letterSpacing: -0.5, cursor: 'pointer' }} onClick={() => handleNav('interview')}>
            <span style={{ color: C.text }}>I</span><span style={{ color: C.green }}>A</span><sup style={{ fontSize: 10, color: C.textMuted, verticalAlign: 'super' }}>™</sup>
          </span>
        </div>

        {/* Center tabs */}
        <div className="nav-tabs" style={{ flex: 1, justifyContent: 'center', margin: '0 24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab${page === tab.id ? ' active' : ''}`}
              onClick={() => handleNav(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <SubscriptionBadge profile={profile} onUpgradeClick={onUpgradeClick} />

          {/* Avatar with dropdown */}
          <div ref={avatarRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setAvatarDropOpen(v => !v)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: C.bgMuted, border: `1.5px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: C.text,
                cursor: 'pointer', flexShrink: 0
              }}
            >
              {avatarLetter}
            </button>

            {avatarDropOpen && (
              <div style={{
                position: 'absolute', top: 40, right: 0,
                background: '#FFFFFF', border: `1px solid ${C.border}`,
                borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
                minWidth: 200, zIndex: 300, overflow: 'hidden',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.textMuted, wordBreak: 'break-all' }}>
                  {user?.email}
                </div>
                <div style={{ padding: '4px 0' }}>
                  <button onClick={() => handleNav('sessions')} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: C.text, cursor: 'pointer' }}>Past Sessions</button>
                  {isAdmin && <button onClick={() => handleNav('admin')} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: C.red, cursor: 'pointer' }}>Admin</button>}
                  {onReplayDemo && <button onClick={() => { setAvatarDropOpen(false); onReplayDemo(); }} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: C.text, cursor: 'pointer' }}>Tour</button>}
                  <div style={{ margin: '4px 8px', height: 1, background: C.border }} />
                  <button onClick={() => supabase.auth.signOut()} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: 14, color: C.red, cursor: 'pointer' }}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hamburger (mobile only) */}
        <button className="hamburger-btn" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">☰</button>
      </div>

      {/* Bottom sheet overlay */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* Bottom sheet */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        {/* Handle bar */}
        <div style={{ padding: '12px 0 8px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2 }} />
        </div>

        {/* User info */}
        <div style={{ padding: '8px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>{user?.email}</div>
          <SubscriptionBadge profile={profile} onUpgradeClick={() => { setDrawerOpen(false); onUpgradeClick(); }} />
        </div>

        {/* Nav items */}
        <div style={{ padding: '8px 12px', flex: 1 }}>
          {[
            { id: 'interview', label: 'Interview' },
            { id: 'practice', label: 'Practice Q&A' },
            { id: 'scorecard', label: 'Scorecard' },
            { id: 'salary', label: 'Salary Guide' },
            { id: 'resources', label: 'Learning Resources' },
            ...(isFree ? [{ id: 'upgrade', label: '◆ Upgrade' }] : []),
            ...(isAdmin ? [{ id: 'admin', label: 'Admin' }] : []),
            { id: 'sessions', label: 'Past Sessions' },
            { id: 'progress', label: 'My Progress' },
            ...(onReplayDemo ? [{ id: '__tour', label: 'Take Tour' }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === '__tour') { setDrawerOpen(false); onReplayDemo(); }
                else handleNav(tab.id);
              }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '0 16px', height: 56,
                background: tab.id === 'admin' ? 'transparent' : (page === tab.id ? 'rgba(255,107,107,0.07)' : RAINBOW),
                WebkitBackgroundClip: tab.id === 'admin' ? 'unset' : 'text',
                WebkitTextFillColor: tab.id === 'admin' ? C.red : 'transparent',
                backgroundClip: tab.id === 'admin' ? 'unset' : 'text',
                border: 'none',
                borderRadius: 12,
                color: tab.id === 'admin' ? C.red : 'transparent',
                fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 12px' }}>
          <button
            onClick={() => { setDrawerOpen(false); supabase.auth.signOut(); }}
            style={{
              width: '100%', padding: '16px', background: C.redLight,
              border: `1px solid ${C.redBorder}`, borderRadius: 12,
              color: C.red, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer', fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
