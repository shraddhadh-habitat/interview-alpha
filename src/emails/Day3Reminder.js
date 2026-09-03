export const day3ReminderEmail = (userName, sessionsLeft) => ({
  subject: `${userName}, you have ${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''} left`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ede8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 0; }
    .body { padding: 36px 40px; }
    p { color: #6b6b6b; font-size: 0.92rem; line-height: 1.7; margin: 0 0 16px; }
    .urgency-box { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 12px; padding: 16px 20px; margin: 20px 0; text-align: center; }
    .urgency-box p { color: #dc2626; font-weight: 700; margin: 0; }
    .cta-button { display: block; background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; margin: 24px 0; }
    .footer { padding: 20px 40px; text-align: center; border-top: 1px solid #e4e1db; }
    .footer p { font-size: 0.75rem; color: #9a9a9a; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your free sessions are waiting</h1>
    </div>
    <div class="body">
      <p>Hi ${userName},</p>
      <p>You signed up 3 days ago and still have <strong>${sessionsLeft} free session${sessionsLeft !== 1 ? 's' : ''}</strong> unused.</p>

      ${sessionsLeft === 1 ? `
      <div class="urgency-box">
        <p>Only 1 free session left. Use it before it expires.</p>
      </div>
      ` : ''}

      <p>Here is what you are missing:</p>
      <p>Every session gives you a score across 8 competencies and an expert rewrite of your answer. Most users who see their first score say it is the most specific feedback they have ever gotten on an interview answer.</p>
      <p>Your next interview could be closer than you think. The best time to practice is right now.</p>

      <a href="https://interviewalpha.in" class="cta-button">Use a free session now</a>

      <p>It takes 2 minutes. You do not need to prepare anything.</p>
      <p>Shraddha<br>Founder, InterviewAlpha</p>
    </div>
    <div class="footer">
      <p>InterviewAlpha. <a href="https://interviewalpha.in" style="color: #a78bfa;">interviewalpha.in</a></p>
    </div>
  </div>
</body>
</html>
  `
});
