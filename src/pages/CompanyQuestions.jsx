import { useState } from 'react';

const C = {
  bg: '#FAFAF8',
  card: '#FFFFFF',
  bgMuted: '#F5F3EF',
  text: '#0A0A0A',
  textMuted: '#5C5C57',
  textLight: '#9C9C97',
  border: '#E8E6E1',
  green: '#16A34A',
  greenLight: 'rgba(22,163,74,0.08)',
};
const NAV_H = 60;

const DIFF = {
  Easy:   { bg: 'rgba(22,163,74,0.08)',   color: '#16A34A', border: 'rgba(22,163,74,0.2)' },
  Medium: { bg: 'rgba(234,179,8,0.10)',   color: '#92400E', border: 'rgba(234,179,8,0.3)' },
  Hard:   { bg: 'rgba(207,34,46,0.08)',   color: '#CF222E', border: 'rgba(207,34,46,0.18)' },
};

// ── Company data ──────────────────────────────────────────────────────────────
const COMPANIES = [
  { id: 'google',    name: 'Google',        initial: 'G', color: '#4285F4', tagline: 'Search · YouTube · Cloud · Android' },
  { id: 'amazon',   name: 'Amazon',         initial: 'A', color: '#FF9900', tagline: 'E-commerce · AWS · Alexa · Logistics' },
  { id: 'meta',     name: 'Meta',           initial: 'M', color: '#1877F2', tagline: 'Facebook · Instagram · WhatsApp · Threads' },
  { id: 'apple',    name: 'Apple',          initial: '',  color: '#555555', tagline: 'Hardware · iOS · Services · Developer Tools' },
  { id: 'microsoft',name: 'Microsoft',      initial: 'M', color: '#00A4EF', tagline: 'Azure · Office · Teams · GitHub · Xbox' },
  { id: 'flipkart', name: 'Flipkart',       initial: 'F', color: '#F74F00', tagline: 'E-commerce · Grocery · Fashion · Fintech' },
  { id: 'swiggy',   name: 'Swiggy',         initial: 'S', color: '#FC8019', tagline: 'Food delivery · Instamart · Dineout' },
  { id: 'razorpay', name: 'Razorpay',       initial: 'R', color: '#2B6DEF', tagline: 'Payments · Banking · Lending · Payroll' },
  { id: 'cred',     name: 'CRED',           initial: 'C', color: '#1A1A2E', tagline: 'Credit cards · Rewards · Lending · Travel' },
  { id: 'zepto',    name: 'Zepto',          initial: 'Z', color: '#8B5CF6', tagline: 'Quick commerce · Dark stores · Grocery' },
];

// ── Questions data ────────────────────────────────────────────────────────────
const QUESTIONS = {
  google: [
    {
      round: 'Product Vision',
      questions: [
        {
          q: 'How would you improve Google Search for emerging markets?',
          difficulty: 'Hard',
          answer: `Start by clarifying the goal: retention, new user activation, or revenue in emerging markets?\n\nEmerging markets have distinct constraints: low-bandwidth connections, low-literacy users, feature phones, and non-English queries. I'd segment users — students, small business owners, first-time internet users — and pick one to go deep.\n\nFor first-time internet users in India, the biggest problem is query formulation: they don't know how to search. I'd propose a voice-first, vernacular Search experience with dialect-aware STT, results summarized in 1–2 sentences (not 10 blue links), and follow-up prompts like "Did you mean X?"\n\nSuccess metric: task completion rate — did the user find their answer without a second search? Guardrails: latency (must work on 2G), not just DAU.\n\nGoogle's unfair advantage here is its existing Maps and Assistant infrastructure in vernacular languages. Build on that, don't start from zero.`,
        },
        {
          q: 'Design a new feature for YouTube to increase creator retention.',
          difficulty: 'Hard',
          answer: `Creator retention is the flywheel — more creators means more content, which means more viewers, which means more ad revenue. So this is a strategic bet, not a nice-to-have.\n\nI'd segment creators: new (0–1K subs), growing (1K–100K), and established (100K+). Retention problems differ by segment. New creators churn because they don't see progress. I'd focus there.\n\nProposed feature: "Creator Growth Coach" — a lightweight AI assistant embedded in YouTube Studio that gives a specific, actionable recommendation after each video: "Your thumbnails with faces get 2.3x more clicks. Try it on your next video." Not vanity stats — concrete next actions.\n\nWhy this over a competitor? YouTube has 15 years of performance data across 800M videos. No other platform can train this model.\n\nMetric: 90-day creator retention (% of new creators who post 3+ videos in first 90 days). Current benchmark likely ~20%; target 35%.`,
        },
        {
          q: 'What product would you build next for Google Cloud?',
          difficulty: 'Hard',
          answer: `Google Cloud's problem isn't features — it's developer trust and enterprise adoption. AWS has 33% market share vs GCP's 11%. The gap is brand familiarity and switching cost.\n\nI'd build "Cloud Migration Concierge" — an AI-powered migration assistant that analyzes an AWS or Azure workload and generates a cost-optimized, step-by-step GCP migration plan with zero manual configuration. It auto-maps services (EC2 → Compute Engine, S3 → GCS) and flags compatibility issues before migration begins.\n\nWhy Google can win here: DeepMind-level AI + Anthos multi-cloud infrastructure. No competitor has both.\n\nTarget segment: mid-market companies ($1M–$10M cloud spend) that are locked into AWS but not enterprise-scale enough to negotiate. They feel the pain of AWS pricing but lack the engineering bandwidth to self-migrate.\n\nMetric: Migration conversion rate (% of trials that complete a workload migration within 30 days).`,
        },
        {
          q: 'How would you improve Google Maps for delivery drivers?',
          difficulty: 'Medium',
          answer: `Delivery drivers are a power user segment Maps barely optimizes for. Their needs differ from casual navigation: multi-stop optimization, building entry/parking, hands-free operation, and real-time resequencing as pickups/drops change.\n\nCore problem: drivers lose 10–15 min/day hunting for building entrances on dense urban routes. That's $3–5/day in lost earnings.\n\nFeature: "Delivery Mode" — activated when the driver signals they're working. It enables: (1) last-10-meter navigation showing exact gate/entrance pins from driver-crowdsourced data, (2) auto-resequencing when a stop cancels, (3) one-tap "arrived, starting delivery" that pauses nav and resumes automatically, (4) voice-only mode that never requires screen taps while driving.\n\nData flywheel: every driver's entrance pin submission improves the dataset for all drivers. Google Maps already has Street View — overlay it with entrance markers.\n\nMetric: delivery completion time per stop, driver NPS in the Delivery Mode cohort.`,
        },
      ],
    },
    {
      round: 'Analytical / Estimation',
      questions: [
        {
          q: 'Estimate the number of Gmail users in India.',
          difficulty: 'Medium',
          answer: `Structure first, then numbers.\n\nIndia's population: ~1.4B. Internet users: ~700M (50% penetration). Smartphone users: ~600M.\n\nEmail usage: Not all internet users use email actively. Estimate 70% of smartphone users have at least one email account → 420M accounts. Gmail's market share in India is dominant — roughly 70–75% of email users (Android's default, Google account required for Play Store). That gives us ~300M Gmail accounts.\n\nAdjust for multi-account users: many users have 2 accounts (personal + work). Unique users ≈ 250M.\n\nSanity check: Google has ~1.8B Gmail users globally. India has ~18% of global internet users. 18% × 1.8B = 324M. Close to our bottom-up estimate. ✓\n\nFinal answer: ~250–300M Gmail users in India.\n\nAt Google, the follow-up is usually: "Now how would you monetize them differently from US users?" Prepare for that.`,
        },
        {
          q: 'How would you measure the success of Google Translate?',
          difficulty: 'Medium',
          answer: `Don't just list metrics — pick a North Star and explain why.\n\nGoogle Translate's mission: break down language barriers for everyone. The North Star should reflect whether users are actually communicating successfully, not just whether they opened the app.\n\nNorth Star: "Translation Task Completion Rate" — the % of sessions where the user doesn't immediately re-translate, correct, or abandon. A user who translates once and acts on it was served well.\n\nSupporting metrics:\n• DAU/MAU by language pair (which pairs are growing?)\n• Conversation Mode session length (proxy for real-time usage success)\n• Accuracy score from human raters per language pair (quality gate)\n• Retry rate (user re-translates the same text — signal of failure)\n\nGuardrail metrics:\n• Latency (offline mode especially)\n• Bias audit scores (does it handle gender-neutral languages correctly?)\n\nI'd also distinguish between casual users (quick word lookup) and power users (document translation) — they have different success definitions.`,
        },
        {
          q: "YouTube's revenue dropped 10% this month. Diagnose why.",
          difficulty: 'Hard',
          answer: `This is a metric deep-dive. Structure your investigation before jumping to conclusions.\n\nStep 1 — Is the data valid? Check if the reporting pipeline changed, if there's a date filter bug, or if this is a seasonality effect (e.g., post-holiday ad spend drop).\n\nStep 2 — Segment the drop:\n• Geography: Is it global or specific regions? (US ad market drives ~40% of YouTube revenue)\n• Revenue type: Ad revenue vs. Premium subscriptions vs. YouTube TV vs. Shorts monetization?\n• Advertiser type: Brand vs. performance? If brand spend dropped, check macro (recession signal). If performance dropped, check CPM/fill rate.\n\nStep 3 — Likely root causes:\n• Advertiser pullback (brand safety incident, macro downturn)\n• Algorithm change reduced high-CPM video distribution\n• iOS privacy changes reduced targeting effectiveness → lower CPMs\n• Competitor (TikTok) pulling ad budget\n\nStep 4 — Recommend action based on segment where drop is concentrated. Don't guess — segment first, then diagnose.`,
        },
      ],
    },
    {
      round: 'Execute with Judgment',
      questions: [
        {
          q: 'You have two features competing for the same engineering team. How do you decide?',
          difficulty: 'Medium',
          answer: `This is a prioritization question. The answer isn't a framework — it's judgment informed by a framework.\n\nFirst, I'd make the tradeoff explicit by scoring both features on: (1) user impact (how many users, how much value), (2) business impact (revenue, retention, strategic moat), (3) confidence (how validated is the hypothesis?), and (4) effort (engineering complexity, risk).\n\nThen I'd ask: Is this a reversible or irreversible decision? If reversible — ship the higher-confidence one first, learn, then revisit. If irreversible (e.g., an architectural decision) — slow down and get more data.\n\nThe harder question: whose OKR does each feature serve? If they're competing for credit, the conflict is political, not technical. Resolve that first.\n\nFinally, I'd explore whether the features can be sequenced rather than traded off — can we scope one down to ship a version in half the time, freeing the team for the other?\n\nAlways end by aligning with the team lead on timeline and communicating the decision and rationale clearly to stakeholders.`,
        },
        {
          q: 'Your A/B test shows positive revenue but negative NPS. What do you do?',
          difficulty: 'Hard',
          answer: `This is a tension between short-term revenue and long-term user trust. At Google, both matter — but trust is existential.\n\nFirst, I'd dig into the magnitude and causality: Is the NPS drop statistically significant? How large is the revenue gain? Is the revenue gain from repeat users or one-time behavior that won't compound?\n\nIf the NPS drop is from a specific user segment (e.g., power users hate the change but casual users are fine), the decision changes. If it's broad, that's a red flag.\n\nMy default: don't ship. A revenue bump that erodes trust is a loan you'll have to repay with interest. Google's brand is built on "we don't screw users for money" — violating that is catastrophically expensive long-term.\n\nWhat I'd do instead: identify what specifically is driving NPS down. Can I redesign the feature to capture the revenue without the user harm? Run a second test on that version.\n\nIf I had to ship (executive pressure), I'd cap the rollout at 20%, set an NPS floor as a kill switch, and commit to a redesign sprint within 4 weeks.`,
        },
      ],
    },
    {
      round: 'Googleyness / Behavioral',
      questions: [
        {
          q: 'Tell me about a time you disagreed with your team and what happened.',
          difficulty: 'Medium',
          answer: `Use STAR: Situation, Task, Action, Result — but make the conflict real and the resolution honest.\n\nWhat interviewers look for: (1) Did you engage with the disagreement or avoid it? (2) Did you use data or just opinion? (3) Were you willing to be wrong?\n\nStrong answer structure: "We disagreed on [specific decision]. My view was [X] because [data/reasoning]. The team believed [Y] because [their reasoning]. I [raised it in the design review / wrote a 1-pager / ran a small experiment] to test the assumption. The result was [Z]. In retrospect, [what you learned]."\n\nWhat to avoid: framing yourself as always right. The best answers acknowledge where you were partially wrong or where the other view had merit you hadn't considered.\n\nGoogleyness isn't about being agreeable — it's about engaging constructively, being data-driven, and caring more about the right outcome than being right.`,
        },
        {
          q: "What do you do when what's best for the user conflicts with business goals?",
          difficulty: 'Hard',
          answer: `This is a values question. Google's stated answer is "focus on the user and all else will follow" — but that's an aspiration, not a policy. Real conflicts happen.\n\nMy framework: separate short-term revenue from long-term business health. What's "bad for users" is almost always bad for the business long-term — it just takes time to show up in churn and trust metrics.\n\nIf the conflict is real (e.g., removing a useful feature to drive paid upgrades), I'd:\n1. Quantify both sides — what's the revenue gain vs. the user harm (in churn, NPS, support cost)?\n2. Explore alternatives — can we monetize differently without harming the experience?\n3. Escalate with data, not opinion — "Here's what the numbers say about the 6-month impact."\n4. Be willing to lose the argument if I've made my case and leadership disagrees — then track the outcome and revisit.\n\nWhat I wouldn't do: silently comply and let it happen. That's not Googleyness — that's abdication.`,
        },
      ],
    },
  ],

  amazon: [
    {
      round: 'Customer Obsession',
      questions: [
        {
          q: 'Tell me about a time you went above and beyond for a customer.',
          difficulty: 'Medium',
          answer: `Amazon's Customer Obsession LP is about earning and keeping customer trust, not just satisfaction scores. Strong answers show you proactively identified a customer problem — not just responded when asked.\n\nStructure: STAR with a specific customer (internal or external), what the problem was before you noticed it, what you did without being asked, and the measurable outcome.\n\nKey signals interviewers look for:\n• Did you discover the problem or did someone bring it to you? (Proactive > Reactive)\n• Did you go beyond your role boundary without needing permission?\n• Did you follow through to confirm the customer was actually satisfied?\n\nWhat to avoid: stories where you just did your job. "Above and beyond" means you did something that wasn't expected or required.\n\nAlso avoid: stories where you made a decision that was bad for the business in order to please one customer. Amazon values customer obsession that scales, not one-off heroics that don't compound.`,
        },
        {
          q: 'Design a feature for Amazon that improves the return experience.',
          difficulty: 'Medium',
          answer: `Returns are a massive cost center ($101B in 2023 US alone) and a customer trust moment. Amazon's challenge: make returns painless without incentivizing abuse.\n\nUser pain points: packaging items, printing labels, finding a drop-off location, waiting for refunds. The worst experience is "returnless refunds are rejected" surprise.\n\nI'd focus on the packaging problem for heavy/awkward items. Proposed feature: "Instant Return Kit" — for items over 5 lbs, Amazon dispatches a pre-labeled return box to your door within 2 hours (piggybacking on Amazon Flex drivers doing last-mile deliveries). The refund initiates when the driver scans the item, not when it reaches the warehouse.\n\nThis reduces return friction, increases customer trust, and gives Amazon real-time inventory visibility on returned goods.\n\nMetric: Return-to-refund time (target: under 4 hours vs. current 5–7 days). Guardrail: return abuse rate (ensure this doesn't spike fraudulent returns). Cost model: only viable for Prime members on orders above $50.`,
        },
      ],
    },
    {
      round: 'Ownership',
      questions: [
        {
          q: 'Tell me about a time you took on something outside your role.',
          difficulty: 'Medium',
          answer: `Amazon's Ownership LP means: "Leaders don't say 'that's not my job.'" The best answers show you saw a problem, took responsibility for it even though no one asked you to, and drove it to completion.\n\nStrong answer elements:\n• The problem was clearly outside your lane (ideally another team's domain)\n• You didn't wait for permission or assignment\n• You collaborated cross-functionally rather than stepping on anyone\n• The outcome was measurable and attributed partly to your initiative\n\nWhat interviewers want to avoid: candidates who mistake "ownership" for "doing everything yourself." Amazon values owners who pull in the right people, delegate clearly, and still hold the outcome.\n\nCommon trap: describing something you were eventually asked to do. "Outside your role" means before anyone told you it was your problem.\n\nBest framing: "I noticed X wasn't being handled by anyone. I raised it with [team], got alignment, and drove [specific action]. The result was [measurable outcome]. Since then, [it's become a formal responsibility / we hired for it / it's now owned by X team].`,
        },
      ],
    },
    {
      round: 'Bias for Action',
      questions: [
        {
          q: 'Describe a situation where you had to make a decision with incomplete information.',
          difficulty: 'Hard',
          answer: `Amazon's "Bias for Action" LP explicitly calls out that "many decisions and actions are reversible and do not need extensive study." The key insight: distinguish reversible (two-way door) from irreversible (one-way door) decisions.\n\nFor two-way door decisions, bias toward speed. For one-way door decisions, slow down and gather more data.\n\nStrong answer structure:\n• What decision was needed and what was the deadline pressure?\n• What information was missing and why couldn't you wait?\n• How did you decide? (What proxies or signals did you use?)\n• What happened and what would you do differently?\n\nWhat interviewers watch for: Did you assess reversibility? Did you define a clear trigger for course-correcting if you were wrong? Did you communicate your confidence level honestly to stakeholders?\n\nAvoid: stories where you took a huge irreversible risk on a gut feeling. Amazon values calculated speed, not recklessness. "I made a call, set a 2-week review checkpoint, and had a rollback plan" is stronger than "I just went for it."`,
        },
      ],
    },
    {
      round: 'Dive Deep',
      questions: [
        {
          q: 'A key metric dropped 15%. Walk me through your investigation.',
          difficulty: 'Hard',
          answer: `This is Amazon's "Dive Deep" LP in action — leaders "don't accept that 'it's always been done this way'" and they stay connected to the details.\n\nStep 1 — Validate the data. Is the drop real? Check the reporting pipeline, time range, and whether any A/B tests or feature launches are confounding the metric.\n\nStep 2 — Segment systematically: by time (when did it start?), by geography, by user segment, by surface/platform, by product category. The segment where the drop is concentrated tells you where to look.\n\nStep 3 — Form hypotheses ranked by likelihood. Check the obvious first: did we deploy a bug? Did a competitor do something? Did a major advertiser churn?\n\nStep 4 — Test each hypothesis with data. Don't jump to root cause before you've eliminated alternates.\n\nStep 5 — Write a document (Amazon loves docs). Clear problem statement, data evidence, root cause, proposed fix, and preventive measure.\n\nAmazon interviewers will probe the weakest link in your reasoning — be prepared to defend every assumption with data.`,
        },
      ],
    },
  ],

  meta: [
    {
      round: 'Product Sense',
      questions: [
        {
          q: 'How would you improve Instagram Reels for creators?',
          difficulty: 'Hard',
          answer: `Meta's existential bet is on Reels winning against TikTok. Creator retention is the lever — content supply determines content quality which determines viewer retention.\n\nCreator problems on Reels: (1) Monetization is opaque and unpredictable vs. YouTube's clear AdSense, (2) Discoverability for new creators is poor — the algorithm favors established accounts, (3) Collaboration is harder than TikTok's Duet/Stitch mechanics.\n\nI'd focus on monetization transparency for growing creators (1K–500K followers) because they're most at risk of churning to YouTube.\n\nProposal: "Reels Revenue Dashboard" — shows creators exactly how each Reel performed in monetization: CPM by audience segment, which regions and demographics generated revenue, projected monthly earnings based on current trajectory. Include a "Reels Coach" AI that suggests content adjustments based on what's monetizing well.\n\nMeta's advantage: advertiser data depth. No other platform knows what users buy after watching content.\n\nMetric: % of growing creators who post 3+ Reels/week at 90 days. Current retention of this segment is likely ~25%; target 40%.`,
        },
        {
          q: 'Design a product to help small businesses on WhatsApp.',
          difficulty: 'Hard',
          answer: `WhatsApp has 500M+ business accounts, mostly in India, Brazil, and Indonesia. The problem: small businesses use WhatsApp as a CRM, but it's designed for personal communication. They're managing orders, complaints, and payments through an app that doesn't support any of it natively.\n\nTarget user: a kirana store owner in India managing 50–200 daily customer messages. Their pain: no order history, no payment confirmation, no way to broadcast offers without getting marked as spam.\n\nProposal: "WhatsApp Business OS" — a lightweight order management layer embedded in WhatsApp Business. Features: (1) Customer message threads tagged as "new order / complaint / inquiry," (2) One-tap payment link generation (already exists in some markets via WhatsApp Pay), (3) Broadcast templates that pass spam filters (pre-approved by Meta), (4) Simple inventory management with low-stock alerts.\n\nMeta's moat: WhatsApp's existing trust in these markets. People already use it; we're just giving them better tools.\n\nMonetization: freemium (basic free, advanced features $5–15/month). Revenue metric: WhatsApp Business API revenue per active business account.`,
        },
      ],
    },
    {
      round: 'Execution',
      questions: [
        {
          q: 'Define the North Star metric for Facebook Marketplace.',
          difficulty: 'Medium',
          answer: `First, clarify the business goal: Is Marketplace optimizing for GMV (gross merchandise value), ad revenue, or user engagement that spills over into core Facebook?\n\nFor a two-sided marketplace, a single North Star is tricky because buyer and seller health can diverge. But if forced to pick one: "Successful Transaction Rate" — the % of listings that result in a completed transaction within 30 days.\n\nWhy this over GMV: GMV can be gamed by high-value listings that never sell. Successful Transaction Rate reflects actual supply-demand matching and is the best proxy for marketplace health.\n\nSupporting metrics (the constellation):\n• Listing creation rate (supply health)\n• Buyer search-to-message rate (demand activation)\n• Message-to-transaction conversion (trust/friction)\n• Repeat buyer rate (long-term value)\n\nGuardrail metrics:\n• Fraud rate (don't optimize transaction volume at the cost of safety)\n• Seller NPS (don't burn supply to juice short-term demand)\n\nFacebook's unique angle: social graph trust. Transactions between friends-of-friends should have higher conversion — measure and amplify that.`,
        },
        {
          q: "Messenger's DAU is declining. What do you do?",
          difficulty: 'Hard',
          answer: `Start with data, not solutions.\n\nStep 1 — Segment the decline: Is it global or market-specific? (WhatsApp has cannibalized Messenger in India/Europe.) Is it across all age groups or primarily younger users shifting to Instagram DMs or Snapchat? Is it messaging volume, session starts, or notification open rate?\n\nStep 2 — Identify the core problem. If it's younger users: Messenger lacks the ephemeral, casual feel of Instagram DMs. If it's global: iMessage/WhatsApp have better encryption trust signals.\n\nStep 3 — Hypothesis-driven solutions:\n• If the problem is feature gap vs. Instagram DMs: unify the messaging surface (Meta has been trying this for years)\n• If it's trust: launch end-to-end encryption prominently (already rolled out — lead with marketing)\n• If it's utility: double down on group coordination features (events, polls, video rooms) where Messenger is stronger than 1:1 chat apps\n\nStep 4 — Pick the intervention most likely to move the metric in 90 days, not 2 years. Quick wins: notification re-engagement, onboarding of new features to lapsed users.\n\nMeta interviewers want to see: data segmentation → clear hypothesis → prioritized action → metric expected to move.`,
        },
      ],
    },
    {
      round: 'Leadership & Drive',
      questions: [
        {
          q: 'Tell me about your most impactful product decision.',
          difficulty: 'Medium',
          answer: `Meta wants PMs who move fast and take ownership. This question tests judgment, not just execution.\n\nStrong answer structure:\n• What was the decision (and why was it yours to make)?\n• What was at stake (user impact, revenue, strategic direction)?\n• What options did you consider and why did you choose this one?\n• What happened — and what would you do differently?\n\nWhat makes an answer "impactful" at Meta:\n• Scale: affected millions of users, not just one team\n• Speed: you made the call and moved, didn't wait for consensus\n• Measurable outcome: you can cite the metric that moved\n\nMeta's culture values "move fast with stable infra" — they want PMs who bias toward shipping over perfection, but who are honest about the tradeoffs they made.\n\nAvoid: decisions where you had perfect information and it was obvious. The best answers involve genuine uncertainty, a defensible rationale, and a real outcome — even if it was messy.`,
        },
      ],
    },
  ],

  apple: [
    {
      round: 'Product Taste',
      questions: [
        {
          q: 'What Apple product do you think needs the most improvement and why?',
          difficulty: 'Hard',
          answer: `This is a taste test. Apple interviewers are looking for genuine product intuition, not flattery or safe answers.\n\nStandout answer: Siri. Despite Apple's hardware dominance, Siri remains 3–4 years behind Google Assistant and ChatGPT in task completion and conversational understanding. In 2024, Apple Intelligence launched, but Siri's core query failure rate is still high — users frequently switch to Google Search mid-task.\n\nRoot cause: Siri was built for command execution (set a timer, call mom) not reasoning. LLMs have changed user expectations fundamentally — users now expect a Siri that can book a complex trip, not just set a reminder.\n\nWhat Apple should do: rebuild Siri's core on a reasoning-first architecture while preserving its privacy-first on-device processing advantage. The moat is privacy + hardware integration (processing on A-series chips). The gap is reasoning quality.\n\nDelivery: be specific, be honest, and propose a directional solution. Apple interviewers respect strong opinions held confidently. Vague answers ("I think Maps could be better") will not stand out.`,
        },
        {
          q: 'Design a new feature for AirPods.',
          difficulty: 'Medium',
          answer: `AirPods' strength is invisible integration — they just work within the Apple ecosystem. A new feature should deepen that integration rather than add complexity.\n\nOpportunity: AirPods in meetings. AirPods Pro have microphones, spatial audio, and Transparency Mode — but they don't help users in meeting contexts beyond basic audio.\n\nProposed feature: "Meeting Assist" — when AirPods detect you're in a FaceTime or Zoom call (via OS-level signal), they activate a mode that: (1) auto-suppresses your background noise using beam-forming mics, (2) subtly amplify the loudest speaker if you're in a loud environment, (3) offer a one-tap private whisper channel with another AirPods user in the same room.\n\nWhy Apple: the hardware (H2 chip, spatial audio) already exists. This is a software feature that uses existing capabilities in a new context.\n\nDesign principle: zero new UI. No settings, no setup. It activates contextually and gets out of the way. That's the Apple standard.\n\nMetric: meeting audio quality rating in post-call surveys, AirPods Pro attach rate to meeting use cases.`,
        },
        {
          q: 'How would you improve the iPhone camera for professional photographers?',
          difficulty: 'Medium',
          answer: `Professional photographers are a small but disproportionately influential segment — they create the content that makes iPhone cameras famous.\n\nTheir current frustrations: (1) No full manual control over all parameters simultaneously (exposure, focus, shutter, ISO — current Pro controls are siloed), (2) ProRAW files are large and editing workflows outside Apple's ecosystem are clunky, (3) No tethering support for external monitors during a shoot.\n\nI'd focus on professional workflow integration — specifically, wireless tethering and a unified manual control surface.\n\nProposal: "iPhone Pro Studio Mode" — a locked-down camera mode that disables all AI processing, exposes full sensor parameters in one control panel, streams a live feed to a connected Mac/iPad wirelessly, and outputs lossless ProRAW directly to Lightroom or Capture One over AirDrop.\n\nWhy Apple: unique hardware (48MP sensor, ProRAW pipeline) + tight OS integration that Android cannot match.\n\nGuardrail: don't compromise the consumer camera experience. Studio Mode is a deliberate opt-in — it must never be the default.`,
        },
      ],
    },
    {
      round: 'Execution & Judgment',
      questions: [
        {
          q: 'Apple is considering adding ads to the App Store. How would you evaluate this decision?',
          difficulty: 'Hard',
          answer: `This is a strategic and ethical question, not just a product question. Apple already has limited App Store ads — evaluate whether to expand them.\n\nArguments for: App Store search is a high-intent surface. Developers already pay 15–30% commission. Ads could be an alternative monetization model for smaller developers and a revenue stream for Apple ($5–10B potential).\n\nArguments against: Apple's brand is built on user trust and "we're not Facebook." Ads that compromise search result quality could damage the App Store's most important asset — discoverability. User trust erodes slowly and recovers slowly.\n\nFramework for evaluation:\n• User impact: Do ads improve or worsen task completion for users trying to find the right app?\n• Developer impact: Do ads create an unfair playing field that harms small developers?\n• Brand risk: What's the reputational cost if media covers it as "Apple sold out"?\n• Revenue: Is the TAM large enough to justify the risk?\n\nMy recommendation: expand ads only in non-search surfaces (Today tab, category pages) where user intent is more exploratory and ads feel less intrusive. Never allow ads to displace organic search results.`,
        },
      ],
    },
  ],

  microsoft: [
    {
      round: 'Product Vision',
      questions: [
        {
          q: 'How would you improve Microsoft Teams for hybrid work?',
          difficulty: 'Medium',
          answer: `Hybrid work is Microsoft's biggest bet — Teams is the connective tissue of the modern enterprise. But Teams' NPS among users is notoriously low (users often say it's bloated and slow compared to Slack).\n\nCore problem for hybrid work: the in-room vs. remote experience is unequal. Remote participants miss whiteboard moments, hallway conversations, and non-verbal cues. In-room participants forget to include remote people.\n\nI'd target: meeting equity — ensuring remote and in-room participants have equal ability to contribute.\n\nProposal: "Hybrid Meeting Intelligence" — AI-powered features that: (1) automatically detect who's speaking in the room (not just the device mic) and show individual name labels, (2) raise virtual hands to the in-room display prominently so remote people aren't skipped, (3) generate a live "talking time" sidebar showing if remote participants are being systematically underheard, (4) auto-transcribe and surface action items separately for remote participants who joined late.\n\nWhy Microsoft: Azure AI + Surface Hub + Teams OS-level integration. This is impossible for Slack to replicate without hardware.\n\nMetric: remote participant contribution rate (messages + reactions + speaking time) as % of in-room equivalent.`,
        },
        {
          q: 'Design a feature for GitHub Copilot.',
          difficulty: 'Hard',
          answer: `GitHub Copilot is already a top-line Microsoft/GitHub product with ~1.8M paid users. The next feature should deepen workflow integration, not just add autocomplete.\n\nDeveloper pain point: Copilot helps write code but doesn't help understand a large unfamiliar codebase. Onboarding to a new repo still takes weeks.\n\nProposal: "Copilot Codebase Navigator" — when a developer opens a new repository, Copilot generates a natural-language architectural overview: "This is a Node.js API with a React frontend. The auth flow is in /src/auth, and payments are handled by Stripe webhooks in /src/webhooks/stripe.js." It maps dependencies, explains design patterns, and answers questions like "Where would I add a new API endpoint?"\n\nWhy this works: Copilot already reads the codebase for autocomplete. Codebase understanding is a small step from autocomplete, but a huge value add for developer productivity.\n\nTarget users: developers onboarding to new codebases (every engineer switching teams, every new hire, every open-source contributor).\n\nMetric: time-to-first-meaningful-PR for new contributors to a repo. Baseline: 2–3 weeks. Target: under 1 week.`,
        },
        {
          q: "How would you grow Microsoft's developer ecosystem against AWS?",
          difficulty: 'Hard',
          answer: `Microsoft's developer ecosystem (Azure, GitHub, VS Code) is strong but AWS dominates cloud with 33% market share vs Azure's 23%. The gap is brand familiarity and ecosystem lock-in.\n\nAWS's strength: first-mover advantage, deepest service catalog, and largest developer community. Microsoft's strength: enterprise relationships, GitHub (90M developers), VS Code (77% of developer tool market), and LinkedIn (hiring signal).\n\nStrategy: use GitHub + VS Code as the Trojan horse to pull developers into Azure.\n\nSpecific proposal: "Dev-to-Prod on Microsoft" — a zero-configuration path from GitHub Actions (CI/CD) to Azure deployment, with VS Code showing live production metrics inline with code. Developer writes code in VS Code → pushes to GitHub → auto-deploys to Azure → sees live user impact in the editor sidebar. The entire loop stays in Microsoft tools.\n\nThis reduces the switching cost of adopting Azure for GitHub users dramatically. Competitor can't replicate this without buying VS Code and GitHub.\n\nMetric: GitHub Actions → Azure deployment conversion rate among new projects. Also track Azure trial activation from VS Code extension installs.`,
        },
      ],
    },
  ],

  flipkart: [
    {
      round: 'Product Design',
      questions: [
        {
          q: "How would you improve Flipkart's Big Billion Days experience?",
          difficulty: 'Hard',
          answer: `Big Billion Days (BBD) is Flipkart's biggest revenue event — but it's also the highest friction experience for users and the highest stress event for ops.\n\nUser pain points: (1) Flash sales create FOMO and cart abandonment when items sell out between add-to-cart and checkout, (2) First-time BBD users are overwhelmed by the volume of deals, (3) Price drop verification (is this actually a deal?) is hard.\n\nI'd focus on deal trust and discovery for first-time BBD users — they're the growth lever.\n\nProposal: "BBD Deal Passport" — a personalized BBD homepage that shows only deals in the user's actual purchase history categories (using Flipkart's browsing/order data). Each deal shows a 90-day price history chart (proving the discount is real), a "Deal Quality Score" based on seller ratings, and a "Secure My Deal" button that reserves an item for 10 minutes at sale price while checkout completes.\n\nWhy Flipkart: price history data and seller quality data are already in Flipkart's system — this is a presentation and trust problem, not a data problem.\n\nMetric: BBD checkout conversion rate (currently likely 2–4%, target 6–8%), and first-time buyer repeat purchase rate within 30 days post-BBD.`,
        },
        {
          q: 'Design a feature to increase Flipkart Grocery adoption in Tier 2 cities.',
          difficulty: 'Hard',
          answer: `Flipkart Grocery in Tier 2 cities faces three structural challenges: trust (will the fresh produce be good?), delivery reliability (can they promise 2-hour delivery in Nagpur?), and habit (users already have a local kirana they trust).\n\nTarget user: a 35-year-old homemaker in Indore who buys groceries from a neighborhood shop and has a Flipkart account for electronics and apparel.\n\nThe blocker isn't price — it's trust in freshness and the kirana relationship.\n\nProposal: "Flipkart Grocery Guarantee" — a hyperlocal fresh quality guarantee. If any fresh item is unsatisfactory, replacement arrives in 2 hours (not a refund, a replacement). Backed by a local quality partner network. Include a "First Basket Free" offer (₹300 off first grocery order) to break the inertia.\n\nDistribution: leverage Flipkart's Tier 2 delivery agents as quality validators — they inspect fresh items before dispatch from the dark store.\n\nMetric: Tier 2 Grocery 30-day retention rate (% of first-time buyers who order again within 30 days). Also track NPS for fresh produce specifically.`,
        },
      ],
    },
  ],

  swiggy: [
    {
      round: 'Execution & Metrics',
      questions: [
        {
          q: "Swiggy's delivery time increased by 5 minutes. Diagnose and fix.",
          difficulty: 'Hard',
          answer: `Five minutes is significant — a 20–30% increase on a 20-minute delivery. This needs a structured investigation.\n\nStep 1 — Validate: Is this real across all cities, or concentrated? (Mumbai traffic vs. Bangalore apartment clusters have different failure modes.) Which time of day? (Peak hours vs. off-peak.) Which order types? (Single restaurant vs. multi-restaurant orders.)\n\nStep 2 — Segment the delivery pipeline: Restaurant prep time → Order ready to pickup → Rider pickup time → Rider to customer transit → Last 100m (apartment building access). Which segment grew?\n\nLikely culprits:\n• Restaurant prep time increased (new menu items, kitchen understaffed)\n• Rider shortage in specific zones (demand spike without supply increase)\n• Routing algorithm degraded after a recent deploy\n• Last-mile issues (gated societies, wrong addresses)\n\nStep 3 — Fix based on root cause:\n• Prep time: adjust restaurant estimated time shown to users (set expectations) + ops intervention\n• Rider shortage: surge pricing to attract more riders in deficit zones\n• Routing: rollback + regression test\n\nMetric to track: segment-level delivery time breakdown, not just total time. Fix the right segment.`,
        },
        {
          q: 'Design a loyalty program for Swiggy Instamart.',
          difficulty: 'Medium',
          answer: `Instamart's business model depends on frequency — 10-minute grocery delivery only works at scale if customers order multiple times per week. A loyalty program should drive repeat orders, not just give away discounts.\n\nTarget behavior: increase orders per user per month from (estimate) 3 to 5.\n\nProposal: "Instamart Streak Rewards" — instead of point accumulation, reward consecutive ordering behavior. Order 3 weeks in a row → unlock 15% off your next order. Order every day for a week → unlock a premium delivery window (your order prioritized during peak hours). Order a new product category → earn a "Discovery Badge" with a discount on that category next week.\n\nWhy streaks over points: streaks create loss aversion (breaking a streak feels bad) which is more powerful than accumulating something. This is how Duolingo drives daily engagement.\n\nGuardrail: don't reward discount-seekers who only order when they have a coupon. Streak rewards should require minimum basket size (₹300+) and exclude heavily discounted orders.\n\nMetric: orders/user/month in loyalty program cohort vs. control. Also track basket size — did it increase?`,
        },
      ],
    },
  ],

  razorpay: [
    {
      round: 'Product Design',
      questions: [
        {
          q: "How would you improve Razorpay's developer onboarding?",
          difficulty: 'Medium',
          answer: `Razorpay's target user is a developer integrating payments for the first time. The onboarding experience is the #1 determinant of whether they choose Razorpay over Stripe or PayU.\n\nCurrent developer pain: (1) API key setup requires KYC which delays the "Hello World" moment, (2) Test mode is available but test data is synthetic and doesn't feel real, (3) Documentation is comprehensive but not contextual (no "Here's the fastest path for your specific use case").\n\nFocus: reduce time-to-first-successful-transaction in sandbox mode.\n\nProposal: "Razorpay Quick Start" — a 5-minute onboarding flow that: (1) Detects the developer's stack (React, Django, Laravel) from their signup device, (2) Generates a ready-to-run code snippet for that exact stack, (3) Provides a one-click test checkout that simulates a real payment flow, (4) Shows a "Your first payment would look like this" dashboard preview before KYC.\n\nKYC moves to post-integration, post-validation — developers prove the integration works first, then unlock production credentials.\n\nMetric: time-to-first-successful-API-call in sandbox (target: under 10 minutes). Also track sandbox-to-production conversion rate.`,
        },
        {
          q: 'Design a product for Razorpay to enter the lending market.',
          difficulty: 'Hard',
          answer: `Razorpay processes ₹10L Cr+ in payments annually. It has transaction data, merchant cash flow data, and customer behavior data that no traditional lender has. This is a data-first lending play.\n\nTarget: small business owners (merchants on Razorpay) who need working capital but can't access traditional bank loans due to lack of formal financial history.\n\nProposal: "Razorpay Capital" — instant working capital loans for merchants, underwritten entirely by their Razorpay transaction history. Loan amount = f(average monthly GMV, payment regularity, customer return rate, chargeback rate). No documents, no credit score required.\n\nRepayment: automatic deduction as a % of daily settlements (revenue-based repayment). If the business has a bad month, repayment slows automatically.\n\nWhy Razorpay wins: (1) Zero underwriting cost — data already exists, (2) Zero repayment default risk — deducted before funds reach the merchant, (3) No distribution cost — existing merchant relationship.\n\nCompetitors (NeoGrowth, Lendingkart) use lagging indicators. Razorpay uses real-time transaction data — the most predictive signal of business health available.\n\nMetric: merchant NPS post-loan, default rate, loan repayment rate at 90 days.`,
        },
      ],
    },
  ],

  cred: [
    {
      round: 'Product Strategy',
      questions: [
        {
          q: "How would you increase CRED's DAU beyond bill payments?",
          difficulty: 'Hard',
          answer: `CRED's core insight is brilliant: credit card users are high-income, high-intent, and underserved by existing apps. But bill payment is monthly, not daily — so DAU is structurally low.\n\nStrategy: create daily financial utility for CRED's user base that leverages the high-credit-score signal.\n\nOpportunities: (1) CRED Mint (P2P lending) already exists but lacks discovery, (2) Credit health monitoring (real-time score tracking + improvement tips) is a daily-use case, (3) Spend analytics (where did you spend this month vs. last month?) is already a feature but not prominently surfaced.\n\nI'd double down on "Financial Fitness" — a daily-check-in habit where users see their credit score trend, get a "financial insight of the day" (e.g., "Your dining spend is 40% above your 3-month average"), and can take a one-tap action (e.g., "Reduce your credit utilization by paying ₹5,000 today").\n\nWhy this vs. adding more rewards: CRED's user base is sophisticated. They don't need discounts — they want status and smart financial decisions. Rewards are table stakes.\n\nMetric: D7 and D30 retention rate, daily notification open rate, time spent in financial health section.`,
        },
        {
          q: "Design a feature to monetize CRED's user base.",
          difficulty: 'Hard',
          answer: `CRED has ~12M users, all with 750+ credit scores and above-average incomes. This is one of the most valuable consumer cohorts in India — brands pay a premium to reach them.\n\nCRED's current monetization: CRED Pay (checkout), CRED Cash (lending), CRED Travel, brand partnerships. The challenge: monetization without alienating users who chose CRED for its premium, low-noise experience.\n\nProposal: "CRED Curated" — a members-only marketplace for premium experiences and products. Think Amex Platinum benefits, but for India. Exclusive access to: first-row concert tickets, restaurant pre-bookings at premium restaurants, limited-edition products from premium brands (sneakers, watches, gadgets).\n\nMonetization: CRED takes a commission on each transaction (10–15%), and brands pay for featuring (monthly fee). Users pay with CRED coins or directly.\n\nWhy this works for CRED: (1) It reinforces the premium brand positioning, (2) It creates a transactional habit beyond bill pay, (3) Brands pay a premium CPM to reach this cohort — CRED can charge 3–5x standard rates.\n\nMetric: GMV through CRED Curated, brand partner retention (are brands renewing?), user NPS in Curated vs. non-Curated cohort.`,
        },
      ],
    },
  ],

  zepto: [
    {
      round: 'Operations & Strategy',
      questions: [
        {
          q: "How would you optimize Zepto's dark store operations?",
          difficulty: 'Hard',
          answer: `Zepto's promise is 10-minute delivery. Dark store efficiency is the core constraint — if pick-pack-dispatch takes 4 minutes, riders have 6 minutes to deliver. Every second in the store is a second the rider isn't moving.\n\nCurrent dark store inefficiencies: (1) High-velocity items stocked at the back of the store (picker walks more), (2) Picker routes are not optimized (zigzag vs. sweep), (3) Inventory replenishment interrupts live picking during peak hours.\n\nI'd focus on pick time optimization — the single biggest lever on 10-minute delivery.\n\nProposal: "Velocity-Based Store Layout" — AI-driven quarterly store rearrangement that places the top 50 highest-order-frequency SKUs in the first 30% of the picking zone, sorted by how often they appear together in orders. Picker routes generated by an algorithm that minimizes backtracking.\n\nAlso: separate replenishment shifts (5–7am, 2–4pm) with no picking activity, so peak hour pickers have unobstructed paths and full shelves.\n\nMetric: average pick time per order (target: under 2 minutes). Also track picker utilization rate and stockout rate during peak hours.`,
        },
        {
          q: 'Zepto wants to add a subscription model. Design it.',
          difficulty: 'Medium',
          answer: `Subscription models in quick commerce work when they reduce the variable cost enough to change behavior. Amazon Prime is the gold standard — $139/year changes how often people shop on Amazon.\n\nZepto's challenge: most users already pay ₹30–50 delivery fee per order. A subscription that eliminates this must generate enough repeat orders to be profitable for Zepto.\n\nProposal: "Zepto Pass" — ₹149/month (or ₹999/year). Benefits: (1) Free delivery on all orders above ₹199, (2) Exclusive "Pass Prices" — 5–10% lower price on 100 high-frequency SKUs (milk, eggs, bread, bananas), (3) Priority picking during peak hours (your order jumps the queue), (4) Access to "Flash Deals" — 50% off on select items for 30 minutes, Pass holders only.\n\nUnit economics: if a Pass user orders 3x per month (vs. 1.5x for non-Pass), the incremental order value offsets the delivery cost waiver. Pass Prices drive behavior because savings are visible on every session.\n\nMetric: Pass subscriber orders/month vs. control. Payback period on Pass subscription revenue.`,
        },
      ],
    },
  ],
};

// Sorted alphabetically for dropdown; Meta shows as "Meta/Facebook"
const DROPDOWN_LABEL = { meta: 'Meta/Facebook' };
const COMPANIES_SORTED = [...COMPANIES].sort((a, b) => {
  const la = (DROPDOWN_LABEL[a.id] || a.name).toLowerCase();
  const lb = (DROPDOWN_LABEL[b.id] || b.name).toLowerCase();
  return la < lb ? -1 : la > lb ? 1 : 0;
});

// ── Components ────────────────────────────────────────────────────────────────

function QuestionCard({ item, setPage }) {
  const [open, setOpen] = useState(false);
  const d = DIFF[item.difficulty] || DIFF.Medium;
  return (
    <div style={{
      background: C.card, borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      marginBottom: 12, overflow: 'hidden',
    }}>
      <div style={{ padding: '18px 20px' }}>
        {/* Tags row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: d.bg, color: d.color, border: `1px solid ${d.border}`,
          }}>
            {item.difficulty}
          </span>
        </div>

        {/* Question text */}
        <div style={{
          fontSize: 15, fontWeight: 600, color: C.text, lineHeight: 1.5,
          fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 14,
        }}>
          {item.q}
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage('practice')}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: '#16A34A', border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            Practice This →
          </button>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: 'transparent', border: `1.5px solid ${C.border}`, color: C.textMuted,
              fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif",
              cursor: 'pointer',
            }}
          >
            {open ? 'Hide Answer ▲' : 'Expert Answer ▼'}
          </button>
        </div>
      </div>

      {/* Expandable answer */}
      {open && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: '16px 20px',
          background: C.bgMuted,
        }}>
          {item.answer.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: 14, color: C.textMuted, lineHeight: 1.7,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              margin: i < item.answer.split('\n\n').length - 1 ? '0 0 12px' : 0,
            }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function CompanyView({ company, data, setPage }) {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: `${company.color}18`, border: `1.5px solid ${company.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: company.color,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            {company.initial || company.name[0]}
          </div>
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, color: C.text, margin: '0 0 4px' }}>
              {company.name} Interview Prep
            </h2>
            <div style={{ fontSize: 13, color: C.textLight, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {data.reduce((acc, r) => acc + r.questions.length, 0)} questions across {data.length} rounds
            </div>
          </div>
        </div>
      </div>

      {/* Rounds */}
      {data.map(round => (
        <div key={round.round} style={{ marginBottom: 36 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 3,
            textTransform: 'uppercase', color: C.textLight,
            marginBottom: 16,
          }}>
            {round.round}
          </div>
          {round.questions.map((item, i) => (
            <QuestionCard key={i} item={item} setPage={setPage} />
          ))}
        </div>
      ))}
    </div>
  );
}

function AllCompaniesView({ setPage }) {
  return (
    <div>
      {COMPANIES_SORTED.map(company => {
        const data = QUESTIONS[company.id];
        if (!data) return null;
        return (
          <div key={company.id} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: `${company.color}18`, border: `1.5px solid ${company.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: company.color,
                fontFamily: "'Plus Jakarta Sans', sans-serif", flexShrink: 0,
              }}>
                {company.initial || company.name[0]}
              </div>
              <h2 style={{
                fontFamily: "'Instrument Serif', serif", fontSize: 22, fontWeight: 400,
                color: C.text, margin: 0,
              }}>
                {DROPDOWN_LABEL[company.id] || company.name}
              </h2>
            </div>
            {data.map(round => (
              <div key={round.round} style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: 3,
                  textTransform: 'uppercase', color: C.textLight, marginBottom: 12,
                }}>
                  {round.round}
                </div>
                {round.questions.map((item, i) => (
                  <QuestionCard key={i} item={item} setPage={setPage} />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CompanyQuestions({ setPage }) {
  const [selected, setSelected] = useState('all');
  const company = COMPANIES.find(c => c.id === selected);
  const data = selected !== 'all' ? QUESTIONS[selected] : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Plus Jakarta Sans', sans-serif", paddingTop: NAV_H + 40 }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        @media (max-width: 600px) { .cq-page { padding: 24px 16px !important; } }
        .company-select {
          width: 100%; max-width: 400px;
          padding: 12px 16px; font-size: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;
          color: #0A0A0A; background: #FFFFFF;
          border: 1.5px solid #E8E6E1; border-radius: 12px;
          cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235C5C57' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
          outline: none;
        }
        .company-select:focus { border-color: #FF8A00; box-shadow: 0 0 0 3px rgba(255,138,0,0.12); }
        @media (max-width: 600px) { .company-select { max-width: 100%; } }
      `}</style>

      <div className="cq-page" style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 60px', animation: 'fadeUp 0.5s ease' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, fontWeight: 400, color: C.text, margin: '0 0 12px', lineHeight: 1.1 }}>
            Company-Specific Interview Prep
          </h1>
          <p style={{ fontSize: 16, color: C.textMuted, margin: '0 0 24px', lineHeight: 1.6 }}>
            Questions commonly asked at top tech companies, with expert answer frameworks.
          </p>

          {/* Dropdown */}
          <div>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 3,
              textTransform: 'uppercase', color: C.textLight, marginBottom: 10,
            }}>
              Select a Company
            </label>
            <select
              className="company-select"
              value={selected}
              onChange={e => setSelected(e.target.value)}
            >
              <option value="all">All Companies</option>
              {COMPANIES_SORTED.map(c => (
                <option key={c.id} value={c.id}>
                  {DROPDOWN_LABEL[c.id] || c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {selected === 'all' ? (
          <AllCompaniesView setPage={setPage} />
        ) : (
          <CompanyView
            company={company}
            data={data || []}
            setPage={setPage}
          />
        )}

      </div>
    </div>
  );
}
