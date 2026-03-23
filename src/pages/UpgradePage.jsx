import { useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAFA', bgMuted: '#F5F5F5',
  text: '#1A1A1A', textSoft: '#1A1A1A', textMuted: '#444444',
  border: '#E5E5E5',
  orange: '#E8650A', orangeHover: '#D45800',
  orangeLight: 'rgba(232,101,10,0.08)', orangeBorder: 'rgba(232,101,10,0.2)',
  green: '#1B8C3A', greenLight: 'rgba(27,140,58,0.08)', greenBorder: 'rgba(27,140,58,0.2)',
  red: '#D32F2F', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
};

const PLANS = {
  monthly: { label: 'Monthly', price: 699,  period: '/month', saves: null },
  yearly:  { label: 'Yearly',  price: 6999, period: '/year',  saves: 'Save ₹1,389' },
};

const FREE_FEATURES  = ['3 free AI interview sessions', 'Browse 1100+ question bank', 'Read expert answers'];
const PRO_FEATURES   = ['100 AI sessions per month', 'Live interviews + practice evaluations', 'Full feedback scorecard per session', 'Voice-to-text answers', 'Full session history', 'Leaderboard ranking'];

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
  input:focus { outline: none; }
`;

function StatusBanner({ profile }) {
  const status = profile?.subscription_status;
  const expires = profile?.subscription_expires_at;

  if (status === 'active') {
    const d       = expires ? new Date(expires).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    const monthly = profile?.monthly_sessions_used ?? 0;
    const resetAt = profile?.monthly_sessions_reset_at;
    const resetDate = resetAt
      ? new Date(new Date(resetAt).getTime() + 30 * 24 * 60 * 60 * 1000)
          .toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
      : null;
    if (monthly >= 100) {
      return (
        <div style={{ padding: '14px 20px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, marginBottom: 32, fontSize: 13, color: C.red, fontFamily: "'DM Mono', monospace" }}>
          You've used all 100 AI sessions this month.{resetDate ? ` Sessions reset on ${resetDate}.` : ''} Need more? Contact us.
        </div>
      );
    }
    return (
      <div style={{ padding: '14px 20px', background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 10, marginBottom: 32, fontSize: 13, color: C.green, fontFamily: "'DM Mono', monospace" }}>
        ✓ Pro{profile.subscription_plan ? ` (${profile.subscription_plan})` : ''} · {monthly}/100 sessions this month.{d ? ` Valid until ${d}.` : ''}
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div style={{ padding: '14px 20px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 10, marginBottom: 32, fontSize: 13, color: C.yellow, fontFamily: "'DM Mono', monospace" }}>
        ⏳ Payment submitted — we'll activate your account within 24 hours. No action needed.
      </div>
    );
  }
  if (status === 'expired') {
    const d = expires ? new Date(expires).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    return (
      <div style={{ padding: '14px 20px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, marginBottom: 32, fontSize: 13, color: C.red, fontFamily: "'DM Mono', monospace" }}>
        Your Pro subscription expired{d ? ` on ${d}` : ''}. Renew below to continue.
      </div>
    );
  }
  return null;
}

export default function UpgradePage({ user, profile, onBack }) {
  const [step, setStep] = useState(1);         // 1=plans, 2=payment, 3=submitted
  const [plan, setPlan] = useState('monthly');
  const [upiRef, setUpiRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isPending = profile?.subscription_status === 'pending';
  const isActive  = profile?.subscription_status === 'active';

  const handleSelectPlan = (p) => {
    setPlan(p);
    setStep(2);
  };

  const handleSubmitPayment = async () => {
    if (!upiRef.trim()) { setError('Please enter your UPI transaction reference.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const amount = PLANS[plan].price;

      // Insert payment request
      const { error: insertErr } = await supabase.from('payment_requests').insert({
        user_id:    user.id,
        user_email: user.email,
        plan,
        amount_inr: amount,
        upi_ref:    upiRef.trim(),
      });
      if (insertErr) throw insertErr;

      // Mark profile as pending
      await supabase.from('profiles').upsert({
        id:                    user.id,
        subscription_status:   'pending',
        payment_upi_ref:       upiRef.trim(),
        payment_submitted_at:  new Date().toISOString(),
      }, { onConflict: 'id' });

      setStep(3);
    } catch (e) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const upiId = import.meta.env.VITE_UPI_ID || 'yourname@upi';

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'DM Mono', monospace" }}>
      <style>{globalStyles}</style>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '48px 28px', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", marginBottom: 32, padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = C.orange}
          onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
        >
          ← Back
        </button>

        {/* Status banners */}
        <StatusBanner profile={profile} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 5, color: C.orange, textTransform: 'uppercase', marginBottom: 12 }}>Upgrade</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 12 }}>
            Go Pro. Land the Role.
          </h1>
          <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            100 AI sessions per month — mock interviews, practice evaluations, and complete session history — everything you need to land the role.
          </p>
        </div>

        {/* Step 1 — Plan selection */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Plan comparison table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
              {/* Header row */}
              <div style={{ padding: '14px 16px', background: C.bgMuted, borderBottom: `1px solid ${C.border}` }} />
              {['Free', 'Pro'].map(tier => (
                <div key={tier} style={{ padding: '14px 16px', background: tier === 'Pro' ? C.orangeLight : C.bgMuted, borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: tier === 'Pro' ? C.orange : C.textMuted, fontWeight: 600 }}>{tier}</span>
                </div>
              ))}
              {/* Feature rows */}
              {[
                ['AI Sessions / Month', '3 (free)', '100'],
                ['Live Interviews',     '3 (free)', '100 sessions/mo'],
                ['Feedback Scorecard', '✓', '✓'],
                ['Voice-to-Text', '✓', '✓'],
                ['Session History', '✓', '✓'],
                ['Leaderboard', '✓', '✓'],
              ].map(([feat, freeVal, proVal]) => (
                <div key={feat} style={{ display: 'contents' }}>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontSize: 12, color: C.textSoft, fontFamily: "'Source Serif 4', serif" }}>{feat}</div>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, textAlign: 'center', fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{freeVal}</div>
                  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, borderLeft: `1px solid ${C.border}`, textAlign: 'center', fontSize: 12, color: C.green, fontFamily: "'DM Mono', monospace', fontWeight: 600" }}>{proVal}</div>
                </div>
              ))}
            </div>

            {/* Pricing cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {Object.entries(PLANS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => handleSelectPlan(key)}
                  disabled={isPending || isActive}
                  style={{
                    padding: '24px 20px',
                    background: key === 'yearly' ? C.orangeLight : C.bg,
                    border: `2px solid ${key === 'yearly' ? C.orange : C.border}`,
                    borderRadius: 12, cursor: isPending || isActive ? 'not-allowed' : 'pointer',
                    textAlign: 'left', position: 'relative',
                    transition: 'all 0.2s', opacity: isPending || isActive ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!isPending && !isActive) e.currentTarget.style.borderColor = C.orange; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = key === 'yearly' ? C.orange : C.border; }}
                >
                  {key === 'yearly' && (
                    <div style={{ position: 'absolute', top: -1, right: 16, background: C.orange, color: '#fff', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '0 0 6px 6px', fontFamily: "'DM Mono', monospace" }}>
                      Best Value
                    </div>
                  )}
                  <div style={{ fontSize: 11, letterSpacing: 2, color: C.textMuted, marginBottom: 12 }}>{p.label.toUpperCase()}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.text }}>₹{p.price.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>{p.period}</span>
                  </div>
                  {p.saves && (
                    <div style={{ fontSize: 11, color: C.green, fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>{p.saves}</div>
                  )}
                  <div style={{ marginTop: 16, padding: '10px 16px', background: key === 'yearly' ? C.orange : C.bg, border: `1px solid ${key === 'yearly' ? C.orange : C.border}`, borderRadius: 6, fontSize: 11, color: key === 'yearly' ? '#fff' : C.orange, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', fontWeight: 500 }}>
                    {isPending ? 'Pending' : isActive ? 'Active' : 'Choose Plan →'}
                  </div>
                </button>
              ))}
            </div>

            <p style={{ fontSize: 11, color: C.textMuted, textAlign: 'center', fontFamily: "'DM Mono', monospace" }}>
              Pay via UPI · Manual verification within 24 hours · No subscription auto-renewal
            </p>
          </div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", padding: 0 }}
              >
                ← Change plan
              </button>
              <span style={{ fontSize: 11, color: C.textMuted }}>·</span>
              <span style={{ fontSize: 11, letterSpacing: 1, color: C.orange, fontFamily: "'DM Mono', monospace" }}>
                {PLANS[plan].label} — ₹{PLANS[plan].price.toLocaleString('en-IN')}{PLANS[plan].period}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
              {/* QR code side */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>Step 1 — Scan & Pay</div>
                <div style={{ width: 200, height: 200, margin: '0 auto', background: C.bgMuted, border: `1px solid ${C.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <img
                    src="/upi-qr.png"
                    alt="UPI QR Code"
                    style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 8 }}
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `<div style="font-family:'DM Mono',monospace;font-size:11px;color:#999;text-align:center;padding:16px">Add /public/upi-qr.png<br/>to show QR code</div>`;
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>UPI ID</div>
                <div style={{ fontSize: 13, color: C.text, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{upiId}</div>
                <div style={{ marginTop: 12, padding: '8px 12px', background: C.orangeLight, border: `1px solid ${C.orangeBorder}`, borderRadius: 8, fontSize: 13, color: C.orange, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                  ₹{PLANS[plan].price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Reference entry side */}
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>Step 2 — Enter Reference</div>
                <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.7, marginBottom: 20 }}>
                  After paying, enter the UPI transaction ID from your payment app (e.g. 12-digit reference number or UPI ref).
                </p>
                <input
                  type="text"
                  value={upiRef}
                  onChange={e => setUpiRef(e.target.value)}
                  placeholder="e.g. 407812345678"
                  style={{
                    width: '100%', padding: '12px 14px',
                    border: `1px solid ${C.border}`, borderRadius: 8,
                    fontSize: 14, fontFamily: "'DM Mono', monospace",
                    color: C.text, background: C.bg, marginBottom: 16,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = C.orange}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                {error && (
                  <div style={{ marginBottom: 12, padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 8, fontSize: 12, color: C.red, fontFamily: "'DM Mono', monospace" }}>
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSubmitPayment}
                  disabled={submitting || !upiRef.trim()}
                  style={{
                    width: '100%', padding: '13px 0',
                    background: submitting || !upiRef.trim() ? C.bgMuted : C.orange,
                    border: 'none', borderRadius: 8,
                    color: submitting || !upiRef.trim() ? C.textMuted : '#fff',
                    fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                    cursor: submitting || !upiRef.trim() ? 'not-allowed' : 'pointer',
                    fontFamily: "'DM Mono', monospace", fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit for Verification →'}
                </button>
                <p style={{ fontSize: 11, color: C.textMuted, marginTop: 10, fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                  We verify manually within 24 hours. You'll be notified when your account is activated.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '32px 0', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.greenLight, border: `2px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12 }}>Payment Submitted</h2>
            <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Source Serif 4', serif", lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
              Your UPI reference has been received. We'll verify and activate your Pro account within 24 hours.
            </p>
            <button
              onClick={onBack}
              style={{ padding: '12px 32px', background: C.orange, border: 'none', borderRadius: 8, color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.background = C.orangeHover}
              onMouseLeave={e => e.currentTarget.style.background = C.orange}
            >
              Back to Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
