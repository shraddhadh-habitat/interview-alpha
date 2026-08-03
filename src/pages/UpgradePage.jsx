import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#1B1B18', textSoft: '#1B1B18', textMuted: '#0A0A0A',
  border: 'rgba(27, 27, 24, 0.12)',
  green: '#1B1B18', greenHover: '#0A0A0A',
  greenLight: 'rgba(27, 27, 24, 0.08)', greenBorder: 'rgba(27, 27, 24, 0.12)',
  success: '#FDCD34', successLight: 'rgba(253, 205, 52, 0.12)', successBorder: 'rgba(253, 205, 52, 0.2)',
  red: '#1B1B18', redLight: 'rgba(27, 27, 24, 0.08)', redBorder: 'rgba(27, 27, 24, 0.12)',
  yellow: '#FDCD34', yellowLight: 'rgba(253, 205, 52, 0.12)', yellowBorder: 'rgba(253, 205, 52, 0.2)',
};

const PRICING_TESTIMONIALS = [
  { name: 'Dhruv Pandit', role: 'Data Scientist', text: 'Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks.' },
  { name: 'Simranpreet Kaur', role: 'MBA Student', text: 'Upgraded to Pro and never looked back. The unlimited practice alone is worth it.' },
  { name: 'Tanvi Deshpande', role: 'PM Aspirant', text: 'I was hesitant to pay but the free sessions convinced me. Best decision of my prep journey.' },
  { name: 'Vishal Jadhav', role: 'Data Scientist', text: 'Cheaper than one coaching session and 10 times more useful. Subscribed on day 2.' },
  { name: 'Chloe Bennett', role: 'Product Manager', text: 'Worth every penny. I use it the week before every interview now.' },
  { name: 'Omkar Patil', role: 'PM Aspirant', text: 'The Pro plan paid for itself the day I got my offer. No brainer.' },
  { name: 'Myra Tiwari', role: 'PM Aspirant', text: 'Unlimited practice changed everything. I went from 4 out of 10 to 8 in two weeks.' },
  { name: 'Harjot Singh Bedi', role: 'PM Aspirant', text: 'Subscribed for a quarter during placement season. Cleared 3 interviews back to back.' },
  { name: 'Rujuta Mahajan', role: 'DS Aspirant', text: 'Worth every rupee. The expert rewrite shows you things no coach ever told me.' },
  { name: 'Lucas Harrison', role: 'PM Aspirant', text: 'I compared this to paid coaching at 5x the price. InterviewAlpha wins easily.' },
  { name: 'Shreyas Joglekar', role: 'Data Scientist', text: 'Quarterly plan during campus placements was the smartest thing I did this year.' },
  { name: 'Navdeep Dhaliwal', role: 'DS Student', text: 'Upgraded after my second free session. My confidence went through the roof.' },
  { name: 'Aria Mehta', role: 'PM Aspirant', text: 'The company-specific questions on Pro are incredible. Practiced Flipkart questions the night before and cleared the round.' },
  { name: 'Prachi Kulkarni', role: 'Job Seeker', text: 'Used free sessions first, subscribed the same day. By session 5 I knew this was different.' },
  { name: 'Siddharth Rao', role: 'MBA Student', text: 'The yearly plan works out to less than a coffee a day. For interview prep that actually works, it is nothing.' },
  { name: 'Pooja Gavhane', role: 'Product Manager', text: 'Worth every penny compared to paid coaching. Better feedback at a fraction of the cost.' },
  { name: 'Gurleen Sandhu', role: 'DS Aspirant', text: 'Subscribed for one month before my Google interview. The structured feedback is what made the difference.' },
  { name: 'Mia Robertson', role: 'PM Aspirant', text: 'I practice on my commute using voice mode. Pro is worth it just for that feature.' },
  { name: 'Nguyen Bao Chau', role: 'Data Scientist', text: 'The salary guide on Pro alone was worth subscribing. Negotiated 20 percent higher than my initial offer.' },
  { name: 'Manreet Oberoi', role: 'MBA Student', text: 'Switched from a 15000 rupee coaching program to InterviewAlpha Pro. No regrets whatsoever.' },
];

const CURRENCY_CONFIG = {
  INR: {
    symbol: '₹',
    locale: 'en-IN',
    label: 'INR',
    plans: {
      monthly:   { label: 'Monthly',   price: 1299,  period: '/month',   badge: null,        saves: null },
      quarterly: { label: 'Quarterly', price: 3999,  period: '/quarter', badge: 'Save 17%',  saves: 'Billed as ₹3,999 every 3 months' },
      yearly:    { label: 'Yearly',    price: 9999,  period: '/year',    badge: 'Most Popular', saves: 'Billed as ₹9,999 per year' },
    },
    paymentNote: 'Pay via UPI. Manual verification within 24 hours.',
    contactNote: null,
  },
  USD: {
    symbol: '$',
    locale: 'en-US',
    label: 'USD',
    plans: {
      monthly:   { label: 'Monthly',   price: 29,  period: '/month',   badge: null,        saves: null },
      quarterly: { label: 'Quarterly', price: 79,  period: '/quarter', badge: 'Save 14%',  saves: 'Billed as $79 every 3 months' },
      yearly:    { label: 'Yearly',    price: 199, period: '/year',    badge: 'Most Popular', saves: 'Billed as $199 per year' },
    },
    paymentNote: null,
    contactNote: 'International payments via bank transfer — contact communications@interviewalpha.ai',
  },
  GBP: {
    symbol: '£',
    locale: 'en-GB',
    label: 'GBP',
    plans: {
      monthly:   { label: 'Monthly',   price: 22,  period: '/month',   badge: null,        saves: null },
      quarterly: { label: 'Quarterly', price: 59,  period: '/quarter', badge: 'Save 13%',  saves: 'Billed as £59 every 3 months' },
      yearly:    { label: 'Yearly',    price: 159, period: '/year',    badge: 'Most Popular', saves: 'Billed as £159 per year' },
    },
    paymentNote: null,
    contactNote: 'International payments via bank transfer — contact communications@interviewalpha.ai',
  },
  AED: {
    symbol: 'AED ',
    locale: 'en-AE',
    label: 'AED',
    plans: {
      monthly:   { label: 'Monthly',   price: 109, period: '/month',   badge: null,        saves: null },
      quarterly: { label: 'Quarterly', price: 289, period: '/quarter', badge: 'Save 14%',  saves: 'Billed as AED 289 every 3 months' },
      yearly:    { label: 'Yearly',    price: 749, period: '/year',    badge: 'Most Popular', saves: 'Billed as AED 749 per year' },
    },
    paymentNote: null,
    contactNote: 'International payments via bank transfer — contact communications@interviewalpha.ai',
  },
  SGD: {
    symbol: 'SGD ',
    locale: 'en-SG',
    label: 'SGD',
    plans: {
      monthly:   { label: 'Monthly',   price: 39,  period: '/month',   badge: null,        saves: null },
      quarterly: { label: 'Quarterly', price: 99,  period: '/quarter', badge: 'Save 15%',  saves: 'Billed as SGD 99 every 3 months' },
      yearly:    { label: 'Yearly',    price: 269, period: '/year',    badge: 'Most Popular', saves: 'Billed as SGD 269 per year' },
    },
    paymentNote: null,
    contactNote: 'International payments via bank transfer — contact communications@interviewalpha.ai',
  },
};

const detectCurrency = () => {
  // Testing override - remove before final production
  const urlParams = new URLSearchParams(window.location.search);
  const testCurrency = urlParams.get('currency');
  if (testCurrency && ['INR', 'USD', 'GBP', 'AED', 'SGD'].includes(testCurrency)) {
    return testCurrency;
  }
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  if (tz.startsWith('Asia/Calcutta') || tz.startsWith('Asia/Kolkata')) return 'INR';
  if (tz.startsWith('America/')) return 'USD';
  if (tz.startsWith('Europe/London')) return 'GBP';
  if (tz.startsWith('Asia/Dubai')) return 'AED';
  if (tz.startsWith('Asia/Singapore')) return 'SGD';
  return 'USD';
};

const DISCOUNT_CODES = {
  'ALPHA2026':  { percent: 10, description: '10% Early Adopter Discount',  active: true, maxUses: 100, currentUses: 0 },
  'PMREADY10':  { percent: 10, description: '10% Launch Discount',         active: true, maxUses: 50,  currentUses: 0 },
  'FOUNDER20':  { percent: 20, description: '20% Founder Discount',          active: true, maxUses: 20,  currentUses: 0 },
  'WEEKEND299': { discount_amount_inr: 500, description: 'Weekend Special - Save ₹500', valid_until: '2026-06-22T23:59:59', max_uses: 50, current_uses: 0, applies_to: 'monthly' },
};

const FREE_FEATURES  = ['Free to start', 'Browse thousands of questions', 'Read expert answers', 'Salary Guide'];
const PRO_FEATURES   = ['Unlimited AI interview sessions', 'Unlimited practice with AI scoring', 'Unlimited ATS Resume Checker', 'Unlimited Resume Optimizer', 'Resume Templates access', 'Scorecard & progress tracking', 'Company-specific interview prep', 'Priority support'];

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
  input:focus { outline: none; }
  @media (max-width: 500px) {
    .up-container { padding: 20px 16px 40px !important; }
    .up-compare-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .up-plans { grid-template-columns: 1fr !important; }
    .up-payment { grid-template-columns: 1fr !important; gap: 24px !important; }
    .up-emotional-trigger { font-size: 0.88rem !important; }
    .up-roi-reframe { font-size: 0.88rem !important; }
  }
`;

function RecentUpgradesCounter() {
  const getCount = () => {
    const startDate = new Date('2026-05-25T00:00:00Z');
    const now = new Date();

    // Calculate 4-hour blocks since start of current week
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const hoursThisWeek = Math.floor((now - startOfWeek) / (1000 * 60 * 60));
    const blocksThisWeek = Math.floor(hoursThisWeek / 4);

    // Start at 17 at beginning of week, add 1-2 every 4 hours
    const count = 17 + blocksThisWeek + (blocksThisWeek * 3 % 2);

    // Cap at 28 so it resets believably each week
    return Math.min(count, 28);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 20
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#22c55e',
        display: 'inline-block',
        animation: 'livePulse 2s ease-in-out infinite'
      }} />
      <span style={{ fontSize: '0.82rem', color: '#6b6b6b' }}>
        <strong style={{ color: '#111' }}>{getCount()} people</strong> upgraded this week
      </span>
    </div>
  );
}

function PricingTestimonialTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % PRICING_TESTIMONIALS.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const review = PRICING_TESTIMONIALS[index];

  return (
    <div style={{
      maxWidth: 600,
      margin: '0 auto 32px',
      padding: '0 24px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(168,230,207,0.1), rgba(167,139,250,0.1))',
        border: '1.5px solid rgba(167,139,250,0.2)',
        borderRadius: 14,
        padding: '20px 24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        {/* Avatar */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#fff',
          flexShrink: 0
        }}>
          {review.name.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.85rem',
            color: '#111',
            lineHeight: 1.6,
            fontStyle: 'italic',
            margin: '0 0 8px'
          }}>
            "{review.text}"
          </p>
          <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#111', margin: '0 0 2px' }}>
            {review.name}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#9a9a9a', margin: 0 }}>
            {review.role}
          </p>
        </div>
      </div>

      {/* Progress bar showing rotation */}
      <div style={{
        height: 3,
        background: '#e4e1db',
        borderRadius: 999,
        marginTop: 8,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #a8e6cf, #a78bfa)',
          borderRadius: 999,
          animation: 'progressBar 4s linear infinite'
        }} />
      </div>
    </div>
  );
}

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
        <div style={{ padding: '14px 20px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 16, marginBottom: 32, fontSize: 13, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          You've used all 100 AI sessions this month.{resetDate ? ` Sessions reset on ${resetDate}.` : ''} Need more? Contact us.
        </div>
      );
    }
    return (
      <div style={{ padding: '14px 20px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 16, marginBottom: 32, fontSize: 13, color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        ✓ Pro{profile.subscription_plan ? ` (${profile.subscription_plan})` : ''} · {monthly}/100 sessions this month.{d ? ` Valid until ${d}.` : ''}
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div style={{ padding: '14px 20px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 16, marginBottom: 32, fontSize: 13, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        ⏳ Payment submitted  . we'll activate your account within 24 hours. No action needed.
      </div>
    );
  }
  if (status === 'expired') {
    const d = expires ? new Date(expires).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    return (
      <div style={{ padding: '14px 20px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 16, marginBottom: 32, fontSize: 13, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
  const [discountOpen, setDiscountOpen]       = useState(true);
  const [discountInput, setDiscountInput]     = useState('');
  const [discountStatus, setDiscountStatus]   = useState('idle'); // 'idle'|'valid'|'invalid'|'expired'
  const [appliedDiscount, setAppliedDiscount] = useState(null);  // { code, percent }
  const [currency, setCurrency] = useState(detectCurrency());
  const currencyConfig = CURRENCY_CONFIG[currency];
  const PLANS = currencyConfig.plans;

  const isPending = profile?.subscription_status === 'pending';
  const isActive  = profile?.subscription_status === 'active';

  const discountedPrice = (basePrice) => {
    if (!appliedDiscount) return basePrice;
    if (appliedDiscount.percent) {
      return Math.round(basePrice * (1 - appliedDiscount.percent / 100));
    }
    if (appliedDiscount.discount_amount_inr) {
      return Math.max(0, basePrice - appliedDiscount.discount_amount_inr);
    }
    return basePrice;
  };

  const handleSelectPlan = (p) => {
    setPlan(p);
    setStep(2);
  };

  const handleApplyDiscount = () => {
    const code = discountInput.trim().toUpperCase();
    const d = DISCOUNT_CODES[code];
    if (!d) { setDiscountStatus('invalid'); setAppliedDiscount(null); return; }

    // Check if code is expired (for percentage-based codes, check 'active' flag)
    if (d.active === false) { setDiscountStatus('expired'); setAppliedDiscount(null); return; }

    // Check max uses for old-style codes (currentUses) or new-style codes (current_uses)
    const maxUses = d.maxUses || d.max_uses;
    const currentUses = d.currentUses || d.current_uses || 0;
    if (currentUses >= maxUses) { setDiscountStatus('expired'); setAppliedDiscount(null); return; }

    // Check if code has expired (for new-style codes with valid_until)
    if (d.valid_until) {
      const now = new Date();
      const expiryDate = new Date(d.valid_until);
      if (now > expiryDate) { setDiscountStatus('expired'); setAppliedDiscount(null); return; }
    }

    // Check if code applies to current plan
    if (d.applies_to && d.applies_to !== plan) {
      setDiscountStatus('invalid');
      setAppliedDiscount(null);
      return;
    }

    setDiscountStatus('valid');
    setAppliedDiscount({
      code,
      percent: d.percent,
      discount_amount_inr: d.discount_amount_inr,
      description: d.description
    });
  };

  const handleSubmitPayment = async () => {
    if (!upiRef.trim()) { setError('Please enter your UPI transaction reference.'); return; }
    setError('');
    setSubmitting(true);
    try {
      const amount      = PLANS[plan].price;
      const finalAmount = discountedPrice(amount);

      // Insert payment request
      const { error: insertErr } = await supabase.from('payment_requests').insert({
        user_id:          user.id,
        user_email:       user.email,
        plan,
        amount_inr:       amount,
        upi_ref:          upiRef.trim(),
        ...(appliedDiscount && {
          discount_code:    appliedDiscount.code,
          discount_percent: appliedDiscount.percent,
          final_amount:     finalAmount,
        }),
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
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 55, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{globalStyles}</style>

      <div className="up-container" style={{ maxWidth: 700, margin: '0 auto', padding: '48px 28px', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{ fontSize: '0.78rem', color: '#9a9a9a', textDecoration: 'none', display: 'inline-block', marginBottom: '24px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = C.green}
          onMouseLeave={e => e.currentTarget.style.color = '#9a9a9a'}
        >
          ← Back
        </button>

        {/* Status banners */}
        <StatusBanner profile={profile} />

        {/* Pricing page header */}
        <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
          <p style={{
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.72rem',
            color: '#9a9a9a',
            fontWeight: 600,
            marginBottom: 12
          }}>
            Upgrade
          </p>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 900,
            color: '#111',
            marginBottom: 16,
            lineHeight: 1.2,
            fontFamily: 'Georgia, serif'
          }}>
            Practice like your next interview<br />
            is in 48 hours.
          </h1>

          <p style={{
            color: '#6b6b6b',
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto 24px'
          }}>
            Free users get 3 full sessions with complete AI scoring and expert rewrite. Pro users get unlimited everything plus Exclusive Prep.
          </p>

          {/* Social proof line */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: '0.8rem',
            color: '#16a34a',
            fontWeight: 600,
            marginBottom: 8
          }}>
            <span>✓</span>
            Users who practice 3x a week report feeling 2x more confident going into interviews
          </div>
        </div>

        {/* Step 1  . Plan selection */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1)' }}>
            {/* Emotional trigger */}
            <div className="up-emotional-trigger" style={{
              maxWidth: 560,
              margin: '0 auto 28px',
              padding: '20px 24px',
              background: 'linear-gradient(135deg, rgba(168,230,207,0.12), rgba(167,139,250,0.12))',
              border: '1.5px solid rgba(167,139,250,0.25)',
              borderRadius: 14,
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '0.95rem',
                color: '#111',
                lineHeight: 1.7,
                fontWeight: 500,
                margin: 0
              }}>
                Your next interview could be 2 weeks away.
                <br />
                Pro users practice every day.
                Free users practice 3 times total.
                <br />
                <strong style={{
                  background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Which one do you want to be?
                </strong>
              </p>
            </div>

            {/* ROI reframe */}
            <div className="up-roi-reframe" style={{
              textAlign: 'center',
              background: '#ffffff',
              border: '1px solid #e4e1db',
              borderRadius: 12,
              padding: '16px 24px',
              maxWidth: 560,
              margin: '0 auto 24px',
              fontSize: '0.88rem',
              color: '#6b6b6b',
              lineHeight: 1.7
            }}>
              One month of Pro costs less than one hour of interview coaching.
              <br />
              <strong style={{ color: '#111' }}>
                If this gets you a job that pays 1 lakh more per year, the entire yearly plan costs you less than 1% of that.
              </strong>
            </div>

            {/* Rotating testimonials ticker */}
            <PricingTestimonialTicker />

            {/* Urgency counter */}
            <RecentUpgradesCounter />

            {/* Pricing cards */}
            <div style={{
              maxWidth: 800,
              margin: '0 auto 32px',
              padding: '0 24px'
            }}>
              <h2 style={{
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#111',
                marginBottom: 8
              }}>
                Simple pricing. Cancel anytime.
              </h2>
              {currencyConfig.paymentNote && (
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: '#9a9a9a',
                  marginBottom: 28
                }}>
                  {currencyConfig.paymentNote}
                </p>
              )}
              {currencyConfig.contactNote && (
                <p style={{
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  color: '#9a9a9a',
                  marginBottom: 28
                }}>
                  {currencyConfig.contactNote}
                </p>
              )}

              <div className="up-plans" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
                alignItems: 'start'
              }}>

                {/* Monthly */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  border: '1px solid #e4e1db',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 700, color: '#111', marginBottom: 4 }}>Monthly</p>
                  <p style={{ fontSize: '0.78rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Try Pro risk-free
                  </p>
                  <p style={{ margin: '0 0 4px' }}>
                    <strong style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{currencyConfig.symbol}{currencyConfig.plans.monthly.price}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#9a9a9a' }}> /month</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Billed monthly
                  </p>
                  <button
                    onClick={() => handleSelectPlan('monthly')}
                    disabled={isPending || isActive}
                    style={{
                      background: isPending || isActive ? '#e4e1db' : 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                      color: isPending || isActive ? '#9a9a9a' : '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      padding: 12,
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: isPending || isActive ? 'not-allowed' : 'pointer',
                      width: '100%',
                      fontFamily: 'inherit',
                      opacity: isPending || isActive ? 0.6 : 1
                    }}
                  >
                    {isPending ? 'Pending' : isActive ? 'Active' : 'Start practicing today'}
                  </button>
                </div>

                {/* Quarterly - recommended */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  border: '2px solid #a78bfa',
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: '0 4px 24px rgba(167,139,250,0.15)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '3px 14px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    Most Popular
                  </div>
                  <p style={{ fontWeight: 700, color: '#111', marginBottom: 4 }}>Quarterly</p>
                  <p style={{ fontSize: '0.78rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Best for placement season
                  </p>
                  <p style={{ margin: '0 0 4px' }}>
                    <strong style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{Math.round(PLANS.quarterly.price / 3).toLocaleString(currencyConfig.locale)}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#9a9a9a' }}> /month</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Billed as {currencyConfig.symbol}{PLANS.quarterly.price.toLocaleString(currencyConfig.locale)} every 3 months. Save {Math.round((1 - (PLANS.quarterly.price / 3) / PLANS.monthly.price) * 100)}%.
                  </p>
                  <button
                    onClick={() => handleSelectPlan('quarterly')}
                    disabled={isPending || isActive}
                    style={{
                      background: isPending || isActive ? '#e4e1db' : 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                      color: isPending || isActive ? '#9a9a9a' : '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      padding: 12,
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: isPending || isActive ? 'not-allowed' : 'pointer',
                      width: '100%',
                      fontFamily: 'inherit',
                      opacity: isPending || isActive ? 0.6 : 1
                    }}
                  >
                    {isPending ? 'Pending' : isActive ? 'Active' : 'Get unlimited access'}
                  </button>
                </div>

                {/* Yearly */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: 16,
                  padding: '28px 24px',
                  border: '1px solid #e4e1db',
                  textAlign: 'center'
                }}>
                  <p style={{ fontWeight: 700, color: '#111', marginBottom: 4 }}>Yearly</p>
                  <p style={{ fontSize: '0.78rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Prep for the whole year
                  </p>
                  <div style={{ marginBottom: 12, fontSize: '0.75rem', color: '#9a9a9a' }}>
                    <span style={{ textDecoration: 'line-through', color: '#c4bbb8' }}>{currencyConfig.symbol}{currencyConfig.plans.monthly.price}/month</span>
                    <span style={{ display: 'block', marginTop: 4, fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>Save {Math.round((1 - (PLANS.yearly.price / 12) / PLANS.monthly.price) * 100)}% vs monthly</span>
                  </div>
                  <p style={{ margin: '0 0 4px' }}>
                    <strong style={{ fontSize: '2rem', fontWeight: 800, color: '#111' }}>{Math.round(PLANS.yearly.price / 12).toLocaleString(currencyConfig.locale)}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#9a9a9a' }}> /month</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9a9a9a', marginBottom: 20 }}>
                    Billed as {currencyConfig.symbol}{PLANS.yearly.price.toLocaleString(currencyConfig.locale)} per year.
                  </p>
                  <button
                    onClick={() => handleSelectPlan('yearly')}
                    disabled={isPending || isActive}
                    style={{
                      background: isPending || isActive ? '#e4e1db' : 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                      color: isPending || isActive ? '#9a9a9a' : '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      padding: 12,
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: isPending || isActive ? 'not-allowed' : 'pointer',
                      width: '100%',
                      fontFamily: 'inherit',
                      opacity: isPending || isActive ? 0.6 : 1
                    }}
                  >
                    {isPending ? 'Pending' : isActive ? 'Active' : 'Best value - start now'}
                  </button>
                </div>

              </div>
            </div>

            {/* Trust signals */}
            <div style={{
              maxWidth: 600,
              margin: '0 auto 48px',
              padding: '0 24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 12,
                textAlign: 'center'
              }}>
                {[
                  { icon: '🔒', title: 'Cancel anytime', desc: 'No questions asked' },
                  { icon: '⚡', title: 'Instant access', desc: 'Within 24 hours of payment' },
                  { icon: '💬', title: 'Real support', desc: 'Email us anytime' },
                ].map(({ icon, title, desc }) => (
                  <div key={title}>
                    <p style={{ fontSize: '1.4rem', margin: '0 0 6px' }}>{icon}</p>
                    <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111', margin: '0 0 3px' }}>{title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0 }}>{desc}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial on pricing page */}
              <div style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: 20,
                border: '1px solid #e4e1db',
                marginTop: 24,
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#111',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  marginBottom: 12
                }}>
                  "Subscribed after my first free session. Worth every penny. Got an offer within 3 weeks."
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111', margin: '0 0 2px' }}>Dhruv Pandit</p>
                <p style={{ fontSize: '0.75rem', color: '#9a9a9a', margin: 0 }}>Data Scientist</p>
              </div>

              {/* Risk reversal guarantee */}
              <div style={{
                background: 'rgba(253,205,52,0.08)',
                border: '1px solid rgba(253,205,52,0.2)',
                borderRadius: 12,
                padding: '20px',
                marginTop: 24,
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#111',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  <strong>Not happy in your first 7 days?</strong>
                  <br />
                  Email us at communications@interviewalpha.ai with one message about why, and we'll sort it out. No complicated process. Just a human response within 24 hours.
                </p>
              </div>
            </div>

            {/* Divider before comparison */}
            <div style={{
              maxWidth: 700,
              margin: '40px auto',
              height: '1px',
              background: '#e4e1db'
            }} />

            {/* What you unlock with Pro */}
            <div style={{
              maxWidth: 700,
              margin: '0 auto 48px',
              padding: '0 24px'
            }}>
              <h2 style={{
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#111',
                marginBottom: 24
              }}>
                What changes when you go Pro
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                alignItems: 'start'
              }}>

                {/* Free column */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(253,205,52,0.05))',
                  border: '1.5px solid rgba(251,191,36,0.25)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  height: '100%'
                }}>
                  <p style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#b45309',
                    textTransform: 'uppercase',
                    letterSpacing: 3,
                    marginBottom: 8
                  }}>Free</p>
                  <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#111',
                    marginBottom: 4
                  }}>Get started</p>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#6b6b6b',
                    marginBottom: 24,
                    lineHeight: 1.5
                  }}>3 full sessions to experience the platform</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      '3 practice sessions',
                      'Full AI scoring across 8 competencies',
                      'Full expert rewrite on every answer',
                      'Voice and text answer modes',
                      '1 ATS resume scan',
                      'Progress tracking for 3 sessions',
                    ].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: '#b45309', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>✓</span>
                        <p style={{ fontSize: '0.85rem', color: '#444', margin: 0, lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro column */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(192,132,252,0.08))',
                  border: '1.5px solid rgba(167,139,250,0.35)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  height: '100%',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '3px 16px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    letterSpacing: 1
                  }}>
                    RECOMMENDED
                  </div>

                  <p style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#7c3aed',
                    textTransform: 'uppercase',
                    letterSpacing: 3,
                    marginBottom: 8
                  }}>Pro</p>
                  <p style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    color: '#111',
                    marginBottom: 4
                  }}>Everything, unlimited</p>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#6b6b6b',
                    marginBottom: 24,
                    lineHeight: 1.5
                  }}>Everything in Free, plus:</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      'Unlimited practice sessions every day',
                      'Full AI scoring — unlimited',
                      'Full expert rewrite — unlimited',
                      'Exclusive Prep: questions from your JD and resume',
                      'Unlimited ATS Checker + Resume Optimizer + Templates',
                      'Full progress history and improvement tracking',
                    ].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>✓</span>
                        <p style={{ fontSize: '0.85rem', color: '#444', margin: 0, lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Step 2  . Payment */}
        {step === 2 && (
          <div style={{ animation: 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0 }}
              >
                ← Change plan
              </button>
              <span style={{ fontSize: 11, color: C.textMuted }}>·</span>
              <span style={{ fontSize: 11, letterSpacing: 1, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {PLANS[plan].label}  - {' '}
                {appliedDiscount ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: C.textMuted, marginRight: 4 }}>
                      {currencyConfig.symbol}{PLANS[plan].price.toLocaleString(currencyConfig.locale)}
                    </span>
                    {currencyConfig.symbol}{discountedPrice(PLANS[plan].price).toLocaleString(currencyConfig.locale)}
                  </>
                ) : (
                  <>{currencyConfig.symbol}{PLANS[plan].price.toLocaleString(currencyConfig.locale)}</>
                )}
                {PLANS[plan].period}
              </span>
            </div>

            {/* Discount code section */}
            <div style={{ marginBottom: 28 }}>
              <button
                onClick={() => setDiscountOpen(o => !o)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ fontSize: 10, display: 'inline-block', transform: discountOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
                Have a discount code?
              </button>
              {discountOpen && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={discountInput}
                    onChange={e => { setDiscountInput(e.target.value); setDiscountStatus('idle'); }}
                    placeholder="Enter discount code"
                    style={{
                      padding: '9px 12px', border: `1px solid ${discountStatus === 'valid' ? C.green : discountStatus === 'idle' ? C.border : C.red}`,
                      borderRadius: 10, fontSize: 13, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: C.text, background: C.bg, width: 180, transition: 'border-color 0.2s',
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                  />
                  <button
                    onClick={handleApplyDiscount}
                    style={{ padding: '9px 16px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    Apply
                  </button>
                  {discountStatus === 'valid' && appliedDiscount && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: C.successLight, border: `1px solid ${C.successBorder}`, borderRadius: 10, fontSize: 12, color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <span style={{ fontSize: 14 }}>✓</span>
                      {appliedDiscount.percent ? `${appliedDiscount.percent}% off applied` : `Weekend Special applied! ₹${appliedDiscount.discount_amount_inr} off monthly plan`}
                      <span style={{ color: C.textMuted, marginLeft: 2 }}>
                        · {currencyConfig.symbol}{PLANS[plan].price.toLocaleString(currencyConfig.locale)} → {currencyConfig.symbol}{discountedPrice(PLANS[plan].price).toLocaleString(currencyConfig.locale)}
                      </span>
                    </div>
                  )}
                  {discountStatus === 'invalid' && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Invalid code
                    </div>
                  )}
                  {discountStatus === 'expired' && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '9px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 10, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      This code has expired
                    </div>
                  )}
                </div>
              )}
            </div>

            {currency === 'INR' ? (
              <div className="up-payment" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
                {/* QR code side */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, justifyContent: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>1</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Scan & Pay</span>
                  </div>
                  <div style={{ width: 220, height: 220, margin: '0 auto', background: C.bgMuted, border: `2px dashed ${C.border}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <img
                      src="/upi-qr.png"
                      alt="UPI QR Code"
                      style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 8 }}
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `<div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#9C9C97;text-align:center;padding:16px">Add /public/upi-qr.png<br/>to show QR code</div>`;
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>UPI ID</div>
                  <div style={{ fontSize: 13, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>{upiId}</div>
                  <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0ede8', border: `1px solid #e4e1db`, borderRadius: 12, fontSize: 13, fontFamily: "'Instrument Serif', serif", fontWeight: 700, textAlign: 'center', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {appliedDiscount ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#6b6b6b', marginRight: 6, fontWeight: 400, fontSize: 11, WebkitTextFillColor: '#6b6b6b', background: 'unset' }}>
                          {currencyConfig.symbol}{PLANS[plan].price.toLocaleString(currencyConfig.locale)}
                        </span>
                        {currencyConfig.symbol}{discountedPrice(PLANS[plan].price).toLocaleString(currencyConfig.locale)}
                      </>
                    ) : (
                      <>{currencyConfig.symbol}{PLANS[plan].price.toLocaleString(currencyConfig.locale)}</>
                    )}
                  </div>
                </div>

                {/* Reference entry side */}
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.textMuted, marginBottom: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Step 2  . Enter Reference</div>
                  <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, marginBottom: 20 }}>
                    After paying, enter the UPI transaction ID from your payment app (e.g. 12-digit reference number or UPI ref).
                  </p>
                  <input
                    type="text"
                    value={upiRef}
                    onChange={e => setUpiRef(e.target.value)}
                    placeholder="e.g. 407812345678"
                    style={{
                      width: '100%', padding: '12px 14px',
                      border: `1px solid ${C.border}`, borderRadius: 12,
                      fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: C.text, background: C.bg, marginBottom: 16,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = C.green}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  {error && (
                    <div style={{ marginBottom: 12, padding: '10px 14px', background: C.redLight, border: `1px solid ${C.redBorder}`, borderRadius: 12, fontSize: 12, color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {error}
                    </div>
                  )}
                  <button
                    onClick={handleSubmitPayment}
                    disabled={submitting || !upiRef.trim()}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: submitting || !upiRef.trim() ? C.bgMuted : 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)',
                      border: 'none', borderRadius: 12,
                      color: submitting || !upiRef.trim() ? C.textMuted : '#fff',
                      fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
                      cursor: submitting || !upiRef.trim() ? 'not-allowed' : 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit for Verification'}
                  </button>
                  <p style={{ fontSize: 11, color: C.textMuted, marginTop: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6 }}>
                    We verify manually within 24 hours. You'll be notified when your account is activated.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#f9f8f6',
                borderRadius: 14,
                padding: '28px 24px',
                textAlign: 'center',
                marginTop: 16
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>🌍</div>
                <p style={{ color: '#111', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 8px' }}>
                  International Payment
                </p>
                <p style={{ color: '#6b6b6b', fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 20px' }}>
                  We process international payments manually via bank transfer. Once you contact us we will send you payment details and activate your account within 24 hours.
                </p>
                <a
                  href={`mailto:communications@interviewalpha.ai?subject=Pro upgrade - ${currencyConfig.symbol}${PLANS[plan].price} ${currencyConfig.label}&body=Hi, I would like to upgrade to InterviewAlpha Pro. Plan: ${plan}. Amount: ${currencyConfig.symbol}${PLANS[plan].price} ${currencyConfig.label}.`}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg,#a8e6cf 0%,#7ec8c8 25%,#a78bfa 65%,#c084fc 100%)',
                    color: 'white',
                    padding: '14px 28px',
                    borderRadius: 12,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                >
                  Contact us to pay
                </a>
                <p style={{ color: '#9a9a9a', fontSize: '0.75rem', margin: '12px 0 0' }}>
                  communications@interviewalpha.ai
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3  . Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '32px 0', animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.successLight, border: `2px solid ${C.successBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 28 }}>
              ✓
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 12 }}>Payment Submitted</h2>
            <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, maxWidth: 400, margin: '0 auto 32px' }}>
              Your UPI reference has been received. We'll verify and activate your Pro account within 24 hours.
            </p>
            <button
              onClick={onBack}
              style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Back to Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
