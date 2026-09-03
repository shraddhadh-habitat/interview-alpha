const C = {
  bg: '#FFFFFF',
  text: '#1B1B18',
  textMuted: 'rgba(27, 27, 24, 0.4)',
  border: 'rgba(27, 27, 24, 0.12)',
};

export default function TermsOfService() {
  const sections = [
    {
      title: 'AGREEMENT TO TERMS',
      content: 'By accessing or using InterviewAlpha.ai ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.'
    },
    {
      title: 'THE PLATFORM',
      content: 'InterviewAlpha.ai is an AI-powered interview preparation platform that provides practice questions, AI-scored feedback, resume tools, and career resources. The Platform is operated from Bangalore, India.'
    },
    {
      title: 'USER ACCOUNTS',
      content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. One account per person. Multiple accounts may be suspended without notice. You must be at least 18 years old to use the Platform.'
    },
    {
      title: 'SUBSCRIPTION AND PAYMENTS',
      content: 'Free users receive limited access to AI features. Pro subscribers receive unlimited access to AI interview sessions, resume tools, and all premium features. Payments are processed via UPI. Subscriptions are non-refundable once activated. We reserve the right to change pricing with 30 days notice to existing subscribers.'
    },
    {
      title: 'AI-GENERATED CONTENT',
      content: 'Feedback provided by the AI interviewer (Alpha) is for educational purposes only. It does not guarantee interview success or job placement. AI responses may occasionally contain inaccuracies. Users should use their own judgment alongside AI feedback.'
    },
    {
      title: 'INTELLECTUAL PROPERTY',
      content: 'All questions, scoring frameworks, AI methodologies, and content on InterviewAlpha.ai are proprietary. You may not copy, reproduce, distribute, or create derivative works from the Platform\'s content without written permission. InterviewAlpha is a trademark of InterviewAlpha.ai.'
    },
    {
      title: 'USER CONTENT',
      content: 'By submitting answers, resumes, or other content to the Platform, you grant InterviewAlpha.ai a non-exclusive license to process that content for the purpose of providing feedback. We do not sell or share your resume or answer content with third parties. Your practice answers may be used in aggregate (anonymized) to improve AI quality.'
    },
    {
      title: 'ACCEPTABLE USE',
      content: 'You agree not to: use the Platform for any unlawful purpose, attempt to gain unauthorized access, scrape or copy content, create multiple accounts to abuse free sessions, share your account credentials with others, or use the Platform to generate content that infringes on third-party rights.'
    },
    {
      title: 'LIMITATION OF LIABILITY',
      content: 'InterviewAlpha.ai is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to interview outcomes, career decisions, or reliance on AI feedback. Our total liability shall not exceed the amount you paid for the service in the preceding 12 months.'
    },
    {
      title: 'TERMINATION',
      content: 'We reserve the right to suspend or terminate your account at any time for violation of these terms. You may delete your account by contacting communications@interviewalpha.in.'
    },
    {
      title: 'CHANGES TO TERMS',
      content: 'We may update these Terms from time to time. Continued use of the Platform after changes constitutes acceptance of the revised Terms.'
    },
    {
      title: 'GOVERNING LAW',
      content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.'
    },
    {
      title: 'CONTACT',
      content: 'For questions about these Terms, contact us at communications@interviewalpha.in.'
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
          .terms-container { padding: 20px 16px 40px !important; }
        }
      `}</style>

      <div className="terms-container" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 28,
            fontWeight: 600,
            color: C.text,
            marginBottom: 8,
          }}>
            Terms of Service
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
