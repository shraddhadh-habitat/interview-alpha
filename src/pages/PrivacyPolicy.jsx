const C = {
  bg: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.4)',
  border: 'rgba(27, 27, 24, 0.12)',
};

export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'INTRODUCTION',
      content: 'InterviewAlpha.ai ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Platform.'
    },
    {
      title: 'INFORMATION WE COLLECT',
      content: 'Account Information: name, email address, mobile number, and password (encrypted). Practice Data: your answers to interview questions, AI feedback received, scores, and session history. Resume Data: resume text or files you upload for ATS checking or optimization. Usage Data: pages visited, features used, session duration, and browser/device information. Payment Data: UPI transaction IDs for subscription payments. We do not store your UPI credentials.'
    },
    {
      title: 'HOW WE USE YOUR INFORMATION',
      content: 'To provide AI-powered interview feedback and scoring. To operate the ATS checker and resume optimization features. To track your practice progress and generate scorecards. To communicate with you about your account and updates. To improve our AI models and question quality (using anonymized, aggregate data only). To prevent abuse and enforce our Terms of Service.'
    },
    {
      title: 'DATA STORAGE AND SECURITY',
      content: 'Your data is stored on secure servers managed by Supabase (hosted in Mumbai, India). Passwords are encrypted using industry-standard hashing. We use HTTPS encryption for all data transmission. We do not sell your personal information to third parties.'
    },
    {
      title: 'RESUME AND ANSWER DATA',
      content: 'Resumes uploaded for ATS checking or optimization are processed by AI and are not permanently stored after processing. Your practice answers are stored in your account to enable progress tracking. You can request deletion of all your data by contacting us.'
    },
    {
      title: 'COOKIES AND TRACKING',
      content: 'We use essential cookies to maintain your login session. We do not use third-party advertising trackers. We use basic analytics to understand Platform usage.'
    },
    {
      title: 'YOUR RIGHTS',
      content: 'You have the right to: access your personal data, correct inaccurate information, delete your account and associated data, withdraw consent for data processing, and export your practice history. To exercise these rights, contact communications@interviewalpha.ai.'
    },
    {
      title: 'DATA RETENTION',
      content: 'We retain your data as long as your account is active. If you delete your account, your personal data will be removed within 30 days. Anonymized aggregate data may be retained for research purposes.'
    },
    {
      title: 'THIRD-PARTY SERVICES',
      content: 'We use the following third-party services: Supabase (database and authentication), Vercel (hosting), Anthropic (AI processing). Each has their own privacy policies. We do not share your personal information beyond what is necessary for these services to function.'
    },
    {
      title: 'CHILDREN\'S PRIVACY',
      content: 'The Platform is not intended for users under 18 years of age. We do not knowingly collect information from minors.'
    },
    {
      title: 'CHANGES TO THIS POLICY',
      content: 'We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email.'
    },
    {
      title: 'CONTACT',
      content: 'For privacy-related questions or requests, contact us at communications@interviewalpha.ai.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: C.text,
      paddingTop: 60,
    }}>
      <style>{`
        @media (max-width: 768px) {
          .privacy-container { padding: 20px 16px 40px !important; }
        }
      `}</style>

      <div className="privacy-container" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            fontWeight: 600,
            color: C.text,
            marginBottom: 8,
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontSize: 13,
            color: C.textMuted,
            margin: 0,
          }}>
            Last updated: May 23, 2026
          </p>
        </div>

        {/* Content */}
        <div>
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                marginTop: idx === 0 ? 0 : 32,
                marginBottom: 12,
              }}>
                {section.title}
              </h2>
              <p style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: C.text,
                margin: '0 0 16px 0',
              }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
