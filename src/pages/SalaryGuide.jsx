import { useState, useEffect, useCallback } from 'react';

const C = {
  bg: '#FFFFFF', bgSoft: '#FAFAF8', bgMuted: '#F5F3EF',
  text: '#0A0A0A', textSoft: '#0A0A0A', textMuted: '#5C5C57',
  border: '#E8E6E1',
  green: '#16A34A', greenHover: '#15803D',
  greenLight: 'rgba(22,163,74,0.08)', greenBorder: 'rgba(22,163,74,0.2)',
  success: '#1A7F37', successLight: 'rgba(27,140,58,0.08)', successBorder: 'rgba(27,140,58,0.2)',
  red: '#CF222E', redLight: 'rgba(211,47,47,0.07)', redBorder: 'rgba(211,47,47,0.18)',
  yellow: '#C67F00', yellowLight: 'rgba(198,127,0,0.06)', yellowBorder: 'rgba(198,127,0,0.15)',
  golden: '#B8860B',
};

const globalStyles = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  * { box-sizing: border-box; }
  body { overflow-x: hidden; }
  @media (max-width: 768px) {
    .sg-page-pad { padding: 24px 16px !important; }
    .sg-section-pad { padding: 16px 16px 24px !important; }
    .sg-section-btn { padding: 18px 20px !important; min-height: 44px !important; }
    .sg-table { overflow-x: auto !important; }
    .sg-select { width: 100% !important; min-height: 44px !important; font-size: 16px !important; }
    .sg-text { font-size: 15px !important; line-height: 1.7 !important; }
  }
`;

// ─── Salary Data ───
const IN_SALARIES = [
  { level: 'APM / Associate PM', tc: '₹12–22 LPA', base: '₹10–18 LPA', bonus: '10–15%', equity: 'Options at Series B+' },
  { level: 'PM (2–4 yrs)', tc: '₹22–40 LPA', base: '₹18–32 LPA', bonus: '12–20%', equity: '₹5–15 L vesting 4yr' },
  { level: 'Senior PM (4–7 yrs)', tc: '₹40–75 LPA', base: '₹30–55 LPA', bonus: '15–25%', equity: '₹15–40 L vesting 4yr' },
  { level: 'Lead PM / GPM (7–10 yrs)', tc: '₹75–120 LPA', base: '₹55–85 LPA', bonus: '20–30%', equity: '₹40–80 L vesting 4yr' },
  { level: 'Director of Product', tc: '₹1.2–2 Cr', base: '₹80 L–1.2 Cr', bonus: '25–35%', equity: '₹80 L–2 Cr vesting 4yr' },
  { level: 'VP / Head of Product', tc: '₹2–4 Cr', base: '₹1.2–2.5 Cr', bonus: '30–50%', equity: '₹1–4 Cr vesting 4yr' },
  { level: 'CPO', tc: '₹4–10 Cr+', base: '₹2–5 Cr', bonus: '50–100%', equity: 'Negotiable + ESOP' },
];

const US_SALARIES = [
  { level: 'APM / Associate PM', tc: '$120–160K', base: '$105–140K', bonus: '10–15%', equity: '$15–30K RSU/yr' },
  { level: 'PM (2–4 yrs)', tc: '$160–220K', base: '$130–175K', bonus: '12–18%', equity: '$30–60K RSU/yr' },
  { level: 'Senior PM (4–7 yrs)', tc: '$220–320K', base: '$160–220K', bonus: '15–20%', equity: '$60–120K RSU/yr' },
  { level: 'Lead PM / Group PM', tc: '$300–430K', base: '$190–270K', bonus: '20–25%', equity: '$100–200K RSU/yr' },
  { level: 'Director of Product', tc: '$400–580K', base: '$230–320K', bonus: '25–35%', equity: '$150–280K RSU/yr' },
  { level: 'VP of Product', tc: '$550–850K', base: '$280–400K', bonus: '35–50%', equity: '$250–500K RSU/yr' },
  { level: 'CPO', tc: '$1M–3M+', base: '$400–700K', bonus: '50–100%', equity: 'Negotiable' },
];

const COMPANY_COMP = [
  { company: 'Google', levels: 'L4–L7', tc_in: '₹50–180 LPA', tc_us: '$200–600K', notes: 'Heavy RSU, strong L6+ jump' },
  { company: 'Amazon', levels: 'SDE/PM 4–7', tc_in: '₹40–140 LPA', tc_us: '$180–500K', notes: 'Low base, high RSU back-load' },
  { company: 'Meta', levels: 'IC3–IC6', tc_in: '₹60–200 LPA', tc_us: '$230–700K', notes: 'Best equity refresh in FAANG' },
  { company: 'Apple', levels: 'PM 1–5', tc_in: '₹45–160 LPA', tc_us: '$200–550K', notes: 'Secretive; RSU heavy, long vest' },
  { company: 'Microsoft', levels: 'PM 59–67', tc_in: '₹35–140 LPA', tc_us: '$175–500K', notes: 'Strong WLB; good base' },
  { company: 'Flipkart', levels: 'PM 1–3', tc_in: '₹25–80 LPA', tc_us: ' - ', notes: 'ESOP potential; fast growth' },
  { company: 'Razorpay', levels: 'PM–SPM', tc_in: '₹22–65 LPA', tc_us: ' - ', notes: 'Strong ESOP upside at Series D+' },
  { company: 'CRED', levels: 'PM–GPM', tc_in: '₹28–80 LPA', tc_us: ' - ', notes: 'High equity, intense culture' },
  { company: 'Swiggy', levels: 'PM–SPM', tc_in: '₹25–70 LPA', tc_us: ' - ', notes: 'Pre-IPO opportunity' },
  { company: 'Zepto', levels: 'PM–GPM', tc_in: '₹22–75 LPA', tc_us: ' - ', notes: 'Hyper-growth; high equity value' },
];

const NEG_STEPS = [
  {
    step: 1, title: 'Anchor high  . always',
    body: "The first number mentioned sets the anchor for the entire negotiation. Never share your current salary. Instead, state a range where your floor is already above their ceiling. If asked, say: \"I'm targeting ₹X–Y based on my research and total compensation.\"",
    script: '"Based on my experience and market data for this role, I\'m targeting ₹[X] all-in. Does that align with your band?"',
  },
  {
    step: 2, title: 'Never accept on the spot',
    body: 'Even if the offer is exactly what you wanted, pause. A hasty yes signals that you left money on the table. Always ask for time  . 24–72 hours  . to review the full offer in writing.',
    script: '"Thank you so much  . this is exciting. Can I have a couple of days to review the full package?"',
  },
  {
    step: 3, title: 'Negotiate the full package',
    body: 'Base salary is just one lever. Push on signing bonus, RSU cliff, equity refresh schedule, title, start date flexibility, remote policy, and learning budget. A ₹2L signing bonus has zero recurring cost to them.',
    script: '"The base works. Can we discuss the signing bonus and perhaps accelerate the RSU cliff from 12 months to 6?"',
  },
  {
    step: 4, title: 'Use competing offers  . ethically',
    body: 'A real competing offer is your strongest card. You don\'t need to name the company  . just the number. If you don\'t have one, reference market data from levels.fyi, Glassdoor, or LinkedIn Salary.',
    script: '"I have another offer in the ₹X range, but I\'d prefer to join your team. Is there room to move closer to that number?"',
  },
  {
    step: 5, title: 'Know your walk-away number',
    body: 'Before any call, write down your minimum acceptable offer. Never negotiate live without this. When you\'re at your floor, say so clearly  . it\'s a powerful close. "This is my minimum  . I can\'t go lower."',
    script: '"I\'ve thought carefully and ₹X is the minimum I can accept. I really want to make this work  . is that possible?"',
  },
];

const COUNTER_TEMPLATES = [
  {
    scenario: 'Offer below target',
    template: `Thank you for the offer  . I'm genuinely excited about the role and the team. After reviewing the package, the base of ₹[X] is below my target of ₹[Y]. Given my [specific skill/experience], I'd like to ask if ₹[Y] is achievable. I'm flexible on the equity/signing bonus split if needed.`,
  },
  {
    scenario: 'Match a competing offer',
    template: `I've received another offer at ₹[X] all-in. I'd strongly prefer to join [Company] because of [specific reason], but I need the packages to be closer. Can you get to ₹[Y] or add a signing bonus of ₹[Z] to bridge the gap?`,
  },
  {
    scenario: 'Request signing bonus',
    template: `The base and equity look strong. One gap is that I'll be leaving behind unvested RSUs/bonus of approximately ₹[X] at my current company. Would you be able to offer a signing bonus to offset that? Something in the ₹[Y] range would make this a very easy decision.`,
  },
  {
    scenario: 'Negotiate title alongside comp',
    template: `I noticed the offer is for PM-2. Based on my [X years of experience / scope of past work], I'd be a stronger fit at Senior PM. The title matters for my trajectory here. Would you be open to revisiting the level  . which would naturally bring the comp into the right range?`,
  },
  {
    scenario: 'Accelerate equity cliff',
    template: `Everything looks great. One ask: could we reduce the equity cliff from 12 months to 6? Given the risk of joining at this stage, having a faster initial vest would make the decision easier and signal mutual commitment.`,
  },
  {
    scenario: 'Remote / hybrid flexibility',
    template: `I'm excited about the role. I'd like to discuss the remote policy  . I'm currently set up to work from [city] 3 days a week. If we can agree on a hybrid arrangement of [X days], I can sign immediately. I don't need a relocation package.`,
  },
  {
    scenario: 'Politely decline and leave door open',
    template: `Thank you for the time and the offer  . I have real respect for the team and what you're building. After careful consideration, I've decided to accept another offer that was a better fit for where I am right now. I hope we can stay in touch, and I'd welcome the chance to work together in the future.`,
  },
];

const MISTAKES = [
  { title: 'Negotiating against yourself', body: 'Saying "I know this might be too much, but..." before stating your ask signals weakness. State your number confidently and stop talking. Silence is a tool.' },
  { title: 'Accepting verbally before seeing it in writing', body: 'A verbal offer is not an offer. Always get the full package in writing  . including equity details, vesting schedule, and cliff  . before making any commitment.' },
  { title: 'Treating equity as fake money', body: 'Especially at Series B+ startups, equity can 5–50x. Model both the bull and bear case. Ask: liquidation preference, current 409A, last round valuation, total shares outstanding.' },
  { title: 'Not negotiating because "you\'re grateful"', body: 'Recruiters expect negotiation. Companies have bands; they always offer the bottom. Not negotiating is leaving your own money on the table  . often ₹5–20L per year.' },
  { title: 'Revealing your current salary', body: 'In most Indian states, asking for your current CTC is no longer legally required. Deflect: "I\'d rather focus on the market rate for this role  . what\'s the band?" If pressed, give a total comp number, not base.' },
];

// ─── Data Science Salary Data ───
const DS_IN_SALARIES = [
  { level: 'Fresher / Intern', tc: '₹6–12 LPA', base: '₹6–10 LPA', bonus: '5–10%', equity: 'None / ESOP' },
  { level: 'Junior Data Scientist (0–2 yrs)', tc: '₹8–18 LPA', base: '₹7–15 LPA', bonus: '8–12%', equity: 'Stock options if startup' },
  { level: 'Data Scientist (2–5 yrs)', tc: '₹15–30 LPA', base: '₹12–24 LPA', bonus: '10–15%', equity: '₹5–15 L vesting 4yr' },
  { level: 'Senior Data Scientist (5–8 yrs)', tc: '₹25–50 LPA', base: '₹20–40 LPA', bonus: '12–20%', equity: '₹15–40 L vesting 4yr' },
  { level: 'Lead / Principal DS (8–12 yrs)', tc: '₹40–70 LPA', base: '₹30–55 LPA', bonus: '15–25%', equity: '₹30–70 L vesting 4yr' },
  { level: 'Head of Data Science (12+ yrs)', tc: '₹60 L–1.2 Cr', base: '₹45 L–90 L', bonus: '20–35%', equity: 'Negotiable' },
];

const DS_US_SALARIES = [
  { level: 'Junior Data Scientist (0–2 yrs)', tc: '$100–140K', base: '$85–120K', bonus: '10–15%', equity: '$20–40K RSU/yr' },
  { level: 'Data Scientist (2–5 yrs)', tc: '$140–200K', base: '$110–160K', bonus: '12–18%', equity: '$40–80K RSU/yr' },
  { level: 'Senior Data Scientist (5–8 yrs)', tc: '$200–280K', base: '$150–210K', bonus: '15–20%', equity: '$80–140K RSU/yr' },
  { level: 'Lead / Principal DS (8–12 yrs)', tc: '$280–380K', base: '$200–280K', bonus: '18–25%', equity: '$140–240K RSU/yr' },
  { level: 'Head of Data Science (12+ yrs)', tc: '$350–550K', base: '$240–350K', bonus: '25–40%', equity: '$200–400K RSU/yr' },
];

const DS_COMPANY_COMP = [
  { company: 'Google', levels: 'L4–L7', tc_in: '₹25–80 LPA (DS), ₹40–1.2 Cr (Senior)', tc_us: '$180–450K (DS), $300–700K (Senior)', notes: 'Heavy RSU, strong L6+ jump' },
  { company: 'Amazon', levels: 'SDE2–SDE4', tc_in: '₹20–60 LPA (DS), ₹35–90 LPA (Senior)', tc_us: '$160–380K (DS), $280–550K (Senior)', notes: 'Low base, back-loaded RSU' },
  { company: 'Meta', levels: 'IC3–IC6', tc_in: '₹25–75 LPA (DS), ₹40–1.1 Cr (Senior)', tc_us: '$200–450K (DS), $350–750K (Senior)', notes: 'Best equity refresh' },
  { company: 'Microsoft', levels: 'L60–L67', tc_in: '₹20–55 LPA (DS), ₹30–80 LPA (Senior)', tc_us: '$150–350K (DS), $250–500K (Senior)', notes: 'Strong WLB, good base' },
  { company: 'Flipkart', levels: 'DS–Senior DS', tc_in: '₹18–45 LPA (DS), ₹30–70 LPA (Senior)', tc_us: 'N/A', notes: 'ESOP potential' },
  { company: 'Razorpay', levels: 'DS–Senior DS', tc_in: '₹15–40 LPA (DS), ₹25–55 LPA (Senior)', tc_us: 'N/A', notes: 'Strong ESOP upside' },
  { company: 'McKinsey (Analytics)', levels: 'Associate–Senior', tc_in: '₹20–45 LPA, ₹35–70 LPA (Senior)', tc_us: '$130–240K, $250–400K (Senior)', notes: 'Structured growth' },
  { company: 'BCG (Gamma)', levels: 'Associate–Senior', tc_in: '₹18–40 LPA, ₹30–65 LPA (Senior)', tc_us: '$120–220K, $240–380K (Senior)', notes: 'Client-focused' },
  { company: 'Goldman Sachs', levels: 'Analyst–VP', tc_in: '₹20–50 LPA (Analyst), ₹40–90 LPA (VP)', tc_us: '$150–350K, $400–700K (VP)', notes: 'Finance premium' },
  { company: 'JP Morgan', levels: 'Analyst–VP', tc_in: '₹18–45 LPA (Analyst), ₹35–80 LPA (VP)', tc_us: '$140–320K, $380–650K (VP)', notes: 'Risk & trading premium' },
];

const DS_CITY_PREMIUM = [
  { city: 'Bangalore', baseline: '100%', note: 'Highest DS salaries, largest talent pool' },
  { city: 'Mumbai', baseline: '95–105%', note: 'Second highest, finance roles get premium' },
  { city: 'Gurgaon/NCR', baseline: '90–100%', note: 'Competitive for consulting & fintech' },
  { city: 'Hyderabad', baseline: '85–95%', note: 'Growing, 5–10% below Bangalore' },
  { city: 'Pune', baseline: '80–90%', note: '10–15% below Bangalore' },
  { city: 'Chennai', baseline: '80–90%', note: '10–15% below Bangalore' },
];

const DS_GLOBAL = [
  { region: 'USA', range: '$100K–180K (DS), $150K–300K (Senior/Lead)', notes: 'Highest in world; Bay Area, NYC 10–30% premium' },
  { region: 'UK', range: '£50K–90K (DS), £80K–150K (Senior/Lead)', notes: 'London 10% premium over regions' },
  { region: 'Singapore', range: 'SGD 80K–150K (DS), SGD 120K–250K (Senior/Lead)', notes: 'Hub for SE Asia, strong market' },
  { region: 'Dubai', range: 'AED 200K–450K (DS), AED 350K–700K (Senior/Lead)', notes: 'Tax-free; premium for tech' },
  { region: 'Germany', range: '€55K–95K (DS), €85K–150K (Senior/Lead)', notes: 'Strong startup scene in Berlin' },
];

const DS_PREMIUM_SKILLS = [
  { skill: 'LLM / GenAI Experience', premium: '+20–30%', note: 'Highest demand right now' },
  { skill: 'ML Engineering (MLOps, Deployment)', premium: '+15–25%', note: 'Production-ready skills' },
  { skill: 'Deep Learning / Computer Vision', premium: '+15–20%', note: 'Specialized, lower supply' },
  { skill: 'Causal Inference / Experimentation', premium: '+10–20%', note: 'Critical for PM, fintech, ads' },
  { skill: 'Domain Expertise (Fintech, Healthcare, Ads)', premium: '+10–15%', note: 'Industry-specific knowledge' },
];

const DS_NEG_TIPS = [
  { step: 1, title: 'Total comp always  . not just base', body: 'Data Scientists often get offered lower base but higher equity. Always negotiate on base + bonus + RSU value (annualized). A ₹20L base + ₹20L bonus is better than ₹30L base + 5% bonus.' },
  { step: 2, title: 'Signing bonus is non-recurring  . use it', body: 'When switching companies, companies will offer signing bonuses (₹5–30L) to offset your current unvested RSUs. Always ask for this. It\'s zero cost to them.' },
  { step: 3, title: 'Remote flexibility is real currency', body: 'Most FAANG & startups now offer remote work. This is worth ₹5–10L in salary in India. Negotiate this if they\'re offering lower base. "Can I work from Bangalore 3 days a week?"' },
  { step: 4, title: 'Stock refreshers > initial grant', body: 'At FAANG, after year 1, annual refreshers matter more than your initial grant (which vests over 4 years). Ask: "What\'s the refresh schedule? How do refreshes compare to initial grant?"' },
  { step: 5, title: 'Counter with offers, not expectations', body: 'A competing offer is your strongest card. You don\'t need to reveal the company. Just say: "I have another offer at ₹X LPA all-in. I\'d prefer your company. Can we move closer?"' },
];

// ─── Collapsible section ───
function Section({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
      marginBottom: 16, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '24px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: open ? C.bgSoft : C.bg, border: 'none', cursor: 'pointer',
          textAlign: 'left', transition: 'background 0.2s',
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "'Instrument Serif', serif", marginBottom: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5 }}>{subtitle}</div>}
        </div>
        <span style={{ fontSize: 18, color: C.green, transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: 16 }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 32px 32px', borderTop: `1px solid ${C.border}`, animation: 'fadeUp 0.25s ease' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── CTA Banner ───
function CTABanner({ text, onClick }) {
  return (
    <div style={{
      background: C.bgMuted,
      borderRadius: '12px',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      marginBottom: '32px',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .cta-banner { flex-direction: column !important; align-items: flex-start !important; }
          .cta-banner-text { margin-bottom: 0 !important; }
          .cta-banner-btn { width: 100% !important; }
        }
      `}</style>
      <p style={{
        fontSize: '15px',
        fontWeight: 500,
        color: C.text,
        margin: 0,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        flex: 1,
      }}>
        {text}
      </p>
      <button
        onClick={onClick}
        className="cta-banner-btn"
        style={{
          background: C.text,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          padding: '10px 20px',
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#2A2A24'}
        onMouseLeave={e => e.currentTarget.style.background = C.text}
      >
        Answer your first question
      </button>
    </div>
  );
}

export default function SalaryGuide({ user, onPracticeCTA }) {
  const [selectedRole, setSelectedRole] = useState('PM');

  useEffect(() => {
    const roleText = selectedRole === 'PM' ? 'Product Manager' : 'Data Science';
    document.title = `${roleText} Salary Guide 2026 | InterviewAlpha.ai`;
    return () => { document.title = 'Interview Preparation Questions & Answers | AI Mock Interview Practice | InterviewAlpha.ai™'; };
  }, [selectedRole]);

  return (
    <div style={{ minHeight: '100vh', background: C.bgSoft, paddingTop: 70, fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden', boxSizing: 'border-box' }}>
      <style>{globalStyles}</style>

      <div className="sg-page-pad" style={{ maxWidth: 860, margin: '0 auto', padding: '40px 28px', boxSizing: 'border-box' }}>

        {/* Role Selector */}
        <div style={{ marginBottom: 32, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>I'm looking at salaries for:</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['PM', 'Data Science'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `2px solid ${selectedRole === role ? C.green : C.border}`,
                  background: selectedRole === role ? C.greenLight : 'transparent',
                  color: selectedRole === role ? C.green : C.textMuted,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (selectedRole !== role) {
                    e.currentTarget.style.borderColor = C.textMuted;
                    e.currentTarget.style.color = C.text;
                  }
                }}
                onMouseLeave={e => {
                  if (selectedRole !== role) {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.textMuted;
                  }
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, letterSpacing: 6, color: C.textMuted, marginBottom: 10 }}>CAREER RESOURCES</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 12, lineHeight: 1.15 }}>
            {selectedRole === 'PM' ? 'PM Salary & Negotiation Guide' : 'Data Science Salary & Negotiation Guide'}
          </h1>
          <p style={{ fontSize: 14, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.75, maxWidth: 620 }}>
            {selectedRole === 'PM'
              ? 'Salary ranges, negotiation frameworks, and word-for-word scripts to help you maximize your compensation as a Product Manager  . at every level.'
              : 'Salary ranges, negotiation frameworks, and word-for-word scripts to help you maximize your compensation as a Data Scientist  . at every level.'}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {(selectedRole === 'PM'
              ? ['India & US Ranges', '5-Step Framework', '7 Counter-Offer Scripts', '5 Common Mistakes', '10 Companies']
              : ['India & US Ranges', '5 Negotiation Tips', 'Global Salaries', '6 Cities Breakdown', 'Premium Skills']
            ).map(t => (
              <span key={t} style={{
                padding: '4px 12px',
                background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                borderRadius: 20, fontSize: 10, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: 0.5,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── TOP CTA BANNER ── */}
        <CTABanner
          text={selectedRole === 'PM' ? "Know your worth? Now practice your answers." : "Know your worth? Now practice your answers."}
          onClick={onPracticeCTA}
        />

        {selectedRole === 'PM' ? (
          <>
        {/* ── PM CONTENT ── */}

        {/* ── SECTION 1: Know Your Worth ── */}
        <Section title="Know Your Worth" subtitle="Salary ranges by level  . India & United States" defaultOpen={true}>
          <div style={{ paddingTop: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>India (₹ LPA / Cr)</div>
            <div style={{ overflowX: 'auto', marginBottom: 32 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Level', 'Total Comp', 'Base', 'Bonus', 'Equity'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {IN_SALARIES.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                      <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>{row.level}</td>
                      <td style={{ padding: '12px 14px', color: C.green, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.tc}</td>
                      <td style={{ padding: '12px 14px', color: C.textSoft }}>{row.base}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted }}>{row.bonus}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 11 }}>{row.equity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>United States (USD)</div>
            <div style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Level', 'Total Comp', 'Base', 'Bonus', 'Equity'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {US_SALARIES.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                      <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>{row.level}</td>
                      <td style={{ padding: '12px 14px', color: C.green, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.tc}</td>
                      <td style={{ padding: '12px 14px', color: C.textSoft }}>{row.base}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted }}>{row.bonus}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 11 }}>{row.equity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '14px 18px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>
                Ranges reflect 2025–2026 market data. Total comp (TC) includes base + annual bonus + annualized equity. Startup equity values assume a 2–4x exit multiple on current 409A/valuation. Verify with levels.fyi, Glassdoor, and LinkedIn Salary.
              </p>
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: Negotiation Framework ── */}
        <Section title="The Negotiation Framework" subtitle="5 steps to maximize your offer  . with word-for-word scripts">
          <div style={{ display: 'grid', gap: 20, paddingTop: 24 }}>
            {NEG_STEPS.map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Instrument Serif', serif", marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.75, margin: '0 0 12px' }}>{s.body}</p>
                  <div style={{ padding: '12px 16px', background: C.bgSoft, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`, borderRadius: '0 12px 12px 0' }}>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>Script</div>
                    <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>{s.script}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 3: Counter-Offer Templates ── */}
        <Section title="Counter-Offer Templates" subtitle="7 word-for-word templates for common scenarios">
          <div style={{ display: 'grid', gap: 20, paddingTop: 24 }}>
            {COUNTER_TEMPLATES.map((t, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{
                    padding: '3px 10px', background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                    borderRadius: 20, fontSize: 10, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Instrument Serif', serif" }}>{t.scenario}</span>
                </div>
                <div style={{
                  padding: '16px 20px', background: C.bgSoft,
                  border: `1px solid ${C.border}`, borderRadius: 16,
                  fontSize: 13, lineHeight: 1.8, color: C.textSoft,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic',
                  whiteSpace: 'pre-wrap',
                }}>
                  {t.template}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 4: Common Mistakes ── */}
        <Section title="5 Negotiation Mistakes PMs Make" subtitle="Avoid these  . they cost 5–20% of your offer">
          <div style={{ display: 'grid', gap: 16, paddingTop: 24 }}>
            {MISTAKES.map((m, i) => (
              <div key={i} style={{
                padding: '18px 20px', background: C.redLight,
                border: `1px solid ${C.redBorder}`, borderRadius: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: C.red, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✕</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.red, fontFamily: "'Instrument Serif', serif", marginBottom: 6 }}>{m.title}</div>
                    <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>{m.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 5: PM Compensation by Company ── */}
        <Section title="PM Compensation by Company" subtitle="Top tech & startup comp ranges  . India and US">
          <div style={{ overflowX: 'auto', paddingTop: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Company', 'PM Levels', 'India TC', 'US TC', 'Notes'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPANY_COMP.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>{row.company}</td>
                    <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap' }}>{row.levels}</td>
                    <td style={{ padding: '12px 14px', color: C.green, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif', whiteSpace: 'nowrap'" }}>{row.tc_in}</td>
                    <td style={{ padding: '12px 14px', color: C.green, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>{row.tc_us}</td>
                    <td style={{ padding: '12px 14px', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, padding: '14px 18px', background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>
                All figures are estimates based on publicly available data, levels.fyi, and community reports as of 2025–2026. Actual comp varies significantly by team, negotiation, and market conditions.
              </p>
            </div>
          </div>
        </Section>

        {/* ── BOTTOM CTA BANNER ── */}
        <CTABanner
          text="Ready to negotiate? Practice your interview answers first."
          onClick={onPracticeCTA}
        />
          </>
        ) : (
          <>
        {/* ── DATA SCIENCE CONTENT ── */}

        {/* ── SECTION 1: Know Your Worth ── */}
        <Section title="Know Your Worth" subtitle="Salary ranges by level  . India & United States" defaultOpen={true}>
          <div style={{ paddingTop: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>India (₹ LPA / Cr)</div>
            <div style={{ overflowX: 'auto', marginBottom: 32 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Level', 'Total Comp', 'Base', 'Bonus', 'Equity'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DS_IN_SALARIES.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                      <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>{row.level}</td>
                      <td style={{ padding: '12px 14px', color: C.green, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.tc}</td>
                      <td style={{ padding: '12px 14px', color: C.textSoft }}>{row.base}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted }}>{row.bonus}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 11 }}>{row.equity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 16 }}>United States (USD)</div>
            <div style={{ overflowX: 'auto', marginBottom: 20 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Level', 'Total Comp', 'Base', 'Bonus', 'Equity'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DS_US_SALARIES.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                      <td style={{ padding: '12px 14px', color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>{row.level}</td>
                      <td style={{ padding: '12px 14px', color: C.green, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.tc}</td>
                      <td style={{ padding: '12px 14px', color: C.textSoft }}>{row.base}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted }}>{row.bonus}</td>
                      <td style={{ padding: '12px 14px', color: C.textMuted, fontSize: 11 }}>{row.equity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '14px 18px', background: C.yellowLight, border: `1px solid ${C.yellowBorder}`, borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: C.yellow, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>
                Ranges reflect 2025–2026 market data. Total comp (TC) includes base + annual bonus + annualized equity. Startup equity values assume a 2–4x exit multiple on current 409A/valuation. Verify with levels.fyi, Glassdoor, and LinkedIn Salary.
              </p>
            </div>
          </div>
        </Section>

        {/* ── SECTION 2: Data Science Negotiation Tips ── */}
        <Section title="5 DS-Specific Negotiation Tips" subtitle="Maximize your total compensation package">
          <div style={{ display: 'grid', gap: 20, paddingTop: 24 }}>
            {DS_NEG_TIPS.map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: C.greenLight, border: `1px solid ${C.greenBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: C.green, fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Instrument Serif', serif", marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontSize: 13, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.75, margin: 0 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 3: DS Compensation by Company ── */}
        <Section title="DS Compensation by Company" subtitle="Top tech, startup, and consulting comp ranges">
          <div style={{ overflowX: 'auto', paddingTop: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {['Company', 'Levels', 'India TC', 'US TC', 'Notes'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 11, fontWeight: 600, color: C.textMuted, borderBottom: `1px solid ${C.border}`, background: '#F5F3EF' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DS_COMPANY_COMP.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13 }}>{row.company}</td>
                    <td style={{ padding: '12px 14px', color: C.textMuted, whiteSpace: 'nowrap' }}>{row.levels}</td>
                    <td style={{ padding: '12px 14px', color: C.green, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>{row.tc_in}</td>
                    <td style={{ padding: '12px 14px', color: C.green, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>{row.tc_us}</td>
                    <td style={{ padding: '12px 14px', color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, padding: '14px 18px', background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <p style={{ fontSize: 11, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.65, margin: 0 }}>
                All figures are estimates based on publicly available data, levels.fyi, and community reports as of 2025–2026. Actual comp varies by team, location, and negotiation.
              </p>
            </div>
          </div>
        </Section>

        {/* ── SECTION 4: Global Salaries ── */}
        <Section title="Global Data Science Salaries" subtitle="USA, UK, Singapore, Dubai, Germany">
          <div style={{ display: 'grid', gap: 16, paddingTop: 24 }}>
            {DS_GLOBAL.map((g, i) => (
              <div key={i} style={{
                padding: '18px 20px', background: C.bgMuted,
                border: `1px solid ${C.border}`, borderRadius: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: '0 0 120px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: "'Instrument Serif', serif" }}>{g.region}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 250 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>{g.range}</div>
                    <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>{g.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 5: City Premiums ── */}
        <Section title="Salary Premiums by Indian City" subtitle="How location affects Data Science compensation">
          <div style={{ display: 'grid', gap: 16, paddingTop: 24 }}>
            {DS_CITY_PREMIUM.map((c, i) => (
              <div key={i} style={{
                padding: '16px 20px', background: c.baseline === '100%' ? C.greenLight : C.bgMuted,
                border: `1px solid ${c.baseline === '100%' ? C.greenBorder : C.border}`, borderRadius: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "'Instrument Serif', serif", marginBottom: 2 }}>{c.city}</div>
                    <p style={{ fontSize: 12, color: C.textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{c.note}</p>
                  </div>
                  <div style={{
                    padding: '6px 14px', background: C.bg, border: `1px solid ${C.border}`,
                    borderRadius: 8, fontSize: 13, fontWeight: 700, color: C.green,
                    fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap',
                  }}>
                    {c.baseline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 6: Premium Skills ── */}
        <Section title="Skills That Command Premium" subtitle="Add these to your profile to negotiate higher">
          <div style={{ display: 'grid', gap: 16, paddingTop: 24 }}>
            {DS_PREMIUM_SKILLS.map((s, i) => (
              <div key={i} style={{
                padding: '18px 20px', background: C.successLight,
                border: `1px solid ${C.successBorder}`, borderRadius: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: C.success, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>+</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.success, fontFamily: "'Instrument Serif', serif" }}>{s.skill}</div>
                      <span style={{
                        padding: '2px 10px', background: C.success, color: '#fff',
                        borderRadius: 12, fontSize: 10, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>{s.premium}</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.textSoft, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.5, margin: 0 }}>{s.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── BOTTOM CTA BANNER ── */}
        <CTABanner
          text="Ready to negotiate? Practice your interview answers first."
          onClick={onPracticeCTA}
        />
          </>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
