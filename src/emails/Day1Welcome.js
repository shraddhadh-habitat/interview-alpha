export const day1WelcomeEmail = (userName) => ({
  subject: `${userName}, here is how to make the most of your 3 free sessions`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0ede8; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 0; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 1.05rem; font-weight: 700; color: #111; margin-bottom: 16px; }
    p { color: #6b6b6b; font-size: 0.92rem; line-height: 1.7; margin: 0 0 16px; }
    .tip-card { background: #f9f8f6; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 3px solid #a78bfa; }
    .tip-card p { margin: 0; color: #444; }
    .tip-number { font-weight: 800; color: #a78bfa; margin-bottom: 6px; }
    .cta-button { display: block; background: linear-gradient(135deg, #a8e6cf 0%, #7ec8c8 25%, #a78bfa 65%, #c084fc 100%); color: #ffffff; text-decoration: none; text-align: center; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; margin: 24px 0; }
    .footer { padding: 20px 40px; text-align: center; border-top: 1px solid #e4e1db; }
    .footer p { font-size: 0.75rem; color: #9a9a9a; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to InterviewAlpha</h1>
    </div>
    <div class="body">
      <p class="greeting">Hi ${userName},</p>
      <p>You just signed up for InterviewAlpha. You have 3 free sessions waiting for you.</p>
      <p>Most people sign up and never start. Do not be that person. Here is how to make your 3 sessions count:</p>

      <div class="tip-card">
        <p class="tip-number">Session 1</p>
        <p>Answer any question cold, no preparation. Just like a real interview. See your score. This is your baseline.</p>
      </div>

      <div class="tip-card">
        <p class="tip-number">Session 2</p>
        <p>Read the expert rewrite from session 1 carefully. Then answer a similar question. Watch your score improve.</p>
      </div>

      <div class="tip-card">
        <p class="tip-number">Session 3</p>
        <p>Pick a company you want to work at. Answer one of their specific questions. This is the closest thing to a real interview you will get without being in the room.</p>
      </div>

      <a href="https://interviewalpha.ai" class="cta-button">Start your first session now</a>

      <p>Takes 2 minutes. No resume needed. Just answer like you are in the room.</p>
      <p>Good luck,<br><strong>Shraddha</strong><br>Founder, InterviewAlpha</p>
    </div>
    <div class="footer">
      <p>InterviewAlpha. Built for PM and Data Science aspirants.<br>
      <a href="https://interviewalpha.ai" style="color: #a78bfa;">interviewalpha.ai</a></p>
    </div>
  </div>
</body>
</html>
  `
});
