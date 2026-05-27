const PM_QUESTIONS = [
  {
    category: 'PRODUCT MANAGEMENT',
    question: "Zepto delivers in 10 minutes. A new competitor promises 7 minutes. You're the PM — do you try to match them, or do you differentiate? What's your strategy?",
    tip: "Think about user value, unit economics, and long-term positioning — not just speed."
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "CRED has 35M users with high credit scores but low daily active usage. You're the PM. What's the one feature you build next and why?",
    tip: "Focus on the engagement gap — why do users have the app but not open it daily?"
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "Google Maps knows where 1 billion people are at any moment. You're the PM — what's one monetization idea that doesn't creep users out?",
    tip: "Balance business value with user trust. Think about opt-in models and contextual relevance."
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "PhonePe wants to expand into rural India where 60% of users are first-time smartphone owners. You're the PM — what's your onboarding strategy?",
    tip: "Think about literacy, language, trust barriers, and what 'simple' really means for this audience."
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "Notion is losing users to a simpler competitor. Your retention data shows users who create 3+ pages in week 1 never churn. You're the PM — what do you do?",
    tip: "You've found your activation metric. Now think about how to engineer that behavior."
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "Ola's ride cancellation rate by drivers is 18%. You're the PM — diagnose the root cause and propose a solution without hurting driver earnings.",
    tip: "Think about driver incentives, surge mechanics, and what trade-offs each solution creates."
  },
  {
    category: 'PRODUCT MANAGEMENT',
    question: "LinkedIn wants to launch a feature for students with no work experience. You're the PM — what do you build and how do you measure success?",
    tip: "Define who the user really is, what they need vs. want, and what success looks like in 6 months."
  },
];

const DS_QUESTIONS = [
  {
    category: 'DATA SCIENCE',
    question: "Zomato's delivery time prediction model is 91% accurate but restaurant partners say it's wrong 'all the time.' How do you investigate this gap?",
    tip: "Think about aggregate accuracy vs. segment-level accuracy. Where does 91% hide the failures?"
  },
  {
    category: 'DATA SCIENCE',
    question: "You built a churn model for a D2C brand. It flags 10,000 users monthly but the sales team can only call 500. How do you decide which 500?",
    tip: "This is about prioritization under constraint — think expected value, not just churn probability."
  },
  {
    category: 'DATA SCIENCE',
    question: "PhonePe's fraud detection model blocks 0.1% of transactions. How do you measure if it's actually working when you can't label blocked transactions as fraud or not?",
    tip: "Think about counterfactuals, shadow testing, and how you'd build a ground truth dataset."
  },
  {
    category: 'DATA SCIENCE',
    question: "A recommender system at Flipkart shows higher CTR after a new model update, but revenue per session drops. How do you explain and resolve this?",
    tip: "CTR and revenue can diverge. Think about what the model optimized for and what it ignored."
  },
  {
    category: 'DATA SCIENCE',
    question: "You run an A/B test for 2 weeks. The treatment group shows +8% conversion. Your manager wants to ship it immediately. What questions do you ask first?",
    tip: "Think about statistical significance, practical significance, novelty effect, and segment interactions."
  },
  {
    category: 'DATA SCIENCE',
    question: "BYJU's wants to predict which students will drop their subscription next month. You have 18 months of behavioral data. Walk me through your approach.",
    tip: "Cover feature engineering, model choice, evaluation metric selection, and how you'd deploy it."
  },
  {
    category: 'DATA SCIENCE',
    question: "A food delivery app sees a sudden 40% spike in average delivery time on a Tuesday afternoon. You have 10 minutes to present findings to the CEO. What do you do?",
    tip: "Think fast diagnosis — segment by city, restaurant, driver, time of day. Where does the spike concentrate?"
  },
];

// Rotate question every 20 minutes using current time
function getRotatingQuestion() {
  const allQuestions = [...PM_QUESTIONS, ...DS_QUESTIONS];
  const minutesSinceEpoch = Math.floor(Date.now() / (1000 * 60));
  const blockIndex = Math.floor(minutesSinceEpoch / 20);
  return allQuestions[blockIndex % allQuestions.length];
}

export default function OnboardingQuestion() {
  const question = getRotatingQuestion();

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e4e1db',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <div style={{
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#a8e6cf',
        fontWeight: 700,
        marginBottom: '8px'
      }}>
        {question.category}
      </div>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1a1a1a',
        marginBottom: '12px',
        lineHeight: 1.5
      }}>
        {question.question}
      </h3>
      <p style={{
        fontSize: '0.85rem',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '12px'
      }}>
        💡 {question.tip}
      </p>
    </div>
  );
}
